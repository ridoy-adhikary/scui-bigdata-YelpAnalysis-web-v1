import { apiClient } from './apiClient';
import axios from 'axios';
import type { ChatQueryRequest, ChatQueryResponse } from '../types/chatbot.types';

const AI_ENDPOINT = '/api/ai/ask' as const;
const AI_FALLBACK_TIMEOUT_MS = 120000;
const AI_RETRY_TIMEOUT_MS = 180000;

const toPositiveNumber = (value: unknown): number | undefined => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return parsed;
};

const getAiTimeoutMs = (): number => {
  return toPositiveNumber(import.meta.env.VITE_AI_TIMEOUT_MS)
    ?? toPositiveNumber(import.meta.env.VITE_API_TIMEOUT_MS)
    ?? AI_FALLBACK_TIMEOUT_MS;
};

const mapModeToTone = (mode: ChatQueryRequest['mode']): 'friendly' | 'professional' | 'casual' => {
  if (mode === 'business') return 'professional';
  return 'friendly';
};

const buildPayload = (payload: ChatQueryRequest) => ({
  question: payload.query,
  tone: mapModeToTone(payload.mode),
  session_id: payload.sessionId,
});

const sanitizeAnswer = (answer: string): string => {
  return answer
    .split('\n')
    .filter((line) => !/download\s+as\s+csv/i.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const keepDescriptionOnlyWhenTableExists = (answer: string): string => {
  const firstPipeIndex = answer.indexOf('|');
  const beforeTable = firstPipeIndex >= 0 ? answer.slice(0, firstPipeIndex) : answer;
  const firstParagraph = beforeTable.split(/\n{2,}/)[0]?.trim();

  return firstParagraph || 'The table is available in the structured result panel on the right.';
};

const stripMarkdownTables = (text: string): string => {
  const lines = text.split(/\r?\n/);
  const kept: string[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i] ?? '';
    const divider = lines[i + 1] ?? '';
    const isHeaderCandidate = line.includes('|');
    const isDivider = /^\|?\s*[-:]+(?:\s*\|\s*[-:]+)+\s*\|?$/.test(divider.trim());

    if (isHeaderCandidate && isDivider) {
      i += 1;
      while (i + 1 < lines.length && (lines[i + 1] ?? '').includes('|')) {
        i += 1;
      }
      continue;
    }

    kept.push(line);
  }

  return kept.join('\n').replace(/\n{3,}/g, '\n\n').trim();
};

const normalizeSqlText = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const withoutFence = trimmed
    .replace(/^```(?:sql)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .replace(/^generated\s+sql\s*:\s*/i, '')
    .trim();

  if (!withoutFence) return undefined;
  return withoutFence.replace(/;?\s*$/, ';');
};

const extractSqlFromPayload = (payload: any): string | undefined => {
  const candidates: unknown[] = [
    payload?.sql,
    payload?.query,
    payload?.generated_sql,
    payload?.generatedQuery,
    payload?.executed_sql,
    payload?.meta?.sql,
    payload?.meta?.query,
    payload?.meta?.generated_sql,
    payload?.meta?.executed_sql,
  ];

  for (const candidate of candidates) {
    const sql = normalizeSqlText(candidate);
    if (!sql) continue;
    if (/\b(select|with|insert|update|delete)\b/i.test(sql)) return sql;
  }

  return undefined;
};

const extractSqlFromAnswer = (answer: string): string | undefined => {
  const fencedMatch = answer.match(/```\s*sql\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    return normalizeSqlText(fencedMatch[1]);
  }

  const generatedLabelIdx = answer.search(/generated\s+sql\s*:/i);
  if (generatedLabelIdx >= 0) {
    const trailing = answer.slice(generatedLabelIdx).replace(/generated\s+sql\s*:/i, '').trim();
    const possibleSql = normalizeSqlText(trailing);
    if (possibleSql && /\b(select|with|insert|update|delete)\b/i.test(possibleSql)) {
      return possibleSql;
    }
  }

  return undefined;
};

const stripSqlArtifacts = (text: string): string => {
  const withoutFencedSql = text.replace(/```\s*sql[\s\S]*?```/gi, '').trim();
  const generatedLabelIdx = withoutFencedSql.search(/generated\s+sql\s*:/i);
  const withoutGeneratedLabel = generatedLabelIdx >= 0
    ? withoutFencedSql.slice(0, generatedLabelIdx).trim()
    : withoutFencedSql;

  return withoutGeneratedLabel.replace(/\n{3,}/g, '\n\n').trim();
};

const hasMarkdownTable = (text: string): boolean => {
  return /\|.+\|\s*\n\s*\|\s*[-:]+[-|\s:]*\|/m.test(text);
};

const parseTableCellValue = (value: string): string | number | boolean | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^(true|false)$/i.test(trimmed)) return trimmed.toLowerCase() === 'true';

  const numeric = Number(trimmed.replace(/,/g, ''));
  if (Number.isFinite(numeric) && /^-?\d+(\.\d+)?$/.test(trimmed.replace(/,/g, ''))) {
    return numeric;
  }

  return trimmed;
};

const splitMarkdownRow = (line: string): string[] => {
  const sentinel = '__PIPE_SENTINEL__';
  const normalized = line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .replace(/\\\|/g, sentinel);

  return normalized
    .split('|')
    .map((cell) => cell.replaceAll(sentinel, '|').trim());
};

const extractTableFromMarkdown = (
  text: string
): { columns: string[]; rows: Array<Array<string | number | boolean | null>> } | undefined => {
  const lines = text.split(/\r?\n/);

  for (let i = 0; i < lines.length - 1; i += 1) {
    const headerLine = lines[i]?.trim();
    const dividerLine = lines[i + 1]?.trim();

    if (!headerLine || !dividerLine) continue;
    if (!headerLine.includes('|')) continue;
    if (!/^\|?\s*[-:]+(?:\s*\|\s*[-:]+)+\s*\|?$/.test(dividerLine)) continue;

    const columns = splitMarkdownRow(headerLine);
    if (columns.length < 2 || columns.some((column) => !column)) continue;

    const rows: Array<Array<string | number | boolean | null>> = [];
    for (let j = i + 2; j < lines.length; j += 1) {
      const rowLine = lines[j]?.trim();
      if (!rowLine) break;
      if (!rowLine.includes('|')) break;

      const cells = splitMarkdownRow(rowLine);
      if (!cells.length) break;

      rows.push(columns.map((_, idx) => parseTableCellValue(cells[idx] ?? '')));
    }

    if (rows.length) {
      return { columns, rows };
    }
  }

  return undefined;
};

const isConversationalQuery = (query?: string): boolean => {
  if (!query) return false;
  const normalized = query.trim().toLowerCase();
  return /^(hi|hello|hey|thanks|thank you|how are you|who are you|what can you do|help)\b/.test(normalized);
};

const isAnalyticsQuery = (query?: string): boolean => {
  if (!query) return false;
  const normalized = query.trim().toLowerCase();

  if (isConversationalQuery(normalized)) return false;

  return /(top|count|sum|avg|average|group by|trend|distribution|city|state|rating|review|merchant|business|table|chart|sql|query|find|show|list|compare|analy[sz]e)/i.test(normalized);
};

const shouldExposeSql = (query: string | undefined, sql: string | undefined): boolean => {
  if (!sql) return false;
  if (!isAnalyticsQuery(query)) return false;
  return true;
};

const isMetaOrGreetingTable = (table: { columns: string[]; rows: Array<Array<unknown>> }): boolean => {
  const normalizedColumns = table.columns.map((c) => String(c).trim().toLowerCase());
  const isTiny = table.columns.length <= 2 && table.rows.length <= 1;
  const hasMetaColumn = normalizedColumns.some((c) =>
    ['greeting', 'intent', 'type', 'category', 'label'].includes(c)
  );

  if (!isTiny && !hasMetaColumn) return false;

  const flattened = table.rows.flat().map((cell) => String(cell ?? '').trim().toLowerCase());
  const hasGreetingValue = flattened.some((value) =>
    /^(hello|hi|hey|greeting|small talk|smalltalk|help)$/.test(value)
  );

  return hasMetaColumn || hasGreetingValue;
};

const shouldExposeTable = (
  table: { columns: string[]; rows: Array<Array<unknown>> } | undefined,
  query?: string
): boolean => {
  if (!table) return false;
  if (!table.columns.length || !table.rows.length) return false;
  if (isConversationalQuery(query)) return false;
  if (isMetaOrGreetingTable(table)) return false;
  return true;
};

const normalizeResponse = (payload: any, query?: string): ChatQueryResponse => {
  const rawAnswer = payload?.answer || payload?.response || payload?.message || '';
  const sqlCandidate = extractSqlFromPayload(payload) ?? extractSqlFromAnswer(rawAnswer);
  const sqlFromPayload = shouldExposeSql(query, sqlCandidate) ? sqlCandidate : undefined;
  const hasColumnsAndRows = Array.isArray(payload?.columns) && Array.isArray(payload?.rows);
  const parsedMarkdownTable = hasMarkdownTable(rawAnswer)
    ? extractTableFromMarkdown(rawAnswer)
    : undefined;
  const tableCandidate = payload?.table || (hasColumnsAndRows
    ? {
        columns: payload.columns,
        rows: payload.rows,
      }
    : undefined) || parsedMarkdownTable;
  const exposeTable = shouldExposeTable(tableCandidate, query);
  const table = exposeTable ? tableCandidate : undefined;
  const hasTableLikeContent = Boolean(tableCandidate) || hasMarkdownTable(rawAnswer);
  const baseAnswerText = stripSqlArtifacts(hasTableLikeContent ? stripMarkdownTables(rawAnswer) : rawAnswer);
  const answerText = hasTableLikeContent
    ? (baseAnswerText || keepDescriptionOnlyWhenTableExists(rawAnswer))
    : baseAnswerText;

  return {
    sessionId: payload?.sessionId ?? payload?.session_id,
    answer: sanitizeAnswer(answerText),
    sql: sqlFromPayload,
    table,
    chart: payload?.chart,
    meta: payload?.meta || {
      processingMs: typeof payload?.execution_time_seconds === 'number'
        ? Math.round(payload.execution_time_seconds * 1000)
        : undefined,
    },
  };
};

export const queryChatbot = async (payload: ChatQueryRequest): Promise<ChatQueryResponse> => {
  const aiTimeoutMs = getAiTimeoutMs();

  try {
    const response = await apiClient.post(AI_ENDPOINT, buildPayload(payload), {
      timeout: aiTimeoutMs,
    });
    return normalizeResponse(response.data, payload.query);
  } catch (error) {
    const didTimeout = axios.isAxiosError(error) && error.code === 'ECONNABORTED';

    if (!didTimeout) {
      throw error;
    }

    const retryTimeoutMs = Math.max(AI_RETRY_TIMEOUT_MS, aiTimeoutMs);
    const retryResponse = await apiClient.post(AI_ENDPOINT, buildPayload(payload), {
      timeout: retryTimeoutMs,
    });
    return normalizeResponse(retryResponse.data, payload.query);
  }
};


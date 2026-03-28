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
  const answerText = hasTableLikeContent
    ? keepDescriptionOnlyWhenTableExists(rawAnswer)
    : rawAnswer;

  return {
    sessionId: payload?.sessionId ?? payload?.session_id,
    answer: sanitizeAnswer(answerText),
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


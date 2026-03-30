export interface Message {
  id: string;
  text: string;
  sql?: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatQueryRequest {
  sessionId?: string;
  query: string;
  mode?: 'business' | 'friend';
  filters?: Record<string, string | number | boolean | null | undefined>;
}

export interface ChatTableResult {
  columns: string[];
  rows: Array<Array<string | number | boolean | null>>;
}

export interface ChatChartResult {
  type: 'bar' | 'pie' | 'line';
  title?: string;
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
  }>;
}

export interface ChatQueryResponse {
  sessionId?: string;
  answer: string;
  sql?: string;
  table?: ChatTableResult;
  chart?: ChatChartResult;
  meta?: {
    source?: string[];
    model?: string;
    processingMs?: number;
  };
}

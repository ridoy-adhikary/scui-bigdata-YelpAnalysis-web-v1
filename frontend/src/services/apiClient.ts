import axios from 'axios';

const configuredBaseURL = import.meta.env.VITE_API_BASE_URL?.trim();
const defaultHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const baseURL = (configuredBaseURL && configuredBaseURL.replace(/\/+$/, '')) || `http://${defaultHost}:8000`;

const timeout = Number(import.meta.env.VITE_API_TIMEOUT_MS || '30000');

export const apiClient = axios.create({
  baseURL,
  timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiErrorShape {
  error?: {
    code?: string;
    message?: string;
  };
  message?: string;
  detail?: string;
}

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorShape | undefined;
    return payload?.error?.message || payload?.detail || payload?.message || error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Request failed unexpectedly.';
};


import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { store } from '../store';
import type { ApiError } from '../types/api';

// Extend Axios config to carry a request start timestamp
interface TimedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _startTime?: number;
}

// ─── 429 rate-limit pause ───────────────────────────────────────────────────
const RATE_LIMIT_PAUSE_MS = 5000;
let rateLimitedUntil = 0;

const apiClient = axios.create({
  baseURL: 'https://rickandmortyapi.com/api',
  timeout: 10000,
});

// ─── Request interceptor ────────────────────────────────────────────────────
apiClient.interceptors.request.use((config: TimedAxiosRequestConfig) => {
  // Block requests while we're in the 429 cooldown window
  const remaining = rateLimitedUntil - Date.now();
  if (remaining > 0) {
    console.warn(`[API] ⏸ Request blocked — rate limited for ${remaining}ms more`);
    const apiError: ApiError = {
      message: `Rate limited. Please wait ${Math.ceil(remaining / 1000)}s before retrying.`,
      statusCode: 429,
      originalError: null,
    };
    return Promise.reject(apiError);
  }

  // Stamp the start time so we can compute duration on response
  config._startTime = Date.now();

  const state = store.getState();
  const token = (state as Record<string, unknown> & { auth?: { token?: string } }).auth?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(
    `[API] ▶ ${(config.method ?? 'GET').toUpperCase()} ${config.baseURL ?? ''}${config.url ?? ''}`,
    ...(config.params ? ['| params:', config.params] : []),
    ...(config.data   ? ['| body:',   config.data]   : []),
  );

  return config;
});

// ─── Response interceptor ───────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => {
    const cfg = response.config as TimedAxiosRequestConfig;
    const duration = cfg._startTime ? `${Date.now() - cfg._startTime}ms` : '?ms';

    console.log(
      `[API] ✅ ${(cfg.method ?? 'GET').toUpperCase()} ${cfg.url ?? ''} → ${response.status} (${duration})`,
    );

    return response;
  },
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const cfg = axiosError.config as TimedAxiosRequestConfig | undefined;
      const duration = cfg?._startTime ? `${Date.now() - cfg._startTime}ms` : '?ms';
      const statusCode = axiosError.response?.status ?? 0;

      console.error(
        `[API] ❌ ${(cfg?.method ?? 'GET').toUpperCase()} ${cfg?.url ?? ''} → ${statusCode || 'NO_RESPONSE'} (${duration})`,
        '\n  message:', axiosError.message,
        ...(axiosError.response?.data ? ['\n  data:', axiosError.response.data] : []),
      );

      if (statusCode === 429) {
        rateLimitedUntil = Date.now() + RATE_LIMIT_PAUSE_MS;
        console.warn(`[API] ⚠️ 429 received — pausing all requests for ${RATE_LIMIT_PAUSE_MS / 1000}s`);
      }

      const apiError: ApiError = {
        message: statusCode === 429
          ? `Too many requests. Pausing for ${RATE_LIMIT_PAUSE_MS / 1000}s.`
          : axiosError.message,
        statusCode,
        originalError: axiosError,
      };
      return Promise.reject(apiError);
    }

    // Non-Axios error — wrap it
    console.error('[API] ❌ Unexpected error:', error);
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Unknown error',
      statusCode: 0,
      originalError: error,
    };
    return Promise.reject(apiError);
  },
);

export default apiClient;

export function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.get<T>(url, config).then(res => res.data);
}

export function post<T>(url: string, body: unknown, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.post<T>(url, body, config).then(res => res.data);
}

export function put<T>(url: string, body: unknown, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.put<T>(url, body, config).then(res => res.data);
}

export function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.delete<T>(url, config).then(res => res.data);
}

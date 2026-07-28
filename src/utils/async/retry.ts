import { sleep } from './sleep';

export interface RetryOptions {
  retries?: number;
  delayMs?: number;
  backoff?: number;
  maxDelayMs?: number;
  onRetry?: (error: unknown, attempt: number) => void;
}

export const retry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> => {
  const {
    retries = 3,
    delayMs = 500,
    backoff = 2,
    maxDelayMs = 30_000,
    onRetry,
  } = options;

  let attempt = 0;
  let lastError: unknown;

  while (attempt <= retries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      onRetry?.(error, attempt + 1);
      const wait = Math.min(delayMs * backoff ** attempt, maxDelayMs);
      await sleep(wait);
      attempt += 1;
    }
  }

  throw lastError;
};

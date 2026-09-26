import {
  classifyProviderRetryDecision,
} from "./providerRetryPolicy";

import {
  calculateProviderRetryBackoffMs,
  RetryBackoffKind,
} from "./providerRetryBackoff";

export interface RetryExecutorOptions {
  maxAttempts: number;

  sleep?: (
    delayMs: number
  ) => Promise<void>;
}

function getRetryBackoffKind(
  message: string
): RetryBackoffKind {
  return message.includes(
    "Yahoo rate limit (HTTP 429)"
  )
    ? "RATE_LIMIT"
    : "TRANSIENT";
}

export async function executeProviderOperationWithRetry<T>(
  operation: () => Promise<T>,
  options: RetryExecutorOptions
): Promise<T> {
  const {
    maxAttempts,
    sleep =
      async () => {},
  } = options;

  if (
    !Number.isInteger(maxAttempts) ||
    maxAttempts < 1
  ) {
    throw new Error(
      "maxAttempts must be at least 1"
    );
  }

  const retryStartedAt = performance.now();

  let attempt = 0;

  while (
    attempt < maxAttempts
  ) {
    attempt += 1;

    const attemptStartedAt = performance.now();

    try {
      return await operation();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : String(error);

      const decision =
        classifyProviderRetryDecision(
          message
        );

      if (
        decision === "DO_NOT_RETRY" ||
        attempt >= maxAttempts
      ) {
        throw error;
      }

      const backoffKind =
        getRetryBackoffKind(
          message
        );

      const delayMs =
        calculateProviderRetryBackoffMs(
          backoffKind,
          attempt
        );

      await sleep(
        delayMs
      );
    } finally {
      console.log(
        `PROVIDER RETRY ATTEMPT ${attempt}/${maxAttempts}:`,
        `${(performance.now() - attemptStartedAt).toFixed(2)} ms`,
        `TOTAL ${(performance.now() - retryStartedAt).toFixed(2)} ms`
      );
    }
  }

  throw new Error(
    "Retry executor reached unreachable state"
  );
}

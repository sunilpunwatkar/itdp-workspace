import {
  classifyProviderRetryDecision,
} from "./providerRetryPolicy";

export interface RetryExecutorOptions {
  maxAttempts: number;

  sleep?: (
    delayMs: number
  ) => Promise<void>;
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

  let attempt = 0;

  while (
    attempt < maxAttempts
  ) {
    attempt += 1;

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

      await sleep(0);
    }
  }

  throw new Error(
    "Retry executor reached unreachable state"
  );
}
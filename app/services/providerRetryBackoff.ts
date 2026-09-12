export type RetryBackoffKind =
  | "RATE_LIMIT"
  | "TRANSIENT";

export function calculateProviderRetryBackoffMs(
  kind: RetryBackoffKind,
  failedAttempt: number
): number {
  if (
    !Number.isInteger(failedAttempt) ||
    failedAttempt < 1
  ) {
    throw new Error(
      "failedAttempt must be at least 1"
    );
  }

  const baseDelay =
    kind === "RATE_LIMIT"
      ? 2000
      : 500;

  return (
    baseDelay *
    Math.pow(
      2,
      failedAttempt - 1
    )
  );
}
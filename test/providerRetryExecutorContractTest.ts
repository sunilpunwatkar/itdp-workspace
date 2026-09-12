import {
  executeProviderOperationWithRetry,
} from "../app/services/providerRetryExecutor";
import {
  classifyProviderRetryDecision,
} from "../app/services/providerRetryPolicy";

function assertEqual<T>(
  label: string,
  actual: T,
  expected: T
) {
  if (actual !== expected) {
    throw new Error(
      `${label} FAILED | Expected=${expected} | Actual=${actual}`
    );
  }

  console.log(
    `PASS | ${label} | ${String(actual)}`
  );
}





async function run() {
  console.log(
    "=== PROVIDER RETRY EXECUTOR CONTRACT TEST ==="
  );

  // ==================================================
  // CASE 1
  // SUCCESS ON FIRST ATTEMPT
  // ==================================================

  let firstAttemptCount = 0;

  const firstResult =
    await executeProviderOperationWithRetry(
      async () => {
        firstAttemptCount += 1;

        return "SUCCESS";
      },
      {
        maxAttempts: 3,
      }
    );

  assertEqual(
    "First Attempt Result",
    firstResult,
    "SUCCESS"
  );

  assertEqual(
    "First Attempt Count",
    firstAttemptCount,
    1
  );

  // ==================================================
  // CASE 2
  // RETRYABLE FAILURE THEN SUCCESS
  // ==================================================

  let retryThenSuccessCount = 0;

  const retryThenSuccessResult =
    await executeProviderOperationWithRetry(
      async () => {
        retryThenSuccessCount += 1;

        if (
          retryThenSuccessCount === 1
        ) {
          throw new Error(
            "Yahoo historical HTTP 503 for TEST.NS."
          );
        }

        return "RECOVERED";
      },
      {
        maxAttempts: 3,
      }
    );

  assertEqual(
    "Retry Then Success Result",
    retryThenSuccessResult,
    "RECOVERED"
  );

  assertEqual(
    "Retry Then Success Attempts",
    retryThenSuccessCount,
    2
  );

  // ==================================================
  // CASE 3
  // NON-RETRYABLE FAILURE
  // ==================================================

  let permanentFailureCount = 0;

  try {
    await executeProviderOperationWithRetry(
      async () => {
        permanentFailureCount += 1;

        throw new Error(
          "Yahoo historical HTTP 404 for UNKNOWN.NS."
        );
      },
      {
        maxAttempts: 3,
      }
    );

    throw new Error(
      "EXPECTED_NON_RETRYABLE_FAILURE"
    );
  } catch (error) {
    assertEqual(
      "Non-Retryable Attempts",
      permanentFailureCount,
      1
    );
  }

  // ==================================================
  // CASE 4
  // MAX ATTEMPTS ENFORCED
  // ==================================================

  let exhaustedCount = 0;

  try {
    await executeProviderOperationWithRetry(
      async () => {
        exhaustedCount += 1;

        throw new Error(
          "Yahoo historical HTTP 500 for TEST.NS."
        );
      },
      {
        maxAttempts: 3,
      }
    );

    throw new Error(
      "EXPECTED_RETRY_EXHAUSTION"
    );
  } catch (error) {
    assertEqual(
      "Maximum Attempts",
      exhaustedCount,
      3
    );
  }

  // ==================================================
  // CASE 5
  // TIMEOUT IS RETRIED
  // ==================================================

  let timeoutCount = 0;

  const timeoutResult =
    await executeProviderOperationWithRetry(
      async () => {
        timeoutCount += 1;

        if (
          timeoutCount === 1
        ) {
          throw new Error(
            "Yahoo OHLC request timed out after 12s for TEST.NS"
          );
        }

        return "TIMEOUT_RECOVERED";
      },
      {
        maxAttempts: 2,
      }
    );

  assertEqual(
    "Timeout Retry Result",
    timeoutResult,
    "TIMEOUT_RECOVERED"
  );

  assertEqual(
    "Timeout Retry Attempts",
    timeoutCount,
    2
  );

  console.log("");
  console.log(
    "ALL PROVIDER RETRY EXECUTOR CONTRACT CASES PASS"
  );
}

run().catch((error) => {
  console.error("");
  console.error(
    "PROVIDER RETRY EXECUTOR CONTRACT: FAILED"
  );

  console.error(error);

  process.exit(1);
});
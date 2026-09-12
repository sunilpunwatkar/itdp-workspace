import {
  executeProviderOperationWithRetry,
} from "../app/services/providerRetryExecutor";

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
    "=== PROVIDER RETRY BACKOFF INTEGRATION CONTRACT ==="
  );

  // ==================================================
  // CASE 1
  // HTTP 503 → 500ms, 1000ms
  // ==================================================

  let transientAttempts = 0;

  const transientSleeps: number[] = [];

  const transientResult =
    await executeProviderOperationWithRetry(
      async () => {
        transientAttempts += 1;

        if (
          transientAttempts <= 2
        ) {
          throw new Error(
            "Yahoo historical HTTP 503 for TEST.NS."
          );
        }

        return "RECOVERED";
      },
      {
        maxAttempts: 3,

        sleep: async (
          delayMs
        ) => {
          transientSleeps.push(
            delayMs
          );
        },
      }
    );

  assertEqual(
    "503 Recovery Result",
    transientResult,
    "RECOVERED"
  );

  assertEqual(
    "503 Attempt Count",
    transientAttempts,
    3
  );

  assertEqual(
    "503 First Backoff",
    transientSleeps[0],
    500
  );

  assertEqual(
    "503 Second Backoff",
    transientSleeps[1],
    1000
  );

  assertEqual(
    "503 Sleep Count",
    transientSleeps.length,
    2
  );

  // ==================================================
  // CASE 2
  // HTTP 429 → 2000ms, 4000ms
  // ==================================================

  let rateLimitAttempts = 0;

  const rateLimitSleeps: number[] = [];

  const rateLimitResult =
    await executeProviderOperationWithRetry(
      async () => {
        rateLimitAttempts += 1;

        if (
          rateLimitAttempts <= 2
        ) {
          throw new Error(
            "Yahoo rate limit (HTTP 429) for TEST.NS."
          );
        }

        return "RATE_LIMIT_RECOVERED";
      },
      {
        maxAttempts: 3,

        sleep: async (
          delayMs
        ) => {
          rateLimitSleeps.push(
            delayMs
          );
        },
      }
    );

  assertEqual(
    "429 Recovery Result",
    rateLimitResult,
    "RATE_LIMIT_RECOVERED"
  );

  assertEqual(
    "429 Attempt Count",
    rateLimitAttempts,
    3
  );

  assertEqual(
    "429 First Backoff",
    rateLimitSleeps[0],
    2000
  );

  assertEqual(
    "429 Second Backoff",
    rateLimitSleeps[1],
    4000
  );

  assertEqual(
    "429 Sleep Count",
    rateLimitSleeps.length,
    2
  );

  // ==================================================
  // CASE 3
  // HTTP 404 → NO RETRY, NO SLEEP
  // ==================================================

  let permanentAttempts = 0;

  const permanentSleeps: number[] = [];

  try {
    await executeProviderOperationWithRetry(
      async () => {
        permanentAttempts += 1;

        throw new Error(
          "Yahoo historical HTTP 404 for UNKNOWN.NS."
        );
      },
      {
        maxAttempts: 3,

        sleep: async (
          delayMs
        ) => {
          permanentSleeps.push(
            delayMs
          );
        },
      }
    );
  } catch {
    // Expected failure.
  }

  assertEqual(
    "404 Attempt Count",
    permanentAttempts,
    1
  );

  assertEqual(
    "404 Sleep Count",
    permanentSleeps.length,
    0
  );

  // ==================================================
  // CASE 4
  // SUCCESS → NO SLEEP
  // ==================================================

  const successSleeps: number[] = [];

  const successResult =
    await executeProviderOperationWithRetry(
      async () => {
        return "SUCCESS";
      },
      {
        maxAttempts: 3,

        sleep: async (
          delayMs
        ) => {
          successSleeps.push(
            delayMs
          );
        },
      }
    );

  assertEqual(
    "Immediate Success Result",
    successResult,
    "SUCCESS"
  );

  assertEqual(
    "Immediate Success Sleep Count",
    successSleeps.length,
    0
  );

  // ==================================================
  // CASE 5
  // FINAL FAILURE → NO EXTRA SLEEP
  // ==================================================

  let exhaustedAttempts = 0;

  const exhaustedSleeps: number[] = [];

  try {
    await executeProviderOperationWithRetry(
      async () => {
        exhaustedAttempts += 1;

        throw new Error(
          "Yahoo historical HTTP 500 for TEST.NS."
        );
      },
      {
        maxAttempts: 3,

        sleep: async (
          delayMs
        ) => {
          exhaustedSleeps.push(
            delayMs
          );
        },
      }
    );
  } catch {
    // Expected failure.
  }

  assertEqual(
    "Exhausted Attempt Count",
    exhaustedAttempts,
    3
  );

  assertEqual(
    "Exhausted Sleep Count",
    exhaustedSleeps.length,
    2
  );

  assertEqual(
    "Exhausted First Backoff",
    exhaustedSleeps[0],
    500
  );

  assertEqual(
    "Exhausted Second Backoff",
    exhaustedSleeps[1],
    1000
  );

  console.log("");

  console.log(
    "ALL PROVIDER RETRY BACKOFF INTEGRATION CASES PASS"
  );
}

run().catch((error) => {
  console.error("");

  console.error(
    "PROVIDER RETRY BACKOFF INTEGRATION CONTRACT: FAILED"
  );

  console.error(
    error
  );

  process.exit(1);
});
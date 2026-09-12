import {
  HistoricalProvider,
} from "../app/providers/historicalProvider";

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

async function captureErrorMessage(
  fn: () => Promise<unknown>
): Promise<string> {
  try {
    await fn();

    throw new Error(
      "EXPECTED_ERROR_NOT_THROWN"
    );
  } catch (error) {
    return error instanceof Error
      ? error.message
      : String(error);
  }
}

async function run() {
  console.log(
    "=== HISTORICAL PROVIDER ERROR CONTRACT TEST ==="
  );

  const provider =
    new HistoricalProvider();

  const originalFetch =
    globalThis.fetch;

  try {
    // ==================================================
    // CASE 1
    // HTTP 429 RATE LIMIT
    // ==================================================

    globalThis.fetch =
      async () =>
        new Response(
          "{}",
          {
            status: 429,
            statusText:
              "Too Many Requests",
          }
        );

    const rateLimitMessage =
      await captureErrorMessage(
        () =>
          provider.getHistoricalOHLC(
            "TEST.RATE_LIMIT.NS"
          )
      );

    assertEqual(
      "HTTP 429 Contract",
      rateLimitMessage,
      "Yahoo rate limit (HTTP 429) for TEST.RATE_LIMIT.NS."
    );

    // ==================================================
    // CASE 2
    // HTTP 500
    // ==================================================

    globalThis.fetch =
      async () =>
        new Response(
          "{}",
          {
            status: 500,
            statusText:
              "Internal Server Error",
          }
        );

    const http500Message =
      await captureErrorMessage(
        () =>
          provider.getHistoricalOHLC(
            "TEST.HTTP_500.NS"
          )
      );

    assertEqual(
      "HTTP 500 Contract",
      http500Message,
      "Yahoo historical HTTP 500 for TEST.HTTP_500.NS."
    );

    // ==================================================
    // CASE 3
    // ABORT / TIMEOUT SHAPE
    // ==================================================

    globalThis.fetch =
      async () => {
        const error =
          new Error(
            "Controlled abort"
          );

        error.name =
          "AbortError";

        throw error;
      };

    const timeoutMessage =
      await captureErrorMessage(
        () =>
          provider.getHistoricalOHLC(
            "TEST.TIMEOUT.NS"
          )
      );

    assertEqual(
      "Timeout Contract",
      timeoutMessage,
      "Yahoo OHLC request timed out after 12s for TEST.TIMEOUT.NS"
    );

    console.log("");
    console.log(
      "ALL HISTORICAL PROVIDER ERROR CONTRACT CASES PASS"
    );
  } finally {
    globalThis.fetch =
      originalFetch;
  }
}

run().catch((error) => {
  console.error("");
  console.error(
    "HISTORICAL PROVIDER ERROR CONTRACT: FAILED"
  );

  console.error(error);

  process.exit(1);
});
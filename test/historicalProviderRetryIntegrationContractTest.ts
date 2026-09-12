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

async function run() {
  console.log(
    "=== HISTORICAL PROVIDER RETRY INTEGRATION CONTRACT ==="
  );

  const originalFetch =
    globalThis.fetch;

  try {
    // ==================================================
    // CASE 1
    // 503 THEN SUCCESS
    // ==================================================

    let transientFetchCount = 0;

    globalThis.fetch =
      async () => {
        transientFetchCount += 1;

        if (
          transientFetchCount === 1
        ) {
          return new Response(
            "{}",
            {
              status: 503,
            }
          );
        }

        return new Response(
          JSON.stringify({
            chart: {
              result: [
                {
                  timestamp: [
                    1,
                    2,
                    3,
                  ],

                  indicators: {
                    quote: [
                      {
                        open: [
                          100,
                          101,
                          102,
                        ],

                        high: [
                          101,
                          102,
                          103,
                        ],

                        low: [
                          99,
                          100,
                          101,
                        ],

                        close: [
                          100,
                          101,
                          102,
                        ],

                        volume: [
                          1000,
                          1100,
                          1200,
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          }),
          {
            status: 200,

            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );
      };

    const transientSleeps:
      number[] = [];

    const transientProvider =
      new HistoricalProvider(
        async (
          delayMs: number
        ) => {
          transientSleeps.push(
            delayMs
          );
        }
      );

    const transientResult =
      await transientProvider
        .getHistoricalOHLC(
          "TEST.RETRY.503.NS"
        );

    assertEqual(
      "503 Fetch Count",
      transientFetchCount,
      2
    );

    assertEqual(
      "503 Backoff",
      transientSleeps[0],
      500
    );

    assertEqual(
      "503 Result Length",
      transientResult.close.length,
      3
    );

    // ==================================================
    // CASE 2
    // 429 THEN SUCCESS
    // ==================================================

    let rateLimitFetchCount = 0;

    globalThis.fetch =
      async () => {
        rateLimitFetchCount += 1;

        if (
          rateLimitFetchCount === 1
        ) {
          return new Response(
            "{}",
            {
              status: 429,
            }
          );
        }

        return new Response(
          JSON.stringify({
            chart: {
              result: [
                {
                  timestamp: [1],

                  indicators: {
                    quote: [
                      {
                        open: [100],
                        high: [101],
                        low: [99],
                        close: [100],
                        volume: [1000],
                      },
                    ],
                  },
                },
              ],
            },
          }),
          {
            status: 200,

            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );
      };

    const rateLimitSleeps:
      number[] = [];

    const rateLimitProvider =
      new HistoricalProvider(
        async (
          delayMs: number
        ) => {
          rateLimitSleeps.push(
            delayMs
          );
        }
      );

    await rateLimitProvider
      .getHistoricalOHLC(
        "TEST.RETRY.429.NS"
      );

    assertEqual(
      "429 Fetch Count",
      rateLimitFetchCount,
      2
    );

    assertEqual(
      "429 Backoff",
      rateLimitSleeps[0],
      2000
    );

    // ==================================================
    // CASE 3
    // 404 MUST NOT RETRY
    // ==================================================

    let permanentFetchCount = 0;

    globalThis.fetch =
      async () => {
        permanentFetchCount += 1;

        return new Response(
          "{}",
          {
            status: 404,
          }
        );
      };

    const permanentSleeps:
      number[] = [];

    const permanentProvider =
      new HistoricalProvider(
        async (
          delayMs: number
        ) => {
          permanentSleeps.push(
            delayMs
          );
        }
      );

    try {
      await permanentProvider
        .getHistoricalOHLC(
          "TEST.RETRY.404.NS"
        );
    } catch {
      // Expected.
    }

    assertEqual(
      "404 Fetch Count",
      permanentFetchCount,
      1
    );

    assertEqual(
      "404 Sleep Count",
      permanentSleeps.length,
      0
    );

    console.log("");

    console.log(
      "ALL HISTORICAL PROVIDER RETRY INTEGRATION CASES PASS"
    );
  } finally {
    globalThis.fetch =
      originalFetch;
  }
}

run().catch((error) => {
  console.error("");

  console.error(
    "HISTORICAL PROVIDER RETRY INTEGRATION CONTRACT: FAILED"
  );

  console.error(
    error
  );

  process.exit(1);
});
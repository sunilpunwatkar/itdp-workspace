import {
  YahooProvider,
  clearQuoteCacheForTest,
} from "../app/providers/yahooProvider";

function assertEqual<T>(
  label: string,
  actual: T,
  expected: T
): void {
  if (actual !== expected) {
    throw new Error(
      `${label}: expected ${String(expected)}, received ${String(actual)}`
    );
  }

  console.log(`${label}: PASS`);
}

function buildYahooQuoteResponse(
  symbol: string,
  price: number
): Response {
  return new Response(
    JSON.stringify({
      chart: {
        result: [
          {
            meta: {
              symbol,
              regularMarketPrice: price,
            },
            indicators: {
              quote: [
                {
                  open: [price - 1],
                  high: [price + 1],
                  low: [price - 2],
                  close: [price],
                  volume: [1000000],
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
        "Content-Type": "application/json",
      },
    }
  );
}

async function run(): Promise<void> {
  console.log(
    "=== YAHOO QUOTE RETRY INTEGRATION CONTRACT ==="
  );

  const originalFetch =
    globalThis.fetch;

  try {
    // ==================================================
    // CASE 1
    // 429 THEN SUCCESS
    // ==================================================

    const rateLimitSymbol =
      "TEST.QUOTE.RETRY.429";

    clearQuoteCacheForTest(
      rateLimitSymbol
    );

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

        return buildYahooQuoteResponse(
          rateLimitSymbol,
          500
        );
      };

    const rateLimitProvider =
      new YahooProvider();

    const rateLimitResult =
      await rateLimitProvider.getQuote(
        rateLimitSymbol
      );

    assertEqual(
      "429 Fetch Count",
      rateLimitFetchCount,
      2
    );

    assertEqual(
      "429 Recovered Price",
      rateLimitResult.price,
      500
    );

    clearQuoteCacheForTest(
      rateLimitSymbol
    );

    // ==================================================
    // CASE 2
    // 503 THEN SUCCESS
    // ==================================================

    const transientSymbol =
      "TEST.QUOTE.RETRY.503";

    clearQuoteCacheForTest(
      transientSymbol
    );

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

        return buildYahooQuoteResponse(
          transientSymbol,
          600
        );
      };

    const transientProvider =
      new YahooProvider();

    const transientResult =
      await transientProvider.getQuote(
        transientSymbol
      );

    assertEqual(
      "503 Fetch Count",
      transientFetchCount,
      2
    );

    assertEqual(
      "503 Recovered Price",
      transientResult.price,
      600
    );

    clearQuoteCacheForTest(
      transientSymbol
    );

    // ==================================================
    // CASE 3
    // 404 MUST NOT RETRY
    // ==================================================

    const permanentSymbol =
      "TEST.QUOTE.RETRY.404";

    clearQuoteCacheForTest(
      permanentSymbol
    );

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

    const permanentProvider =
      new YahooProvider();

    try {
      await permanentProvider.getQuote(
        permanentSymbol
      );
    } catch {
      // Expected.
    }

    assertEqual(
      "404 Fetch Count",
      permanentFetchCount,
      1
    );

    clearQuoteCacheForTest(
      permanentSymbol
    );

    console.log("");
    console.log(
      "ALL YAHOO QUOTE RETRY INTEGRATION CASES PASS"
    );
  } finally {
    globalThis.fetch =
      originalFetch;
  }
}

run().catch((error) => {
  console.error("");
  console.error(
    "YAHOO QUOTE RETRY INTEGRATION CONTRACT: FAILED"
  );
  console.error(error);

  process.exit(1);
});
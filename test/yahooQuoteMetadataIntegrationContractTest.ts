import assert from "node:assert/strict";

import {
  YahooProvider,
  clearQuoteCacheForTest,
} from "../app/providers/yahooProvider";

import {
  clearStockMetadataCacheForTest,
  getCachedStockMetadata,
} from "../app/services/stockMetadataService";

async function run(): Promise<void> {
  console.log(
    "=== YAHOO QUOTE METADATA INTEGRATION CONTRACT ==="
  );

  const symbol =
    "TEST.METADATA.NS";

  clearQuoteCacheForTest(
    symbol
  );

  clearStockMetadataCacheForTest(
    symbol
  );

  const originalFetch =
    globalThis.fetch;

  let fetchCount = 0;

  globalThis.fetch =
    async () => {
      fetchCount += 1;

      return new Response(
        JSON.stringify({
          chart: {
            result: [
              {
                meta: {
                  symbol,

                  regularMarketPrice:
                    1500,

                  longName:
                    "Test Industries Limited",

                  shortName:
                    "TEST INDUSTRIES LTD",

                  fullExchangeName:
                    "NSE",

                  exchangeName:
                    "NSI",

                  instrumentType:
                    "EQUITY",

                  currency:
                    "INR",
                },

                indicators: {
                  quote: [
                    {
                      open: [1490],
                      high: [1510],
                      low: [1480],
                      close: [1500],
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
            "Content-Type":
              "application/json",
          },
        }
      );
    };

  try {
    const provider =
      new YahooProvider();

    // ===============================================
    // EXISTING QUOTE CONTRACT
    // ===============================================

    const quote =
      await provider.getQuote(
        symbol
      );

    assert.equal(
      quote.symbol,
      symbol,
      "Existing MarketData symbol must remain unchanged"
    );

    assert.equal(
      quote.price,
      1500,
      "Existing MarketData price must remain unchanged"
    );

    console.log(
      "PASS: existing quote contract preserved"
    );

    // ===============================================
    // ZERO EXTRA YAHOO REQUEST
    // ===============================================

    assert.equal(
      fetchCount,
      1,
      "Quote and metadata must come from one Yahoo HTTP request"
    );

    console.log(
      "PASS: single Yahoo HTTP request"
    );

    // ===============================================
    // METADATA CAPTURE
    // ===============================================

    const metadata =
      getCachedStockMetadata(
        symbol
      );

    assert.deepEqual(
      metadata,
      {
        symbol,

        companyName:
          "Test Industries Limited",

        exchange:
          "NSE",

        instrumentType:
          "EQUITY",

        currency:
          "INR",
      },
      "Yahoo quote response must populate metadata cache"
    );

    console.log(
      "PASS: metadata captured from quote response"
    );

    // ===============================================
    // CACHE READ MUST NOT FETCH
    // ===============================================

    getCachedStockMetadata(
      symbol
    );

    assert.equal(
      fetchCount,
      1,
      "Reading cached metadata must not trigger another Yahoo request"
    );

    console.log(
      "PASS: metadata read requires no Yahoo request"
    );

    console.log("");

    console.log(
      "YAHOO QUOTE METADATA INTEGRATION CONTRACT: PASS"
    );
  } finally {
    globalThis.fetch =
      originalFetch;

    clearQuoteCacheForTest(
      symbol
    );

    clearStockMetadataCacheForTest(
      symbol
    );
  }
}

run().catch((error) => {
  console.error("");

  console.error(
    "YAHOO QUOTE METADATA INTEGRATION CONTRACT: FAILED"
  );

  console.error(error);

  process.exit(1);
});
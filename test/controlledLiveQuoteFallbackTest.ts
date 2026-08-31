import {
  getMarketData,
} from "../app/services/marketDataEngine";

import {
  seedHistoricalCacheForTest,
  clearHistoricalCacheForTest,
} from "../app/services/historicalDataCache";

import { MarketProvider } from "../app/providers/marketProvider";

const symbol = "TEST.FALLBACK";

const testData = {
  timestamps: Array.from(
    { length: 201 },
    (_, i) => 1000000000 + i * 86400
  ),

  open: Array.from(
    { length: 201 },
    (_, i) => 100 + i
  ),

  high: Array.from(
    { length: 201 },
    (_, i) => 105 + i
  ),

  low: Array.from(
    { length: 201 },
    (_, i) => 98 + i
  ),

  close: Array.from(
    { length: 201 },
    (_, i) => 103 + i
  ),

  volume: Array.from(
    { length: 201 },
    (_, i) => 1000 + i * 10
  ),
};

const failingMarketProvider: MarketProvider = {
  async getQuote(symbol: string) {

    console.log(
      `CONTROLLED LIVE QUOTE FAILURE: ${symbol}`
    );

    throw new Error(
      "Controlled Live Quote Failure"
    );
  },
};

async function runTest() {

  console.log(
    "=== CONTROLLED LIVE QUOTE FALLBACK TEST ==="
  );

  clearHistoricalCacheForTest(symbol);

  seedHistoricalCacheForTest(
    symbol,
    testData,
    Date.now()
  );

  console.log(
    "TEST 1: Historical fallback data seeded: PASS"
  );

  try {

    const result =
      await getMarketData(
        symbol,
        failingMarketProvider
      );

    const expectedPrice =
      testData.close[
        testData.close.length - 1
      ];

    const fallbackUsed =
      result.quote.price === expectedPrice;

    console.log(
      `TEST 2: Historical fallback quote used: ${
        fallbackUsed
          ? "PASS"
          : "FAIL"
      }`
    );

    if (!fallbackUsed) {

      console.log(
        "Expected fallback price:",
        expectedPrice
      );

      console.log(
        "Actual quote:",
        result.quote
      );

      process.exit(1);
    }

    const symbolValid =
      result.quote.symbol ===
      "TEST.FALLBACK";

    console.log(
      `TEST 3: Fallback quote symbol valid: ${
        symbolValid
          ? "PASS"
          : "FAIL"
      }`
    );

    if (!symbolValid) {

      console.log(
        "Actual quote:",
        result.quote
      );

      process.exit(1);
    }

    const historicalDataValid =
      result.prices.length === 201 &&
      result.prices[
        result.prices.length - 1
      ] === expectedPrice;

    console.log(
      `TEST 4: Historical prices preserved: ${
        historicalDataValid
          ? "PASS"
          : "FAIL"
      }`
    );

    if (!historicalDataValid) {

      console.log(
        "Prices length:",
        result.prices.length
      );

      console.log(
        "Latest price:",
        result.prices[
          result.prices.length - 1
        ]
      );

      process.exit(1);
    }

    const ohlcValid =
      result.ohlc.close.length === 201 &&
      result.ohlc.open.length === 201 &&
      result.ohlc.high.length === 201 &&
      result.ohlc.low.length === 201 &&
      result.ohlc.volume.length === 201;

    console.log(
      `TEST 5: Historical OHLC preserved: ${
        ohlcValid
          ? "PASS"
          : "FAIL"
      }`
    );

    if (!ohlcValid) {

      console.log(
        "OHLC lengths:",
        {
          close: result.ohlc.close.length,
          open: result.ohlc.open.length,
          high: result.ohlc.high.length,
          low: result.ohlc.low.length,
          volume: result.ohlc.volume.length,
        }
      );

      process.exit(1);
    }

    console.log(
      "Fallback Quote:",
      result.quote
    );

    console.log(
      "Historical Prices:",
      result.prices.length
    );

    console.log(
      "Latest Historical Price:",
      result.prices[
        result.prices.length - 1
      ]
    );

    console.log(
      "=== FINAL CHECK ==="
    );

    console.log({
      totalTests: 5,
      passed: 5,
      failed: 0,
      allPassed: true,
    });

  } catch (error) {

    console.error(
      "Live Quote fallback test failed:",
      error
    );

    process.exit(1);

  } finally {

    clearHistoricalCacheForTest(symbol);

  }
}

runTest().catch((error) => {

  console.error(
    "TEST RUNNER ERROR:",
    error
  );

  process.exit(1);

});


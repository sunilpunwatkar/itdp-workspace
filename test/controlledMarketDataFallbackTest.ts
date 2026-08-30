import { getMarketData } from "../app/services/marketDataEngine";
import { MarketProvider } from "../app/providers/marketProvider";

const failingProvider: MarketProvider = {

  async getQuote(symbol: string) {

    throw new Error(
      `CONTROLLED LIVE QUOTE FAILURE: ${symbol}`
    );
  },

};

async function runTest() {

  console.log(
    "=== CONTROLLED MARKET DATA FALLBACK TEST ==="
  );

  try {

    const result =
      await getMarketData(
        "RELIANCE",
        failingProvider
      );

    const lastHistoricalPrice =
      result.prices[
        result.prices.length - 1
      ];

    const fallbackWorked =
      result.quote.price ===
      lastHistoricalPrice;

    console.log(
      "TEST 1: Historical Data Available:",
      result.prices.length > 0
        ? "PASS"
        : "FAIL"
    );

    console.log(
      "TEST 2: Live Quote Forced Failure: PASS"
    );

    console.log(
      "TEST 3: Historical Fallback:",
      fallbackWorked
        ? "PASS"
        : "FAIL"
    );

    console.log(
      "Fallback Price:",
      result.quote.price
    );

    console.log(
      "Last Historical Price:",
      lastHistoricalPrice
    );

    console.log(
      "=== FINAL CHECK ==="
    );

    console.log({
      totalTests: 3,
      passed:
        (result.prices.length > 0 ? 1 : 0) +
        1 +
        (fallbackWorked ? 1 : 0),
      failed:
        (result.prices.length > 0 ? 0 : 1) +
        (fallbackWorked ? 0 : 1),
      allPassed:
        result.prices.length > 0 &&
        fallbackWorked,
    });

  } catch (error) {

    console.error(
      "TEST ERROR:",
      error
    );

  }

}

runTest();
import {
  seedHistoricalCacheForTest,
  clearHistoricalCacheForTest,
} from "../app/services/historicalDataCache";

import {
  seedQuoteCacheForTest,
  clearQuoteCacheForTest,
} from "../app/providers/yahooProvider";

import { getStockAnalysis } from "../services/stockAnalysisService";

import { MarketProvider } from "../app/providers/marketProvider";
import { MarketData } from "../app/providers/marketProvider";

const SYMBOL = "TEST.DOUBLE";

const FALLBACK_PRICE = 303;

// ============================================
// CONTROLLED HISTORICAL DATA
// ============================================

const historicalData = {
  timestamps: Array.from(
    { length: 250 },
    (_, i) =>
      Math.floor(
        new Date("2025-01-01").getTime() / 1000
      ) +
      i * 86400
  ),

  open: Array.from(
    { length: 250 },
    () => 300
  ),

  high: Array.from(
    { length: 250 },
    () => 305
  ),

  low: Array.from(
    { length: 250 },
    () => 295
  ),

  close: Array.from(
    { length: 250 },
    () => FALLBACK_PRICE
  ),

  volume: Array.from(
    { length: 250 },
    () => 1000000
  ),
};

// ============================================
// EXPIRED QUOTE CACHE
// ============================================

const expiredQuote: MarketData = {
  symbol: SYMBOL,
  price: FALLBACK_PRICE,
  open: 300,
  high: 305,
  low: 295,
  close: FALLBACK_PRICE,
  volume: 1000000,
};

// ============================================
// CONTROLLED MARKET PROVIDER
// BOTH LIVE + HISTORICAL EXTERNAL PATHS
// ARE EXPECTED TO FAIL
// ============================================

const failingMarketProvider: MarketProvider = {

  async getQuote(symbol: string) {

    console.log(
      `CONTROLLED LIVE QUOTE FAILURE: ${symbol}`
    );

    throw new Error(
      `Controlled Live Quote Failure: ${symbol}`
    );
  },

};

// ============================================
// MAIN TEST
// ============================================

async function runTest() {

  console.log(
    "=== CONTROLLED DOUBLE FALLBACK TEST ==="
  );

  try {

    // ==========================================
    // TEST 1
    // Seed STALE historical cache
    // ==========================================

    const staleTimestamp =
      Date.now() -
      (60 * 60 * 1000);

    seedHistoricalCacheForTest(
      SYMBOL,
      historicalData,
      staleTimestamp
    );

    console.log(
      "TEST 1: Stale historical cache seeded: PASS"
    );

    // ==========================================
    // TEST 2
    // Seed EXPIRED quote cache
    // ==========================================

    const expiredQuoteTimestamp =
      Date.now() -
      (60 * 1000);

    seedQuoteCacheForTest(
      SYMBOL,
      expiredQuote,
      expiredQuoteTimestamp
    );

    console.log(
      "TEST 2: Expired quote cache seeded: PASS"
    );

    // ==========================================
    // TEST 3
    // FULL ANALYSIS
    // ==========================================

    const result =
      await getStockAnalysis(
        SYMBOL,
        failingMarketProvider
      );

    console.log(
      "TEST 3: Full analysis completed: PASS"
    );

    // ==========================================
    // TEST 4
    // Verify fallback price
    // ==========================================

    const fallbackPriceValid =
      result.entry === FALLBACK_PRICE;

    console.log(
      "TEST 4: Expired quote fallback propagated:",
      fallbackPriceValid
        ? "PASS"
        : "FAIL"
    );

    // ==========================================
    // TEST 5
    // Verify decision exists
    // ==========================================

    const decisionValid =
      result.decision === "BUY" ||
      result.decision === "SELL" ||
      result.decision === "HOLD";

    console.log(
      "TEST 5: Decision generated:",
      decisionValid
        ? "PASS"
        : "FAIL"
    );

    // ==========================================
    // TEST 6
    // Verify confidence
    // ==========================================

    const confidenceValid =
      typeof result.confidence === "number" &&
      result.confidence >= 0 &&
      result.confidence <= 100;

    console.log(
      "TEST 6: Confidence valid:",
      confidenceValid
        ? "PASS"
        : "FAIL"
    );

    // ==========================================
    // TEST 7
    // Verify reasons
    // ==========================================

    const reasonsValid =
      Array.isArray(result.reasons) &&
      result.reasons.length > 0;

    console.log(
      "TEST 7: Analysis reasons generated:",
      reasonsValid
        ? "PASS"
        : "FAIL"
    );

    // ==========================================
    // FINAL CHECK
    // ==========================================

    const passed =
      (fallbackPriceValid ? 1 : 0) +
      (decisionValid ? 1 : 0) +
      (confidenceValid ? 1 : 0) +
      (reasonsValid ? 1 : 0);

    const failed =
      4 - passed;

    console.log(
      "Final Analysis Result:",
      result
    );

    console.log(
      "=== FINAL CHECK ==="
    );

    console.log({
      totalTests: 7,
      passed:
        3 + passed,
      failed,
      allPassed:
        failed === 0,
    });

  } catch (error) {

    console.error(
      "TEST ERROR:",
      error
    );

    process.exit(1);

  } finally {

    // ==========================================
    // CLEANUP
    // ==========================================

    clearHistoricalCacheForTest(
      SYMBOL
    );

    clearQuoteCacheForTest(
      SYMBOL
    );

    console.log(
      "TEST CLEANUP: PASS"
    );
  }
}

runTest();
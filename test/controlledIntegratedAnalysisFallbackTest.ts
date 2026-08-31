import {
  seedHistoricalCacheForTest,
  clearHistoricalCacheForTest,
} from "../app/services/historicalDataCache";

import { getStockAnalysis } from "../services/stockAnalysisService";

import { MarketProvider } from "../app/providers/marketProvider";

const SYMBOL = "TEST.INTEGRATED";

const historicalClose = 303;

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
    () => historicalClose
  ),

  volume: Array.from(
    { length: 250 },
    () => 1000000
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
    "=== CONTROLLED INTEGRATED ANALYSIS FALLBACK TEST ==="
  );

  let passed = 0;
  let failed = 0;

  // =========================================
  // TEST 1
  // =========================================

  seedHistoricalCacheForTest(
    SYMBOL,
    historicalData
  );

  console.log(
    "TEST 1: Historical data seeded: PASS"
  );

  passed++;

  try {

    // =======================================
    // FULL ANALYSIS PIPELINE
    // =======================================

    const result =
      await getStockAnalysis(
        SYMBOL,
        failingMarketProvider
      );

    // =======================================
    // TEST 2
    // =======================================

    if (
      result.symbol === SYMBOL
    ) {

      console.log(
        "TEST 2: Analysis symbol valid: PASS"
      );

      passed++;

    } else {

      console.log(
        "TEST 2: Analysis symbol valid: FAIL"
      );

      failed++;
    }

    // =======================================
    // TEST 3
    // =======================================

    if (
      result.entry === historicalClose
    ) {

      console.log(
        "TEST 3: Historical fallback price propagated to entry: PASS"
      );

      passed++;

    } else {

      console.log(
        "TEST 3: Historical fallback price propagated to entry: FAIL"
      );

      console.log(
        "Expected entry:",
        historicalClose
      );

      console.log(
        "Actual entry:",
        result.entry
      );

      failed++;
    }

    // =======================================
    // TEST 4
    // =======================================

    if (
      result.decision === "BUY" ||
      result.decision === "SELL" ||
      result.decision === "HOLD"
    ) {

      console.log(
        "TEST 4: Decision generated: PASS"
      );

      passed++;

    } else {

      console.log(
        "TEST 4: Decision generated: FAIL"
      );

      failed++;
    }

    // =======================================
    // TEST 5
    // =======================================

    if (
      Number.isFinite(result.confidence) &&
      result.confidence >= 0 &&
      result.confidence <= 100
    ) {

      console.log(
        "TEST 5: Confidence valid: PASS"
      );

      passed++;

    } else {

      console.log(
        "TEST 5: Confidence valid: FAIL"
      );

      failed++;
    }

    // =======================================
    // TEST 6
    // =======================================

    if (
      result.risk === "LOW" ||
      result.risk === "MEDIUM" ||
      result.risk === "HIGH"
    ) {

      console.log(
        "TEST 6: Risk valid: PASS"
      );

      passed++;

    } else {

      console.log(
        "TEST 6: Risk valid: FAIL"
      );

      failed++;
    }

    // =======================================
    // TEST 7
    // =======================================

    if (
      Number.isFinite(result.stopLoss) &&
      Number.isFinite(result.target)
    ) {

      console.log(
        "TEST 7: Risk values generated: PASS"
      );

      passed++;

    } else {

      console.log(
        "TEST 7: Risk values generated: FAIL"
      );

      failed++;
    }

    // =======================================
    // TEST 8
    // =======================================

    if (
      Array.isArray(result.reasons) &&
      result.reasons.length > 0
    ) {

      console.log(
        "TEST 8: Analysis reasons generated: PASS"
      );

      passed++;

    } else {

      console.log(
        "TEST 8: Analysis reasons generated: FAIL"
      );

      failed++;
    }

    // =======================================
    // FINAL OUTPUT
    // =======================================

    console.log(
      "Final Analysis Result:",
      result
    );

  } catch (error) {

    console.error(
      "INTEGRATED ANALYSIS TEST ERROR:",
      error
    );

    failed++;

  } finally {

    clearHistoricalCacheForTest(
      SYMBOL
    );

  }

  console.log(
    "=== FINAL CHECK ==="
  );

  console.log({
    totalTests: passed + failed,
    passed,
    failed,
    allPassed: failed === 0,
  });
}

runTest();
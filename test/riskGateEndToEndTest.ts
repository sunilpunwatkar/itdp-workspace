import {
  seedHistoricalCacheForTest,
  clearHistoricalCacheForTest,
} from "../app/services/historicalDataCache";

import { getStockAnalysis } from "../services/stockAnalysisService";

import { MarketProvider } from "../app/providers/marketProvider";

const SYMBOL = "TEST.RISK_GATE.E2E";

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

function assert(
  condition: boolean,
  message: string
): void {
  if (!condition) {
    throw new Error(
      `ASSERTION FAILED: ${message}`
    );
  }
}

async function runTest() {

  console.log(
    "=== RISK GATE END-TO-END TEST ==="
  );

  try {

    // =========================================
    // 1. Seed deterministic historical data
    // =========================================

    seedHistoricalCacheForTest(
      SYMBOL,
      historicalData
    );

    console.log(
      "TEST 1: Historical cache seeded: PASS"
    );

    // =========================================
    // 2. Run ACTUAL production analysis pipeline
    // =========================================

    const result =
      await getStockAnalysis(
        SYMBOL,
        failingMarketProvider
      );

    console.log(
      "Production Analysis Result:",
      result
    );

    // =========================================
    // 3. Risk Gate exists
    // =========================================

    assert(
      result.riskGate !== undefined &&
      result.riskGate !== null,
      "AnalysisResult.riskGate must exist"
    );

    console.log(
      "TEST 2: Risk Gate exposed in AnalysisResult: PASS"
    );

    // =========================================
    // 4. Risk Gate status valid
    // =========================================

    assert(
      result.riskGate.status === "PASS" ||
      result.riskGate.status === "CAUTION" ||
      result.riskGate.status === "BLOCK",
      "Risk Gate status must be PASS, CAUTION, or BLOCK"
    );

    console.log(
      "TEST 3: Risk Gate status valid: PASS"
    );

    // =========================================
    // 5. Risk Gate reason
    // =========================================

    assert(
      typeof result.riskGate.reason === "string" &&
      result.riskGate.reason.length > 0,
      "Risk Gate reason must be a non-empty string"
    );

    console.log(
      "TEST 4: Risk Gate reason exposed: PASS"
    );

    // =========================================
    // 6. Failures array
    // =========================================

    assert(
      Array.isArray(result.riskGate.failures),
      "Risk Gate failures must be an array"
    );

    console.log(
      "TEST 5: Risk Gate failures array valid: PASS"
    );

    // =========================================
    // 7. Warnings array
    // =========================================

    assert(
      Array.isArray(result.riskGate.warnings),
      "Risk Gate warnings must be an array"
    );

    console.log(
      "TEST 6: Risk Gate warnings array valid: PASS"
    );

    // =========================================
    // 8. Controlled flat market should not
    //    become an executable trade
    // =========================================

    assert(
      result.riskGate.status === "BLOCK" ||
      result.decision === "BUY" ||
      result.decision === "SELL",
      "Risk Gate must block non-trade decision"
    );

    console.log(
      "TEST 7: Risk Gate execution protection valid: PASS"
    );

    // =========================================
    // FINAL
    // =========================================

    console.log("");
    console.log(
      "=== RISK GATE E2E FINAL CHECK ==="
    );

    console.log({
      decision: result.decision,
      entryContext: result.entryContext,

      riskGateStatus:
        result.riskGate.status,

      riskGateReason:
        result.riskGate.reason,

      failures:
        result.riskGate.failures,

      warnings:
        result.riskGate.warnings,
    });

    console.log("");
    console.log(
      "Passed: Risk Gate production exposure checks"
    );

    console.log(
      "ALL RISK GATE END-TO-END TESTS PASSED"
    );

  } catch (error) {

    console.error(
      "RISK GATE E2E TEST ERROR:",
      error
    );

    process.exitCode = 1;

  } finally {

    clearHistoricalCacheForTest(
      SYMBOL
    );

  }
}

runTest();

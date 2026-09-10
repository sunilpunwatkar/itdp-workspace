import {
  seedHistoricalCacheForTest,
  clearHistoricalCacheForTest,
} from "../app/services/historicalDataCache";

import { getStockAnalysis } from "../services/stockAnalysisService";

import {
  GOLDEN_BUY_SYMBOL,
  goldenBuyMarketProvider,
  buildGoldenBuyOHLC,
} from "./fixtures/goldenBuyFixture";

function assertEqual<T>(
  name: string,
  actual: T,
  expected: T
): void {
  if (actual !== expected) {
    throw new Error(
      `${name} FAILED: expected ${String(expected)}, received ${String(actual)}`
    );
  }

  console.log(`PASS: ${name} = ${String(actual)}`);
}

function assertFinitePositive(
  name: string,
  value: number
): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(
      `${name} FAILED: expected finite positive number, received ${value}`
    );
  }

  console.log(`PASS: ${name} = ${value}`);
}

async function runGoldenBuyValidation(): Promise<void> {
  console.log("");
  console.log("========================================");
  console.log(" ITDP VALIDATION HARNESS");
  console.log(" GOLDEN BUY PRODUCTION CASE");
  console.log("========================================");
  console.log("");

  seedHistoricalCacheForTest(
    GOLDEN_BUY_SYMBOL,
    buildGoldenBuyOHLC()
  );

  try {
    const result = await getStockAnalysis(
      GOLDEN_BUY_SYMBOL,
      goldenBuyMarketProvider
    );

    console.log("");
    console.log("--- CORE DECISION CONTRACT ---");

    assertEqual(
      "Decision",
      result.decision,
      "BUY"
    );

    assertEqual(
      "Decision Strength",
      result.decisionStrength,
      "STRONG"
    );

    assertEqual(
      "Decision Quality",
      result.decisionQuality,
      "HIGH"
    );

    assertEqual(
      "Decision Reliability",
      result.decisionReliability,
      "HIGH_RELIABILITY"
    );

    assertEqual(
      "Entry Context",
      result.entryContext,
      "FAVORABLE"
    );

    console.log("");
    console.log("--- RISK PLAN CONTRACT ---");

    assertEqual(
      "Entry",
      result.entry,
      1364
    );

    assertEqual(
      "Stop Loss",
      result.stopLoss,
      1354.29
    );

    assertEqual(
      "Target 1",
      result.target1,
      1378.57
    );

    assertEqual(
      "Target 2",
      result.target2,
      1383.42
    );

    assertEqual(
      "Risk Reward",
      result.riskReward,
      "1 : 1.50"
    );

    assertFinitePositive(
      "Entry",
      result.entry
    );

    assertFinitePositive(
      "Stop Loss",
      result.stopLoss
    );

    assertFinitePositive(
      "Target 1",
      result.target1
    );

    assertFinitePositive(
      "Target 2",
      result.target2
    );

    console.log("");
    console.log("--- POSITION SIZE CONTRACT ---");

    assertEqual(
      "Max Risk",
      result.maxRisk,
      1500
    );

    assertEqual(
      "Quantity",
      result.quantity,
      154
    );

    console.log("");
    console.log("--- RISK GATE CONTRACT ---");

    assertEqual(
      "Risk Gate Status",
      result.riskGate.status,
      "PASS"
    );

    assertEqual(
      "Risk Gate Failures",
      result.riskGate.failures.length,
      0
    );

    assertEqual(
      "Risk Gate Warnings",
      result.riskGate.warnings.length,
      0
    );

    console.log("");
    console.log("========================================");
    console.log(" GOLDEN BUY VALIDATION: PASSED");
    console.log(" FULL PRODUCTION CONTRACT: GREEN");
    console.log("========================================");
    console.log("");
  } finally {
    clearHistoricalCacheForTest(
      GOLDEN_BUY_SYMBOL
    );
  }
}

runGoldenBuyValidation().catch((error) => {
  console.error("");
  console.error("========================================");
  console.error(" GOLDEN BUY VALIDATION: FAILED");
  console.error("========================================");
  console.error("");
  console.error(error);
  process.exit(1);
});

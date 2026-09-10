import {
  seedHistoricalCacheForTest,
  clearHistoricalCacheForTest,
} from "../app/services/historicalDataCache";

import { getStockAnalysis } from "../services/stockAnalysisService";

import {
  GOLDEN_SELL_SYMBOL,
  goldenSellMarketProvider,
  buildGoldenSellOHLC,
} from "./fixtures/goldenSellFixture";

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
  clearHistoricalCacheForTest();

  seedHistoricalCacheForTest(
    GOLDEN_SELL_SYMBOL,
    buildGoldenSellOHLC()
  );

  console.log("");
  console.log("==============================================");
  console.log("       ITDP GOLDEN SELL PRODUCTION TEST");
  console.log("==============================================");

  const result = await getStockAnalysis(
    GOLDEN_SELL_SYMBOL,
    goldenSellMarketProvider
  );

  console.log("");
  console.log("=== GOLDEN SELL CONTRACT ===");

  assertEqual(
    "Decision",
    result.decision,
    "SELL"
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

  assertEqual(
    "Entry",
    result.entry,
    1336
  );

  assertEqual(
    "Stop Loss",
    result.stopLoss,
    1345.71
  );

  assertEqual(
    "Target 1",
    result.target1,
    1321.43
  );

  assertEqual(
    "Target 2",
    result.target2,
    1316.58
  );

  assertEqual(
    "Risk Reward",
    result.riskReward,
    "1 : 1.50"
  );

  assertEqual(
    "Quantity",
    result.quantity,
    154
  );

  if (!result.riskGate) {
    throw new Error(
      "Risk Gate FAILED | Risk Gate result is missing"
    );
  }

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
  console.log("==============================================");
  console.log("     GOLDEN SELL VALIDATION: PASSED");
  console.log("     FULL PRODUCTION CONTRACT: GREEN");
  console.log("==============================================");

  clearHistoricalCacheForTest();
}

run().catch((error) => {
  console.error("");
  console.error("GOLDEN SELL VALIDATION: FAILED");
  console.error(error);

  clearHistoricalCacheForTest();

  process.exit(1);
});
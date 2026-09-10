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

async function main() {
  console.log("=== RISK GATE BUY END-TO-END TEST ===");

  try {
    const ohlc = buildGoldenBuyOHLC();

    seedHistoricalCacheForTest(
      GOLDEN_BUY_SYMBOL,
      ohlc
    );

    const result = await getStockAnalysis(
      GOLDEN_BUY_SYMBOL,
      goldenBuyMarketProvider
    );

    console.log("Final Decision:", result.decision);
    console.log("Entry Context:", result.entryContext);

    console.log("Risk Plan:", {
      entry: result.entry,
      stopLoss: result.stopLoss,
      target1: result.target1,
      target2: result.target2,
      riskReward: result.riskReward,
    });

    console.log("Position Size:", {
      quantity: result.quantity,
      maxRisk: result.maxRisk,
    });

    console.log("Risk Gate:", result.riskGate);

    if (result.decision !== "BUY") {
      throw new Error(
        `Expected BUY, received ${result.decision}`
      );
    }

    if (result.entryContext !== "FAVORABLE") {
      throw new Error(
        `Expected FAVORABLE entry context, received ${result.entryContext}`
      );
    }

    if (
      !Number.isFinite(result.entry) ||
      result.entry <= 0
    ) {
      throw new Error("Invalid entry");
    }

    if (
      !Number.isFinite(result.stopLoss) ||
      result.stopLoss <= 0
    ) {
      throw new Error("Invalid stop loss");
    }

    if (
      !Number.isFinite(result.target1) ||
      result.target1 <= 0
    ) {
      throw new Error("Invalid target1");
    }

    if (
      !Number.isFinite(result.target2) ||
      result.target2 <= 0
    ) {
      throw new Error("Invalid target2");
    }

    if (result.stopLoss >= result.entry) {
      throw new Error(
        "BUY stop loss must be below entry"
      );
    }

    if (result.target1 <= result.entry) {
      throw new Error(
        "BUY target1 must be above entry"
      );
    }

    if (
      !Number.isFinite(result.quantity) ||
      result.quantity <= 0
    ) {
      throw new Error(
        "Invalid position quantity"
      );
    }

    if (
      !Number.isFinite(result.maxRisk) ||
      result.maxRisk <= 0
    ) {
      throw new Error("Invalid max risk");
    }

    if (result.riskGate.status !== "PASS") {
      throw new Error(
        `Expected Risk Gate PASS, received ${result.riskGate.status}`
      );
    }

    if (result.riskGate.failures.length !== 0) {
      throw new Error(
        `Expected no Risk Gate failures, received ${JSON.stringify(
          result.riskGate.failures
        )}`
      );
    }

    if (result.riskGate.warnings.length !== 0) {
      throw new Error(
        `Expected no Risk Gate warnings, received ${JSON.stringify(
          result.riskGate.warnings
        )}`
      );
    }

    console.log(
      "Passed: BUY + FAVORABLE + valid risk plan + Risk Gate PASS"
    );

    console.log(
      "ALL RISK GATE BUY END-TO-END TESTS PASSED"
    );
  } finally {
    clearHistoricalCacheForTest(
      GOLDEN_BUY_SYMBOL
    );
  }
}

main().catch((error) => {
  console.error(
    "RISK GATE BUY END-TO-END TEST FAILED"
  );
  console.error(error);
  process.exit(1);
});

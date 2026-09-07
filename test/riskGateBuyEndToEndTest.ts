import {
  seedHistoricalCacheForTest,
  clearHistoricalCacheForTest,
} from "../app/services/historicalDataCache";

import { getStockAnalysis } from "../services/stockAnalysisService";
import {
  MarketProvider,
  MarketData,
} from "../app/providers/marketProvider";

const SYMBOL = "TEST.RISK_GATE.BUY.E2E";

const marketProvider: MarketProvider = {
  async getQuote(symbol: string): Promise<MarketData> {
    return {
      symbol,
      price: 1364,
      open: 1363,
      high: 1365,
      low: 1362,
      close: 1364,
      volume: 1000000,
    };
  },
};

function buildBuyOHLC() {
  const timestamps: number[] = [];
  const open: number[] = [];
  const high: number[] = [];
  const low: number[] = [];
  const close: number[] = [];
  const volume: number[] = [];

  // -----------------------------------------------------
  // Base bullish trend
  // -----------------------------------------------------

  for (let i = 0; i < 220; i++) {
    const price = 1000 + i * 1.5;

    timestamps.push(
      1700000000 + i * 86400
    );

    open.push(price - 1);
    high.push(price + 2);
    low.push(price - 2);
    close.push(price);
    volume.push(1000000);
  }

  // -----------------------------------------------------
  // Deterministic BUY formation
  // -----------------------------------------------------

  const recentPrices = [
    1330,
    1340,
    1346,
    1356,
    1350,
    1352,
    1346,
    1340,
    1348,
    1350,
    1344,
    1336,
    1330,
    1332,
    1324,
    1332,
    1340,
    1348,
    1346,
    1344,
    1342,
    1348,
    1350,
    1360,
    1358,
    1368,
    1370,
    1362,
    1366,
    1364,
  ];

  for (let i = 0; i < recentPrices.length; i++) {
    const price = recentPrices[i];

    timestamps.push(
      1700000000 +
        (220 + i) * 86400
    );

    open.push(price - 0.5);
    high.push(price + 1.5);
    low.push(price - 1.5);
    close.push(price);
    volume.push(1000000);
  }

  return {
    timestamps,
    open,
    high,
    low,
    close,
    volume,
  };
}

async function main() {
  console.log(
    "=== RISK GATE BUY END-TO-END TEST ==="
  );

  try {
    const ohlc = buildBuyOHLC();

    seedHistoricalCacheForTest(
      SYMBOL,
      ohlc
    );

    const result =
      await getStockAnalysis(
        SYMBOL,
        marketProvider
      );

    // ---------------------------------------------------
    // OBSERVABILITY
    // ---------------------------------------------------

    console.log(
      "Final Decision:",
      result.decision
    );

    console.log(
      "Entry Context:",
      result.entryContext
    );

    console.log(
      "Risk Plan:",
      {
        entry: result.entry,
        stopLoss: result.stopLoss,
        target1: result.target1,
        target2: result.target2,
        riskReward: result.riskReward,
      }
    );

    console.log(
      "Position Size:",
      {
        quantity: result.quantity,
        maxRisk: result.maxRisk,
      }
    );

    console.log(
      "Risk Gate:",
      result.riskGate
    );

    // ---------------------------------------------------
    // FINAL DECISION CONTRACT
    // ---------------------------------------------------

    if (result.decision !== "BUY") {
      throw new Error(
        `Expected BUY, received ${result.decision}`
      );
    }

    // ---------------------------------------------------
    // ENTRY CONTEXT CONTRACT
    // ---------------------------------------------------

    if (
      result.entryContext !== "FAVORABLE"
    ) {
      throw new Error(
        `Expected FAVORABLE entry context, received ${result.entryContext}`
      );
    }

    // ---------------------------------------------------
    // RISK PLAN CONTRACT
    // ---------------------------------------------------

    if (
      !Number.isFinite(result.entry) ||
      result.entry <= 0
    ) {
      throw new Error(
        "Invalid entry"
      );
    }

    if (
      !Number.isFinite(result.stopLoss) ||
      result.stopLoss <= 0
    ) {
      throw new Error(
        "Invalid stop loss"
      );
    }

    if (
      !Number.isFinite(result.target1) ||
      result.target1 <= 0
    ) {
      throw new Error(
        "Invalid target1"
      );
    }

    if (
      !Number.isFinite(result.target2) ||
      result.target2 <= 0
    ) {
      throw new Error(
        "Invalid target2"
      );
    }

    if (
      result.stopLoss >= result.entry
    ) {
      throw new Error(
        "BUY stop loss must be below entry"
      );
    }

    if (
      result.target1 <= result.entry
    ) {
      throw new Error(
        "BUY target1 must be above entry"
      );
    }

    // ---------------------------------------------------
    // POSITION SIZE CONTRACT
    // ---------------------------------------------------

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
      throw new Error(
        "Invalid max risk"
      );
    }

    // ---------------------------------------------------
    // RISK GATE CONTRACT
    // ---------------------------------------------------

    if (
      result.riskGate.status !== "PASS"
    ) {
      throw new Error(
        `Expected Risk Gate PASS, received ${result.riskGate.status}`
      );
    }

    if (
      result.riskGate.failures.length !== 0
    ) {
      throw new Error(
        `Expected no Risk Gate failures, received ${JSON.stringify(
          result.riskGate.failures
        )}`
      );
    }

    if (
      result.riskGate.warnings.length !== 0
    ) {
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
      SYMBOL
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
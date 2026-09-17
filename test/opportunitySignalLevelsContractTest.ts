import {
  buildOpportunitySignalLevels,
} from "../app/services/opportunitySignalLevelsService";

function assertEqual<T>(
  label: string,
  actual: T,
  expected: T
): void {
  if (
    actual !== expected
  ) {
    throw new Error(
      `${label} | Expected: ${String(
        expected
      )} | Actual: ${String(
        actual
      )}`
    );
  }

  console.log(
    `PASS | ${label} | ${String(
      actual
    )}`
  );
}

function assertThrows(
  label: string,
  fn: () => void,
  expectedMessage: string
): void {
  try {
    fn();
  } catch (
    error
  ) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    assertEqual(
      label,
      message,
      expectedMessage
    );

    return;
  }

  throw new Error(
    `${label} | Expected error: ${expectedMessage}`
  );
}

console.log(
  "=== OPPORTUNITY SIGNAL LEVELS CONTRACT ==="
);

// ==========================================
// BUY CONTRACT
// ==========================================

const buy =
  buildOpportunitySignalLevels(
    {
      decision:
        "BUY",

      entry:
        100,

      stopLoss:
        95,

      target1:
        110,

      target2:
        120,
    }
  );

assertEqual(
  "BUY Decision",
  buy.decision,
  "BUY"
);

assertEqual(
  "BUY Entry",
  buy.entry,
  100
);

assertEqual(
  "BUY Stop Loss",
  buy.stopLoss,
  95
);

assertEqual(
  "BUY Target 1",
  buy.target1,
  110
);

assertEqual(
  "BUY Target 2",
  buy.target2,
  120
);

// ==========================================
// SELL CONTRACT
// ==========================================

const sell =
  buildOpportunitySignalLevels(
    {
      decision:
        "SELL",

      entry:
        100,

      stopLoss:
        105,

      target1:
        90,

      target2:
        80,
    }
  );

assertEqual(
  "SELL Decision",
  sell.decision,
  "SELL"
);

assertEqual(
  "SELL Entry",
  sell.entry,
  100
);

assertEqual(
  "SELL Stop Loss",
  sell.stopLoss,
  105
);

assertEqual(
  "SELL Target 1",
  sell.target1,
  90
);

assertEqual(
  "SELL Target 2",
  sell.target2,
  80
);

// ==========================================
// INVALID BUY GEOMETRY
// ==========================================

assertThrows(
  "Invalid BUY Stop Loss",
  () =>
    buildOpportunitySignalLevels(
      {
        decision:
          "BUY",

        entry:
          100,

        stopLoss:
          105,

        target1:
          110,

        target2:
          120,
      }
    ),
  "INVALID_BUY_SIGNAL_GEOMETRY"
);

// ==========================================
// INVALID SELL GEOMETRY
// ==========================================

assertThrows(
  "Invalid SELL Stop Loss",
  () =>
    buildOpportunitySignalLevels(
      {
        decision:
          "SELL",

        entry:
          100,

        stopLoss:
          95,

        target1:
          90,

        target2:
          80,
      }
    ),
  "INVALID_SELL_SIGNAL_GEOMETRY"
);

// ==========================================
// TARGET ORDER CONTRACT
// ==========================================

assertThrows(
  "Invalid BUY Target Order",
  () =>
    buildOpportunitySignalLevels(
      {
        decision:
          "BUY",

        entry:
          100,

        stopLoss:
          95,

        target1:
          120,

        target2:
          110,
      }
    ),
  "INVALID_BUY_SIGNAL_GEOMETRY"
);

assertThrows(
  "Invalid SELL Target Order",
  () =>
    buildOpportunitySignalLevels(
      {
        decision:
          "SELL",

        entry:
          100,

        stopLoss:
          105,

        target1:
          80,

        target2:
          90,
      }
    ),
  "INVALID_SELL_SIGNAL_GEOMETRY"
);

// ==========================================
// INVALID PRICE CONTRACT
// ==========================================

assertThrows(
  "Zero Entry",
  () =>
    buildOpportunitySignalLevels(
      {
        decision:
          "BUY",

        entry:
          0,

        stopLoss:
          95,

        target1:
          110,

        target2:
          120,
      }
    ),
  "INVALID_OPPORTUNITY_SIGNAL_PRICE"
);

assertThrows(
  "NaN Target",
  () =>
    buildOpportunitySignalLevels(
      {
        decision:
          "BUY",

        entry:
          100,

        stopLoss:
          95,

        target1:
          Number.NaN,

        target2:
          120,
      }
    ),
  "INVALID_OPPORTUNITY_SIGNAL_PRICE"
);

console.log(
  "\nALL OPPORTUNITY SIGNAL LEVELS CONTRACT CASES PASS"
);
import type {
  AnalysisResult,
} from "../app/types/analysis";

import type {
  OpportunityScannerSource,
} from "../app/services/opportunityScannerService";

import {
  scanOpportunities,
} from "../app/services/opportunityScannerService";

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

function buildAnalysis(
  symbol: string
): AnalysisResult {
  return {
    symbol,

    decision: "BUY",

    confidence: 85,

    risk: "LOW",

    entryContext: "FAVORABLE",

    decisionStrength: "STRONG",

    decisionQuality: "HIGH",

    decisionReliability:
      "HIGH_RELIABILITY",

    conflictSeverity: "NONE",

    entry: 100,

    target: 110,

    target1: 110,

    support1: 95,

    support2: 90,

    resistance1: 110,

    resistance2: 115,

    target2: 115,

    stopLoss: 95,

    riskReward: "1 : 2.00",

    capital: 75000,

    riskPercent: 2,

    maxRisk: 1500,

    quantity: 300,

    tradeQuality: "A+",

    holdingPeriod: "5 - 15 Days",

    aiSummary:
      "Controlled scaling analysis.",

    reasons: [],

    invalidIf:
      "Controlled invalidation.",

    riskGate: {
      status: "PASS",
      reason: "Controlled PASS.",
      failures: [],
      warnings: [],
    },
  };
}

async function run() {
  console.log(
    "=== OPPORTUNITY SCANNER SCALING CONTRACT ==="
  );

  let active = 0;
  let maxActive = 0;

  const sleepCalls: number[] = [];

  const executionCount =
    new Map<string, number>();

  const failureIndexes =
    new Set([
      10,
      30,
      50,
      70,
      90,
    ]);

  const sources:
    OpportunityScannerSource[] =
      Array.from(
        {
          length: 100,
        },
        (_, index) => {
          const symbol =
            `TEST.SCALE.${index + 1}`;

          return {
            symbol,

            analyze: async () => {
              const previous =
                executionCount.get(
                  symbol
                ) ?? 0;

              executionCount.set(
                symbol,
                previous + 1
              );

              active += 1;

              maxActive =
                Math.max(
                  maxActive,
                  active
                );

              await Promise.resolve();

              active -= 1;

              if (
                failureIndexes.has(
                  index
                )
              ) {
                throw new Error(
                  `CONTROLLED_FAILURE_${index + 1}`
                );
              }

              return buildAnalysis(
                symbol
              );
            },
          };
        }
      );

  const result =
    await scanOpportunities(
      sources,
      {
        capital: 75000,
        horizon: "SHORT",
        riskProfile: "BALANCED",
        universe: "NIFTY_500",
        maxResults: 10,
      },
      {
        concurrency: 3,

        batchSize: 10,

        batchDelayMs: 250,

        sleep:
          async (
            delayMs
          ) => {
            sleepCalls.push(
              delayMs
            );
          },
      }
    );

  assertEqual(
    "Scanned Count",
    result.scannedCount,
    100
  );

  assertEqual(
    "Analyzed Count",
    result.analyzedCount,
    95
  );

  assertEqual(
    "Failed Count",
    result.failedCount,
    5
  );

  assertEqual(
    "Candidate Count",
    result.candidateCount,
    95
  );

  assertEqual(
    "Maximum Active",
    maxActive,
    3
  );

  assertEqual(
    "Batch Sleep Count",
    sleepCalls.length,
    9
  );

  assertEqual(
    "First Batch Delay",
    sleepCalls[0],
    250
  );

  assertEqual(
    "Last Batch Delay",
    sleepCalls[
      sleepCalls.length - 1
    ],
    250
  );

  const allExecutedOnce =
    Array.from(
      executionCount.values()
    ).every(
      (count) =>
        count === 1
    );

  assertEqual(
    "Each Source Executed Once",
    allExecutedOnce,
    true
  );

  assertEqual(
    "Executed Source Count",
    executionCount.size,
    100
  );

  assertEqual(
    "Discovery Max Results",
    result.discovery
      .opportunities.length,
    10
  );

  console.log("");

  console.log(
    "ALL SCANNER SCALING CONTRACT CASES PASS"
  );
}

run().catch((error) => {
  console.error("");

  console.error(
    "SCANNER SCALING CONTRACT: FAILED"
  );

  console.error(error);

  process.exit(1);
});
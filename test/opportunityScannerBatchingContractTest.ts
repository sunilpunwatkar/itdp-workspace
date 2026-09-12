import type {
  AnalysisResult,
} from "../app/types/analysis";

import type {
  OpportunityScannerSource,
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

function buildBaseAnalysis(
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

    holdingPeriod:
      "5 - 15 Days",

    aiSummary:
      "Controlled batching test.",

    reasons: [],

    invalidIf:
      "Controlled invalidation.",

    riskGate: {
      status: "PASS",
      reason:
        "Controlled PASS.",
      failures: [],
      warnings: [],
    },
  };
}

async function run() {
  console.log(
    "=== OPPORTUNITY SCANNER BATCHING CONTRACT ==="
  );

  let active = 0;
  let maxActive = 0;

  const sleeps: number[] = [];

  const starts: string[] = [];

  const sources:
    OpportunityScannerSource[] =
      Array.from(
        {
          length: 6,
        },
        (_, index) => {
          const symbol =
            `TEST.BATCH.${index + 1}`;

          return {
            symbol,

            analyze:
              async () => {
                active += 1;

                maxActive =
                  Math.max(
                    maxActive,
                    active
                  );

                starts.push(
                  symbol
                );

                await Promise.resolve();

                active -= 1;

                return buildBaseAnalysis(
                  symbol
                );
              },
          };
        }
      );

  const {
    scanOpportunities,
  } = await import(
    "../app/services/opportunityScannerService"
  );

  const result =
    await scanOpportunities(
      sources,
      {
        capital: 75000,
        horizon: "SHORT",
        riskProfile: "BALANCED",
        universe:
          "NIFTY_500",
        maxResults: 10,
      },
      {
        concurrency: 2,

        batchSize: 2,

        batchDelayMs: 750,

        sleep:
          async (
            delayMs
          ) => {
            sleeps.push(
              delayMs
            );
          },
      }
    );

  assertEqual(
    "Scanned Count",
    result.scannedCount,
    6
  );

  assertEqual(
    "Analyzed Count",
    result.analyzedCount,
    6
  );

  assertEqual(
    "Failed Count",
    result.failedCount,
    0
  );

  assertEqual(
    "Candidate Count",
    result.candidateCount,
    6
  );

  assertEqual(
    "Maximum Active",
    maxActive,
    2
  );

  assertEqual(
    "Batch Sleep Count",
    sleeps.length,
    2
  );

  assertEqual(
    "First Batch Delay",
    sleeps[0],
    750
  );

  assertEqual(
    "Second Batch Delay",
    sleeps[1],
    750
  );

  assertEqual(
    "Total Starts",
    starts.length,
    6
  );

  console.log("");

  console.log(
    "ALL SCANNER BATCHING CONTRACT CASES PASS"
  );
}

run().catch(
  (error) => {
    console.error("");

    console.error(
      "SCANNER BATCHING CONTRACT: FAILED"
    );

    console.error(
      error
    );

    process.exit(1);
  }
);
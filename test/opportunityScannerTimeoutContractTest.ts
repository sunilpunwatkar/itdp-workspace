import {
  scanOpportunities,
  OpportunityScannerSource,
} from "../app/services/opportunityScannerService";

import type {
  AnalysisResult,
} from "../app/types/analysis";

import type {
  OpportunityDiscoveryInput,
} from "../app/services/opportunityDiscoveryService";

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

    entry: 1364,

    target: 1378.57,
    target1: 1378.57,
    target2: 1383.42,

    support1: 1360.5,
    support2: 1340.5,

    resistance1: 1371.5,
    resistance2: null,

    stopLoss: 1354.29,

    riskReward: "1 : 1.50",

    capital: 75000,
    riskPercent: 2,
    maxRisk: 1500,
    quantity: 154,

    tradeQuality: "A+",
    holdingPeriod: "5 - 15 Days",

    aiSummary:
      "Controlled scanner timeout test.",

    reasons: [],

    invalidIf:
      "Controlled scanner timeout invalidation.",

    riskGate: {
      status: "PASS",

      reason:
        "Controlled scanner timeout test.",

      failures: [],
      warnings: [],
    },
  };
}

async function run() {
  console.log(
    "=== OPPORTUNITY SCANNER TIMEOUT CONTRACT TEST ==="
  );

  const input:
    OpportunityDiscoveryInput = {
      capital: 75000,

      horizon: "SHORT",

      riskProfile: "BALANCED",

      universe: "NIFTY_500",

      maxResults: 5,
    };

  let slowAnalysisCompleted =
    false;

  const sources:
    OpportunityScannerSource[] = [
      {
        symbol: "SLOW.TEST",

        async analyze() {
          await new Promise<void>(
            (resolve) => {
              setTimeout(
                resolve,
                100
              );
            }
          );

          slowAnalysisCompleted =
            true;

          return buildAnalysis(
            "SLOW.TEST"
          );
        },
      },

      {
        symbol: "FAST.TEST",

        async analyze() {
          return buildAnalysis(
            "FAST.TEST"
          );
        },
      },
    ];

  const startedAt =
    Date.now();

  const result =
    await scanOpportunities(
      sources,
      input,
      {
        concurrency: 1,

        analysisTimeoutMs: 20,
      }
    );

  const elapsedMs =
    Date.now() - startedAt;

  assertEqual(
    "Scanned Count",
    result.scannedCount,
    2
  );

  assertEqual(
    "Analyzed Count",
    result.analyzedCount,
    1
  );

  assertEqual(
    "Failed Count",
    result.failedCount,
    1
  );

  assertEqual(
    "Candidate Count",
    result.candidateCount,
    1
  );

  assertEqual(
    "Timeout Failure Symbol",
    result.failures[0]?.symbol,
    "SLOW.TEST"
  );

  assertEqual(
    "Timeout Failure Error",
    result.failures[0]?.error,
    "ANALYSIS_TIMEOUT"
  );

  assertEqual(
    "Fast Opportunity Continues",
    result.discovery
      .opportunities[0]?.symbol,
    "FAST.TEST"
  );

  if (
    elapsedMs >= 100
  ) {
    throw new Error(
      `Scanner remained blocked by slow analysis | Elapsed=${elapsedMs}ms`
    );
  }

  console.log(
    `PASS | Scanner released worker before slow analysis completed | ${elapsedMs}ms`
  );

  assertEqual(
    "Slow Analysis Not Awaited",
    slowAnalysisCompleted,
    false
  );

  console.log("");
  console.log(
    "OPPORTUNITY SCANNER TIMEOUT CONTRACT: GREEN"
  );
}

run().catch((error) => {
  console.error("");
  console.error(
    "OPPORTUNITY SCANNER TIMEOUT CONTRACT: FAILED"
  );

  console.error(error);

  process.exit(1);
});
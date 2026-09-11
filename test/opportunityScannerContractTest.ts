import {
  scanOpportunities,
  OpportunityScannerSource,
} from "../app/services/opportunityScannerService";
import type {
  AnalysisResult,
} from "../app/types/analysis";

import {
  buildOpportunityCandidateFromAnalysis,
} from "../app/services/opportunityAdapterService";

import {
  buildOpportunityDiscoveryResult,
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

function buildBaseAnalysis(
  overrides:
    Partial<AnalysisResult> = {}
): AnalysisResult {
  return {
    symbol:
      "TEST.SCANNER",

    decision:
      "BUY",

    confidence:
      85,

    risk:
      "LOW",

    entryContext:
      "FAVORABLE",

    decisionStrength:
      "STRONG",

    decisionQuality:
      "HIGH",

    decisionReliability:
      "HIGH_RELIABILITY",

    conflictSeverity:
      "NONE",

    entry:
      1364,

    target:
      1378.57,

    target1:
      1378.57,

    support1:
      1360.5,

    support2:
      1340.5,

    resistance1:
      1371.5,

    resistance2:
      null,

    target2:
      1383.42,

    stopLoss:
      1354.29,

    riskReward:
      "1 : 1.50",

    capital:
      75000,

    riskPercent:
      2,

    maxRisk:
      1500,

    quantity:
      154,

    tradeQuality:
      "A+",

    holdingPeriod:
      "5 - 15 Days",

    aiSummary:
      "Controlled scanner test.",

    reasons:
      [],

    invalidIf:
      "Controlled scanner invalidation.",

    riskGate: {
      status:
        "PASS",

      reason:
        "Controlled scanner test.",

      failures:
        [],

      warnings:
        [],
    },

    ...overrides,
  };
}

async function run() {
  console.log(
    "=== OPPORTUNITY SCANNER CONTRACT TEST ==="
  );

  const input:
    OpportunityDiscoveryInput = {
      capital:
        75000,

      horizon:
        "SHORT",

      riskProfile:
        "BALANCED",

      universe:
        "NIFTY_500",

      maxResults:
        5,
    };

  const sources:
  OpportunityScannerSource[] = [
      {
        symbol:
          "BUY.TEST",

        async analyze() {
          return buildBaseAnalysis({
            symbol:
              "BUY.TEST",

            decision:
              "BUY",
          });
        },
      },

      {
        symbol:
          "SELL.TEST",

        async analyze() {
          return buildBaseAnalysis({
            symbol:
              "SELL.TEST",

            decision:
              "SELL",

            entry:
              1336,

            stopLoss:
              1345.71,

            target:
              1321.43,

            target1:
              1321.43,

            target2:
              1316.58,
          });
        },
      },

      {
        symbol:
          "HOLD.TEST",

        async analyze() {
          return buildBaseAnalysis({
            symbol:
              "HOLD.TEST",

            decision:
              "HOLD",

            riskGate: {
              status:
                "BLOCK",

              reason:
                "HOLD is not actionable.",

              failures: [
                "Final decision is HOLD.",
              ],

              warnings:
                [],
            },
          });
        },
      },

      {
        symbol:
          "FAIL.TEST",

        async analyze() {
          throw new Error(
            "CONTROLLED_ANALYSIS_FAILURE"
          );
        },
      },
    ];

  const result =
   await scanOpportunities(
      sources,
      input
    );

  // ================================================
  // SCAN COUNTS
  // ================================================

  assertEqual(
    "Scanned Count",
    result.scannedCount,
    4
  );

  assertEqual(
    "Analyzed Count",
    result.analyzedCount,
    3
  );

  assertEqual(
    "Failed Count",
    result.failedCount,
    1
  );

  // BUY + SELL only
  // HOLD becomes null candidate
  assertEqual(
    "Candidate Count",
    result.candidateCount,
    2
  );

  // ================================================
  // FAILURE ISOLATION
  // ================================================

  assertEqual(
    "Failure Symbol",
    result.failures[0]?.symbol,
    "FAIL.TEST"
  );

  assertEqual(
    "Failure Error",
    result.failures[0]?.error,
    "CONTROLLED_ANALYSIS_FAILURE"
  );

  // ================================================
  // DISCOVERY OUTPUT
  // ================================================

  assertEqual(
    "Eligible Count",
    result.discovery.eligibleCount,
    2
  );

  assertEqual(
    "Opportunity Count",
    result.discovery.opportunities.length,
    2
  );

  // Both are PRIME 96.
  // Stable insertion order should remain.
  assertEqual(
    "First Opportunity",
    result.discovery.opportunities[0]?.symbol,
    "BUY.TEST"
  );

  assertEqual(
    "Second Opportunity",
    result.discovery.opportunities[1]?.symbol,
    "SELL.TEST"
  );

  assertEqual(
    "BUY Classification",
    result.discovery.opportunities[0]
      ?.classification,
    "PRIME"
  );

  assertEqual(
    "SELL Classification",
    result.discovery.opportunities[1]
      ?.classification,
    "PRIME"
  );

  assertEqual(
    "BUY Score",
    result.discovery.opportunities[0]
      ?.opportunityScore,
    96
  );

  assertEqual(
    "SELL Score",
    result.discovery.opportunities[1]
      ?.opportunityScore,
    96
  );

  console.log("");
  console.log(
    "ALL OPPORTUNITY SCANNER CONTRACT CASES PASS"
  );
}

run().catch((error) => {
  console.error("");
  console.error(
    "OPPORTUNITY SCANNER CONTRACT: FAILED"
  );

  console.error(error);

  process.exit(1);
});
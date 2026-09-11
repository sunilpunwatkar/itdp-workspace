import {
  buildOpportunityCandidateFromAnalysis,
} from "../app/services/opportunityAdapterService";
import type { AnalysisResult } from "../app/types/analysis";

import {
  calculateOpportunityRanking,
  OpportunityDecisionQuality,
  OpportunityDecisionStrength,
  OpportunityReliability,
} from "../app/services/opportunityRankingService";

import type {
  OpportunityCandidate,
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

function assertNull(
  label: string,
  actual: unknown
) {
  if (actual !== null) {
    throw new Error(
      `${label} FAILED | Expected=null | Actual=${String(actual)}`
    );
  }

  console.log(
    `PASS | ${label} | null`
  );
}


const baseAnalysis: AnalysisResult = {
  symbol: "TEST.ADAPTER",

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

  support1: 1360.5,
  support2: 1340.5,

  resistance1: 1371.5,
  resistance2: null,

  target2: 1383.42,

  stopLoss: 1354.29,

  riskReward: "1 : 1.50",

  capital: 75000,

  riskPercent: 2,

  maxRisk: 1500,

  quantity: 154,

  tradeQuality: "A+",

  holdingPeriod: "5 - 15 Days",

  aiSummary:
    "Controlled adapter test.",

  reasons: [],

  invalidIf:
    "Controlled test invalidation.",

  riskGate: {
    status: "PASS",
    reason:
      "Controlled adapter test.",
    failures: [],
    warnings: [],
  },
};

console.log(
  "=== OPPORTUNITY ADAPTER CONTRACT TEST ==="
);

// ==================================================
// CASE 1
// VALID BUY ANALYSIS
// ==================================================

const buyCandidate =
  buildOpportunityCandidateFromAnalysis(
    baseAnalysis
  );

if (!buyCandidate) {
  throw new Error(
    "VALID BUY FAILED | Candidate is null"
  );
}

assertEqual(
  "BUY Symbol",
  buyCandidate.symbol,
  "TEST.ADAPTER"
);

assertEqual(
  "BUY Decision",
  buyCandidate.decision,
  "BUY"
);

assertEqual(
  "BUY Risk Reward Ratio",
  buyCandidate.riskRewardRatio,
  1.5
);

assertEqual(
  "BUY Opportunity Score",
  buyCandidate.opportunityScore,
  96
);

assertEqual(
  "BUY Classification",
  buyCandidate.classification,
  "PRIME"
);

// ==================================================
// CASE 2
// VALID SELL ANALYSIS
// ==================================================

const sellCandidate =
  buildOpportunityCandidateFromAnalysis({
    ...baseAnalysis,
    symbol: "TEST.ADAPTER.SELL",
    decision: "SELL",
  });

if (!sellCandidate) {
  throw new Error(
    "VALID SELL FAILED | Candidate is null"
  );
}

assertEqual(
  "SELL Decision",
  sellCandidate.decision,
  "SELL"
);

assertEqual(
  "SELL Opportunity Score",
  sellCandidate.opportunityScore,
  96
);

assertEqual(
  "BUY SELL Score Symmetry",
  sellCandidate.opportunityScore,
  buyCandidate.opportunityScore
);

// ==================================================
// CASE 3
// HOLD MUST NOT BECOME OPPORTUNITY
// ==================================================

const holdCandidate =
  buildOpportunityCandidateFromAnalysis({
    ...baseAnalysis,
    decision: "HOLD",
  });

assertNull(
  "HOLD Rejected",
  holdCandidate
);

// ==================================================
// CASE 4
// BLOCK MUST BE REJECTED BY RANKING
// ==================================================

const blockedCandidate =
  buildOpportunityCandidateFromAnalysis({
    ...baseAnalysis,
    riskGate: {
      status: "BLOCK",
      reason: "Controlled block.",
      failures: [
        "Controlled failure.",
      ],
      warnings: [],
    },
  });

if (!blockedCandidate) {
  throw new Error(
    "BLOCK CASE FAILED | Candidate unexpectedly null"
  );
}

assertEqual(
  "BLOCK Opportunity Score",
  blockedCandidate.opportunityScore,
  0
);

assertEqual(
  "BLOCK Classification",
  blockedCandidate.classification,
  "REJECT"
);

// ==================================================
// CASE 5
// INVALID R:R STRING
// ==================================================

const invalidRiskReward =
  buildOpportunityCandidateFromAnalysis({
    ...baseAnalysis,
    riskReward:
      "INVALID",
  });

assertNull(
  "Invalid Risk Reward Rejected",
  invalidRiskReward
);

// ==================================================
// CASE 6
// INVALID DECISION STRENGTH
// ==================================================

const invalidStrength =
  buildOpportunityCandidateFromAnalysis({
    ...baseAnalysis,
    decisionStrength:
      "UNKNOWN",
  });

assertNull(
  "Invalid Strength Rejected",
  invalidStrength
);

// ==================================================
// CASE 7
// INVALID DECISION QUALITY
// ==================================================

const invalidQuality =
  buildOpportunityCandidateFromAnalysis({
    ...baseAnalysis,
    decisionQuality:
      "UNKNOWN",
  });

assertNull(
  "Invalid Quality Rejected",
  invalidQuality
);

// ==================================================
// CASE 8
// INVALID RELIABILITY
// ==================================================

const invalidReliability =
  buildOpportunityCandidateFromAnalysis({
    ...baseAnalysis,
    decisionReliability:
      "UNKNOWN",
  });

assertNull(
  "Invalid Reliability Rejected",
  invalidReliability
);

console.log("");
console.log(
  "ALL OPPORTUNITY ADAPTER CONTRACT CASES PASS"
);
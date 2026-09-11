import {
  calculateOpportunityRanking,
} from "../app/services/opportunityRankingService";

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

console.log(
  "=== OPPORTUNITY RANKING CONTRACT TEST ==="
);

// ==================================================
// CASE 1
// PRIME
// ==================================================

const prime = calculateOpportunityRanking({
  direction: "BUY",
  riskGateStatus: "PASS",
  entryContext: "FAVORABLE",
  decisionQuality: "HIGH",
  decisionStrength: "STRONG",
  reliability: "HIGH_RELIABILITY",
  conflictSeverity: "NONE",
  riskRewardRatio: 1.5,
});

assertEqual(
  "PRIME Score",
  prime.score,
  96
);

assertEqual(
  "PRIME Classification",
  prime.classification,
  "PRIME"
);

assertEqual(
  "PRIME Eligible",
  prime.eligible,
  true
);

// ==================================================
// CASE 2
// STRONG
// ==================================================

const strong = calculateOpportunityRanking({
  direction: "BUY",
  riskGateStatus: "PASS",
  entryContext: "CAUTION",
  decisionQuality: "HIGH",
  decisionStrength: "STRONG",
  reliability: "HIGH_RELIABILITY",
  conflictSeverity: "NONE",
  riskRewardRatio: 1.5,
});

assertEqual(
  "STRONG Classification",
  strong.classification,
  "STRONG"
);

// ==================================================
// CASE 3
// WATCH
// ==================================================

const watch = calculateOpportunityRanking({
  direction: "BUY",
  riskGateStatus: "CAUTION",
  entryContext: "CAUTION",
  decisionQuality: "MEDIUM",
  decisionStrength: "MODERATE",
  reliability: "MODERATE_RELIABILITY",
  conflictSeverity: "LOW",
  riskRewardRatio: 1.2,
});

assertEqual(
  "WATCH Classification",
  watch.classification,
  "WATCH"
);

// ==================================================
// CASE 4
// REJECT
// ==================================================

const reject = calculateOpportunityRanking({
  direction: "BUY",
  riskGateStatus: "CAUTION",
  entryContext: "UNFAVORABLE",
  decisionQuality: "LOW",
  decisionStrength: "WEAK",
  reliability: "REDUCED_RELIABILITY",
  conflictSeverity: "MODERATE",
  riskRewardRatio: 1.0,
});

assertEqual(
  "REJECT Classification",
  reject.classification,
  "REJECT"
);

assertEqual(
  "REJECT Eligible",
  reject.eligible,
  false
);

// ==================================================
// CASE 5
// BLOCK HARD OVERRIDE
// ==================================================

const blocked = calculateOpportunityRanking({
  direction: "BUY",
  riskGateStatus: "BLOCK",
  entryContext: "FAVORABLE",
  decisionQuality: "HIGH",
  decisionStrength: "STRONG",
  reliability: "HIGH_RELIABILITY",
  conflictSeverity: "NONE",
  riskRewardRatio: 3,
});

assertEqual(
  "BLOCK Classification",
  blocked.classification,
  "REJECT"
);

assertEqual(
  "BLOCK Eligible",
  blocked.eligible,
  false
);

assertEqual(
  "BLOCK Score",
  blocked.score,
  0
);

// ==================================================
// CASE 6
// BUY / SELL SYMMETRY
// ==================================================

const buySymmetry =
  calculateOpportunityRanking({
    direction: "BUY",
    riskGateStatus: "PASS",
    entryContext: "FAVORABLE",
    decisionQuality: "HIGH",
    decisionStrength: "STRONG",
    reliability: "HIGH_RELIABILITY",
    conflictSeverity: "NONE",
    riskRewardRatio: 2,
  });

const sellSymmetry =
  calculateOpportunityRanking({
    direction: "SELL",
    riskGateStatus: "PASS",
    entryContext: "FAVORABLE",
    decisionQuality: "HIGH",
    decisionStrength: "STRONG",
    reliability: "HIGH_RELIABILITY",
    conflictSeverity: "NONE",
    riskRewardRatio: 2,
  });

assertEqual(
  "BUY SELL Score Symmetry",
  buySymmetry.score,
  sellSymmetry.score
);

assertEqual(
  "BUY SELL Classification Symmetry",
  buySymmetry.classification,
  sellSymmetry.classification
);

console.log("");
console.log(
  "ALL OPPORTUNITY RANKING CONTRACT CASES PASS"
);
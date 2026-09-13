import {
  buildOpportunityExperienceItem,
  buildOpportunityExperienceResult,
} from "../app/services/opportunityExperienceService";

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

console.log(
  "=== OPPORTUNITY EXPERIENCE CONTRACT ==="
);

// ==========================================
// CONTROLLED CANDIDATES
// ==========================================

const buyPrime:
  OpportunityCandidate = {
    symbol:
      "BUY.TEST",

    decision:
      "BUY",

    entry:
      100,

    stopLoss:
      95,

    target1:
      110,

    target2:
      115,

    riskRewardRatio:
      2,

    quantity:
      20,

    maxRisk:
      100,

    riskGateStatus:
      "PASS",

    opportunityScore:
      96,

    classification:
      "PRIME",
  };

const sellStrong:
  OpportunityCandidate = {
    symbol:
      "SELL.TEST",

    decision:
      "SELL",

    entry:
      200,

    stopLoss:
      210,

    target1:
      180,

    target2:
      170,

    riskRewardRatio:
      2,

    quantity:
      10,

    maxRisk:
      100,

    riskGateStatus:
      "PASS",

    opportunityScore:
      90,

    classification:
      "STRONG",
  };

const cautionWatch:
  OpportunityCandidate = {
    symbol:
      "WATCH.TEST",

    decision:
      "BUY",

    entry:
      300,

    stopLoss:
      285,

    target1:
      330,

    target2:
      345,

    riskRewardRatio:
      2,

    quantity:
      5,

    maxRisk:
      75,

    riskGateStatus:
      "CAUTION",

    opportunityScore:
      82,

    classification:
      "STRONG",
  };

const blockedReject:
  OpportunityCandidate = {
    symbol:
      "BLOCK.TEST",

    decision:
      "SELL",

    entry:
      400,

    stopLoss:
      420,

    target1:
      360,

    target2:
      340,

    riskRewardRatio:
      2,

    quantity:
      4,

    maxRisk:
      80,

    riskGateStatus:
      "BLOCK",

    opportunityScore:
      40,

    classification:
      "REJECT",
  };

// ==========================================
// CASE 1
// PASS + PRIME = TRADE
// ==========================================

const buyExperience =
  buildOpportunityExperienceItem(
    buyPrime
  );

assertEqual(
  "BUY Action",
  buyExperience.action,
  "TRADE"
);

assertEqual(
  "BUY Headline",
  buyExperience.headline,
  "BUY.TEST has a validated BUY opportunity."
);

assertEqual(
  "BUY Entry",
  buyExperience.entry,
  100
);

assertEqual(
  "BUY Stop Loss",
  buyExperience.stopLoss,
  95
);

assertEqual(
  "BUY Target 1",
  buyExperience.target1,
  110
);

assertEqual(
  "BUY Target 2",
  buyExperience.target2,
  115
);

assertEqual(
  "BUY Quantity",
  buyExperience.quantity,
  20
);

assertEqual(
  "BUY Max Risk",
  buyExperience.maxRisk,
  100
);

assertEqual(
  "BUY Risk Reward",
  buyExperience.riskRewardRatio,
  2
);

assertEqual(
  "BUY Risk Message",
  buyExperience.riskMessage,
  "Maximum planned risk is ₹100."
);

// ==========================================
// CASE 2
// PASS + STRONG SELL = TRADE
// ==========================================

const sellExperience =
  buildOpportunityExperienceItem(
    sellStrong
  );

assertEqual(
  "SELL Action",
  sellExperience.action,
  "TRADE"
);

assertEqual(
  "SELL Headline",
  sellExperience.headline,
  "SELL.TEST has a validated SELL opportunity."
);

// ==========================================
// CASE 3
// CAUTION = WATCH
// ==========================================

const watchExperience =
  buildOpportunityExperienceItem(
    cautionWatch
  );

assertEqual(
  "WATCH Action",
  watchExperience.action,
  "WATCH"
);

assertEqual(
  "WATCH Risk Message",
  watchExperience.riskMessage,
  "Risk conditions require caution before taking this trade."
);

// ==========================================
// CASE 4
// BLOCK / REJECT = AVOID
// ==========================================

const blockedExperience =
  buildOpportunityExperienceItem(
    blockedReject
  );

assertEqual(
  "BLOCK Action",
  blockedExperience.action,
  "AVOID"
);

assertEqual(
  "BLOCK Risk Message",
  blockedExperience.riskMessage,
  "Risk Gate blocks this trade."
);

// ==========================================
// CASE 5
// RESULT SUMMARY
// ==========================================

const summary =
  buildOpportunityExperienceResult([
    buyPrime,
    sellStrong,
    cautionWatch,
    blockedReject,
  ]);

assertEqual(
  "Total Opportunities",
  summary.totalOpportunities,
  4
);

assertEqual(
  "Trade Count",
  summary.tradeCount,
  2
);

assertEqual(
  "Watch Count",
  summary.watchCount,
  1
);

assertEqual(
  "Summary Item Count",
  summary.opportunities.length,
  4
);

assertEqual(
  "Summary First Action",
  summary.opportunities[0].action,
  "TRADE"
);

assertEqual(
  "Summary Third Action",
  summary.opportunities[2].action,
  "WATCH"
);

assertEqual(
  "Summary Fourth Action",
  summary.opportunities[3].action,
  "AVOID"
);

console.log("");

console.log(
  "ALL OPPORTUNITY EXPERIENCE CONTRACT CASES PASS"
);
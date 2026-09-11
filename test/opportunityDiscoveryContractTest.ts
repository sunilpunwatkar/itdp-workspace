import {
  OpportunityCandidate,
  OpportunityDiscoveryInput,
  validateOpportunityDiscoveryInput,
  buildOpportunityDiscoveryResult,
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

function assertThrows(
  label: string,
  fn: () => void
) {
  let threw = false;

  try {
    fn();
  } catch {
    threw = true;
  }

  if (!threw) {
    throw new Error(
      `${label} FAILED | Expected function to throw`
    );
  }

  console.log(
    `PASS | ${label} | rejected`
  );
}

console.log(
  "=== OPPORTUNITY DISCOVERY CONTRACT TEST ==="
);

// ==================================================
// CASE 1
// VALID SHORT REQUEST
// ==================================================

const shortInput: OpportunityDiscoveryInput = {
  capital: 75000,
  horizon: "SHORT",
  riskProfile: "BALANCED",
  universe: "NIFTY_500",
  maxResults: 5,
};

assertEqual(
  "SHORT Input Valid",
  validateOpportunityDiscoveryInput(shortInput),
  true
);

// ==================================================
// CASE 2
// VALID MEDIUM REQUEST
// ==================================================

const mediumInput: OpportunityDiscoveryInput = {
  capital: 150000,
  horizon: "MEDIUM",
  riskProfile: "CONSERVATIVE",
  universe: "NIFTY_500",
  maxResults: 10,
};

assertEqual(
  "MEDIUM Input Valid",
  validateOpportunityDiscoveryInput(mediumInput),
  true
);

// ==================================================
// CASE 3
// INVALID / ZERO CAPITAL
// ==================================================

assertThrows(
  "Zero Capital Rejected",
  () =>
    validateOpportunityDiscoveryInput({
      capital: 0,
      horizon: "SHORT",
      riskProfile: "BALANCED",
      universe: "NIFTY_500",
      maxResults: 5,
    })
);

// ==================================================
// CASE 4
// INVALID MAX RESULTS
// ==================================================

assertThrows(
  "Invalid Max Results Rejected",
  () =>
    validateOpportunityDiscoveryInput({
      capital: 75000,
      horizon: "SHORT",
      riskProfile: "BALANCED",
      universe: "NIFTY_500",
      maxResults: 0,
    })
);

// ==================================================
// TEST CANDIDATES
// ==================================================

const candidates: OpportunityCandidate[] = [
  {
    symbol: "AAA",
    decision: "BUY",
    entry: 100,
    stopLoss: 95,
    target1: 110,
    target2: 115,
    riskRewardRatio: 2,
    quantity: 100,
    maxRisk: 500,
    riskGateStatus: "PASS",
    opportunityScore: 96,
    classification: "PRIME",
  },
  {
    symbol: "BBB",
    decision: "SELL",
    entry: 200,
    stopLoss: 210,
    target1: 185,
    target2: 180,
    riskRewardRatio: 1.5,
    quantity: 50,
    maxRisk: 500,
    riskGateStatus: "PASS",
    opportunityScore: 88,
    classification: "PRIME",
  },
  {
    symbol: "CCC",
    decision: "BUY",
    entry: 300,
    stopLoss: 290,
    target1: 315,
    target2: 320,
    riskRewardRatio: 1.5,
    quantity: 50,
    maxRisk: 500,
    riskGateStatus: "CAUTION",
    opportunityScore: 74,
    classification: "STRONG",
  },
  {
    symbol: "DDD",
    decision: "BUY",
    entry: 400,
    stopLoss: 390,
    target1: 420,
    target2: 430,
    riskRewardRatio: 2,
    quantity: 50,
    maxRisk: 500,
    riskGateStatus: "BLOCK",
    opportunityScore: 99,
    classification: "PRIME",
  },
  {
    symbol: "EEE",
    decision: "SELL",
    entry: 500,
    stopLoss: 510,
    target1: 485,
    target2: 480,
    riskRewardRatio: 1.5,
    quantity: 50,
    maxRisk: 500,
    riskGateStatus: "PASS",
    opportunityScore: 50,
    classification: "REJECT",
  },
];

// ==================================================
// CASE 5
// BLOCK CANDIDATE EXCLUDED
// ==================================================

const discoveryResult =
  buildOpportunityDiscoveryResult(
    shortInput,
    candidates
  );

assertEqual(
  "BLOCK Candidate Excluded",
  discoveryResult.opportunities.some(
    (candidate) =>
      candidate.symbol === "DDD"
  ),
  false
);

// ==================================================
// CASE 6
// REJECT CANDIDATE EXCLUDED
// ==================================================

assertEqual(
  "REJECT Candidate Excluded",
  discoveryResult.opportunities.some(
    (candidate) =>
      candidate.symbol === "EEE"
  ),
  false
);

// ==================================================
// CASE 7
// SCORE DESCENDING ORDER
// ==================================================

assertEqual(
  "Top Candidate",
  discoveryResult.opportunities[0]?.symbol,
  "AAA"
);

assertEqual(
  "Second Candidate",
  discoveryResult.opportunities[1]?.symbol,
  "BBB"
);

assertEqual(
  "Third Candidate",
  discoveryResult.opportunities[2]?.symbol,
  "CCC"
);

// ==================================================
// CASE 8
// MAX RESULTS LIMIT
// ==================================================

const limitedResult =
  buildOpportunityDiscoveryResult(
    {
      ...shortInput,
      maxResults: 2,
    },
    candidates
  );

assertEqual(
  "Max Results Limit",
  limitedResult.opportunities.length,
  2
);

// ==================================================
// CASE 9
// BUY / SELL BOTH ACCEPTED
// ==================================================

assertEqual(
  "BUY Candidate Accepted",
  discoveryResult.opportunities.some(
    (candidate) =>
      candidate.decision === "BUY"
  ),
  true
);

assertEqual(
  "SELL Candidate Accepted",
  discoveryResult.opportunities.some(
    (candidate) =>
      candidate.decision === "SELL"
  ),
  true
);

console.log("");
console.log(
  "ALL OPPORTUNITY DISCOVERY CONTRACT CASES PASS"
);
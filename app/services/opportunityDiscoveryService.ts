export type OpportunityHorizon =
  | "SHORT"
  | "MEDIUM";

export type OpportunityRiskProfile =
  | "CONSERVATIVE"
  | "BALANCED"
  | "AGGRESSIVE";

export type OpportunityUniverse =
  | "NIFTY_500";

export type OpportunityDecision =
  | "BUY"
  | "SELL";

export type OpportunityRiskGateStatus =
  | "PASS"
  | "CAUTION"
  | "BLOCK";

export type OpportunityClassification =
  | "PRIME"
  | "STRONG"
  | "WATCH"
  | "REJECT";

export interface OpportunityDiscoveryInput {
  capital: number;

  horizon: OpportunityHorizon;

  riskProfile: OpportunityRiskProfile;

  universe: OpportunityUniverse;

  maxResults: number;
}

export interface OpportunityCandidate {
  symbol: string;

  decision: OpportunityDecision;

  entry: number;
  stopLoss: number;
  target1: number;
  target2: number;

  riskRewardRatio: number;

  quantity: number;
  maxRisk: number;

  riskGateStatus: OpportunityRiskGateStatus;

  opportunityScore: number;

  classification: OpportunityClassification;
}

export interface OpportunityDiscoveryResult {
  universe: OpportunityUniverse;

  horizon: OpportunityHorizon;

  scannedCount: number;
  analyzedCount: number;
  eligibleCount: number;

  opportunities: OpportunityCandidate[];
}

export function validateOpportunityDiscoveryInput(
  input: OpportunityDiscoveryInput
): true {
  if (
    !Number.isFinite(input.capital) ||
    input.capital <= 0
  ) {
    throw new Error("INVALID_CAPITAL");
  }

  if (
    !Number.isInteger(input.maxResults) ||
    input.maxResults <= 0
  ) {
    throw new Error("INVALID_MAX_RESULTS");
  }

  return true;
}

export function buildOpportunityDiscoveryResult(
  input: OpportunityDiscoveryInput,
  candidates: OpportunityCandidate[]
): OpportunityDiscoveryResult {
  validateOpportunityDiscoveryInput(input);

  const eligible = candidates
    .filter(
      (candidate) =>
        candidate.riskGateStatus !== "BLOCK" &&
        candidate.classification !== "REJECT"
    )
    .sort(
      (a, b) =>
        b.opportunityScore -
        a.opportunityScore
    );

  const opportunities = eligible.slice(
    0,
    input.maxResults
  );

  return {
    universe: input.universe,
    horizon: input.horizon,

    scannedCount: candidates.length,
    analyzedCount: candidates.length,
    eligibleCount: eligible.length,

    opportunities,
  };
}
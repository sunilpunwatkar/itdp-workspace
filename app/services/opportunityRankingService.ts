export type OpportunityDirection =
  | "BUY"
  | "SELL";

export type OpportunityRiskGateStatus =
  | "PASS"
  | "CAUTION"
  | "BLOCK";

export type OpportunityEntryContext =
  | "FAVORABLE"
  | "CAUTION"
  | "UNFAVORABLE";

export type OpportunityDecisionQuality =
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export type OpportunityDecisionStrength =
  | "STRONG"
  | "MODERATE"
  | "WEAK";

export type OpportunityReliability =
  | "HIGH_RELIABILITY"
  | "MODERATE_RELIABILITY"
  | "REDUCED_RELIABILITY"
  | "LOW_RELIABILITY";

export type OpportunityConflictSeverity =
  | "NONE"
  | "LOW"
  | "MODERATE"
  | "HIGH";

export type OpportunityClassification =
  | "PRIME"
  | "STRONG"
  | "WATCH"
  | "REJECT";

export interface OpportunityRankingInput {
  direction: OpportunityDirection;

  riskGateStatus: OpportunityRiskGateStatus;

  entryContext: OpportunityEntryContext;

  decisionQuality: OpportunityDecisionQuality;

  decisionStrength: OpportunityDecisionStrength;

  reliability: OpportunityReliability;

  conflictSeverity: OpportunityConflictSeverity;

  riskRewardRatio: number;
}

export interface OpportunityRankingResult {
  score: number;

  classification: OpportunityClassification;

  eligible: boolean;
}

export function calculateOpportunityRanking(
  input: OpportunityRankingInput
): OpportunityRankingResult {
  // --------------------------------------------------
  // RISK GATE — HARD SAFETY OVERRIDE
  // --------------------------------------------------

  if (input.riskGateStatus === "BLOCK") {
    return {
      score: 0,
      classification: "REJECT",
      eligible: false,
    };
  }

  let score = 0;

  // --------------------------------------------------
  // ENTRY CONTEXT — MAX 25
  // --------------------------------------------------

  if (input.entryContext === "FAVORABLE") {
    score += 25;
  } else if (input.entryContext === "CAUTION") {
    score += 12;
  }

  // --------------------------------------------------
  // DECISION QUALITY — MAX 20
  // --------------------------------------------------

  if (input.decisionQuality === "HIGH") {
    score += 20;
  } else if (input.decisionQuality === "MEDIUM") {
    score += 12;
  } else {
    score += 4;
  }

  // --------------------------------------------------
  // DECISION STRENGTH — MAX 15
  // --------------------------------------------------

  if (input.decisionStrength === "STRONG") {
    score += 15;
  } else if (input.decisionStrength === "MODERATE") {
    score += 9;
  } else {
    score += 3;
  }

  // --------------------------------------------------
  // RELIABILITY — MAX 15
  // --------------------------------------------------

  if (input.reliability === "HIGH_RELIABILITY") {
    score += 15;
  } else if (
    input.reliability === "MODERATE_RELIABILITY"
  ) {
    score += 10;
  } else if (
    input.reliability === "REDUCED_RELIABILITY"
  ) {
    score += 5;
  }

  // --------------------------------------------------
  // RISK : REWARD — MAX 15
  // --------------------------------------------------

  if (input.riskRewardRatio >= 2) {
    score += 15;
  } else if (input.riskRewardRatio >= 1.5) {
    score += 11;
  } else if (input.riskRewardRatio >= 1.2) {
    score += 6;
  }

  // --------------------------------------------------
  // CONFLICT SEVERITY — MAX 10
  // --------------------------------------------------

  if (input.conflictSeverity === "NONE") {
    score += 10;
  } else if (input.conflictSeverity === "LOW") {
    score += 7;
  } else if (
    input.conflictSeverity === "MODERATE"
  ) {
    score += 3;
  }

  // --------------------------------------------------
  // FINAL CLASSIFICATION
  // --------------------------------------------------

  let classification: OpportunityClassification;

  if (score >= 85) {
    classification = "PRIME";
  } else if (score >= 70) {
    classification = "STRONG";
  } else if (score >= 55) {
    classification = "WATCH";
  } else {
    classification = "REJECT";
  }

  return {
    score,
    classification,
    eligible: classification !== "REJECT",
  };
}
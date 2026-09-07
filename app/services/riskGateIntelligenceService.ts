export type RiskGateStatus =
  | "PASS"
  | "CAUTION"
  | "BLOCK";

export type RiskGateDecision =
  | "BUY"
  | "SELL"
  | "HOLD";

export type RiskGateEntryContext =
  | "FAVORABLE"
  | "CAUTION"
  | "UNFAVORABLE";

export type RiskGateConflictSeverity =
  | "NONE"
  | "LOW"
  | "MODERATE"
  | "HIGH";

export type RiskGateReliability =
  | "HIGH_RELIABILITY"
  | "MODERATE_RELIABILITY"
  | "REDUCED_RELIABILITY"
  | "LOW_RELIABILITY";

export type RiskGateDecisionQuality =
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export interface RiskGateIntelligenceInput {
  decision: RiskGateDecision;
  entryContext: RiskGateEntryContext;
  conflictSeverity: RiskGateConflictSeverity;
  reliability: RiskGateReliability;
  decisionQuality: RiskGateDecisionQuality;

  entry: number;
  stopLoss: number;
  target1: number;
  riskReward: number;
  quantity: number;
}

export interface RiskGateIntelligenceResult {
  status: RiskGateStatus;
  reason: string;
  failures: string[];
  warnings: string[];
}

export function calculateRiskGateIntelligence(
  input: RiskGateIntelligenceInput
): RiskGateIntelligenceResult {
  const {
    decision,
    entryContext,
    conflictSeverity,
    reliability,
    decisionQuality,
    entry,
    stopLoss,
    target1,
    riskReward,
    quantity,
  } = input;

  const failures: string[] = [];
  const warnings: string[] = [];

  // --------------------------------------------------
  // CRITICAL GATES
  // --------------------------------------------------

  if (decision === "HOLD") {
    failures.push(
      "Final decision is HOLD, so no trade is permitted."
    );
  }

  if (entryContext === "UNFAVORABLE") {
    failures.push(
      "Entry context is UNFAVORABLE."
    );
  }

  if (conflictSeverity === "HIGH") {
    failures.push(
      "High conflict is present in market evidence."
    );
  }

  if (reliability === "LOW_RELIABILITY") {
    failures.push(
      "Decision reliability is LOW."
    );
  }

  if (!Number.isFinite(entry) || entry <= 0) {
    failures.push(
      "Entry price is invalid."
    );
  }

  if (!Number.isFinite(stopLoss) || stopLoss <= 0) {
    failures.push(
      "Stop loss is invalid."
    );
  }

  if (!Number.isFinite(target1) || target1 <= 0) {
    failures.push(
      "Target 1 is invalid."
    );
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    failures.push(
      "Position quantity is invalid."
    );
  }

  if (!Number.isFinite(riskReward) || riskReward <= 1) {
    failures.push(
      "Risk/Reward is invalid or not greater than 1."
    );
  }

  // --------------------------------------------------
  // BLOCK HAS PRIORITY OVER ALL WARNINGS
  // --------------------------------------------------

  if (failures.length > 0) {
    return {
      status: "BLOCK",
      reason:
        "Critical risk conditions failed. Trade execution is blocked.",
      failures,
      warnings,
    };
  }

  // --------------------------------------------------
  // WARNING GATES
  // --------------------------------------------------

  if (entryContext === "CAUTION") {
    warnings.push(
      "Entry context requires caution."
    );
  }

  if (conflictSeverity === "LOW") {
    warnings.push(
      "Low-level conflict is present."
    );
  }

  if (conflictSeverity === "MODERATE") {
    warnings.push(
      "Moderate conflict is present."
    );
  }

  if (reliability === "REDUCED_RELIABILITY") {
    warnings.push(
      "Decision reliability is reduced."
    );
  }

  if (decisionQuality === "LOW") {
    warnings.push(
      "Decision quality is LOW."
    );
  }

  if (riskReward > 1 && riskReward < 1.5) {
    warnings.push(
      "Risk/Reward is valid but relatively weak."
    );
  }

  // --------------------------------------------------
  // CAUTION
  // --------------------------------------------------

  if (warnings.length > 0) {
    return {
      status: "CAUTION",
      reason:
        "Trade is executable, but one or more risk warnings require caution.",
      failures,
      warnings,
    };
  }

  // --------------------------------------------------
  // PASS
  // --------------------------------------------------

  return {
    status: "PASS",
    reason:
      "All critical risk conditions passed and no material warnings were detected.",
    failures,
    warnings,
  };
}
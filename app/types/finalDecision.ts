export type FinalDecision =
  | "BUY"
  | "SELL"
  | "HOLD";

export type DecisionStrength =
  | "STRONG"
  | "MODERATE"
  | "WEAK";

export type DecisionQuality =
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export type FinalEvidence =
  | "BULLISH"
  | "BEARISH"
  | "NEUTRAL"
  | "MIXED";

export type FinalConflictSeverity =
  | "NONE"
  | "LOW"
  | "MODERATE"
  | "HIGH";

export type FinalReliability =
  | "HIGH_RELIABILITY"
  | "MODERATE_RELIABILITY"
  | "REDUCED_RELIABILITY"
  | "LOW_RELIABILITY";

export interface FinalDecisionInput {
  direction:
    | "STRONG_BULLISH"
    | "BULLISH"
    | "NEUTRAL"
    | "BEARISH"
    | "STRONG_BEARISH";

  momentumDirection:
    | "STRONG_BULLISH"
    | "BULLISH"
    | "NEUTRAL"
    | "BEARISH"
    | "STRONG_BEARISH";

  momentumStrength:
    | "STRONG"
    | "MODERATE"
    | "WEAK"
    | "CONFLICTING";

  momentumAgreement:
    | "AGREE"
    | "PARTIAL"
    | "CONFLICT";

  location:
    | "AT_SUPPORT"
    | "NEAR_SUPPORT"
    | "MID_RANGE"
    | "NEAR_RESISTANCE"
    | "AT_RESISTANCE"
    | "ABOVE_RESISTANCE"
    | "BELOW_SUPPORT";

  locationQuality:
    | "FAVORABLE"
    | "NEUTRAL"
    | "UNFAVORABLE"
    | "NOT_AVAILABLE";

  overallEvidence:
    | "BULLISH_EVIDENCE"
    | "BEARISH_EVIDENCE"
    | "NEUTRAL_EVIDENCE"
    | "MIXED_EVIDENCE";

  evidenceStrength:
    | "STRONG"
    | "MODERATE"
    | "WEAK"
    | "CONFLICTING";

  evidenceAlignment:
    | "STRONG_ALIGNMENT"
    | "PARTIAL_ALIGNMENT"
    | "MIXED"
    | "NO_ALIGNMENT";

  conflictStatus:
    | "NO_CONFLICT"
    | "CONFLICT";

  conflictCount: number;

  conflictSeverity:
    | "NONE"
    | "LOW"
    | "MODERATE"
    | "HIGH";

  reliabilityImpact:
    | "HIGH_RELIABILITY"
    | "MODERATE_RELIABILITY"
    | "REDUCED_RELIABILITY"
    | "LOW_RELIABILITY";
}

export interface FinalDecisionResult {
  decision: FinalDecision;

  decisionStrength: DecisionStrength;

  decisionQuality: DecisionQuality;

  evidence: FinalEvidence;

  conflict: FinalConflictSeverity;

  reliability: FinalReliability;

  reason: string;

  invalidIf: string[];
}
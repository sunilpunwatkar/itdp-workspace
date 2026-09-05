import {
  FinalDecisionInput,
  FinalDecisionResult,
  FinalDecision,
  DecisionStrength,
  DecisionQuality,
  FinalEvidence,
  FinalConflictSeverity,
  FinalReliability,
} from "../types/finalDecision";

function mapEvidence(
  evidence: FinalDecisionInput["overallEvidence"]
): FinalEvidence {
  switch (evidence) {
    case "BULLISH_EVIDENCE":
      return "BULLISH";

    case "BEARISH_EVIDENCE":
      return "BEARISH";

    case "NEUTRAL_EVIDENCE":
      return "NEUTRAL";

    case "MIXED_EVIDENCE":
      return "MIXED";
  }
}

function isBullishDirection(
  direction: FinalDecisionInput["direction"]
): boolean {
  return (
    direction === "BULLISH" ||
    direction === "STRONG_BULLISH"
  );
}

function isBearishDirection(
  direction: FinalDecisionInput["direction"]
): boolean {
  return (
    direction === "BEARISH" ||
    direction === "STRONG_BEARISH"
  );
}

function isBullishMomentum(
  momentum: FinalDecisionInput["momentumDirection"]
): boolean {
  return (
    momentum === "BULLISH" ||
    momentum === "STRONG_BULLISH"
  );
}

function isBearishMomentum(
  momentum: FinalDecisionInput["momentumDirection"]
): boolean {
  return (
    momentum === "BEARISH" ||
    momentum === "STRONG_BEARISH"
  );
}

function isStrongBullishAlignment(
  input: FinalDecisionInput
): boolean {
  return (
    input.direction === "STRONG_BULLISH" &&
    input.momentumDirection === "STRONG_BULLISH" &&
    input.overallEvidence === "BULLISH_EVIDENCE" &&
    input.evidenceStrength === "STRONG" &&
    input.evidenceAlignment === "STRONG_ALIGNMENT"
  );
}

function isStrongBearishAlignment(
  input: FinalDecisionInput
): boolean {
  return (
    input.direction === "STRONG_BEARISH" &&
    input.momentumDirection === "STRONG_BEARISH" &&
    input.overallEvidence === "BEARISH_EVIDENCE" &&
    input.evidenceStrength === "STRONG" &&
    input.evidenceAlignment === "STRONG_ALIGNMENT"
  );
}

function hasHighConflict(
  input: FinalDecisionInput
): boolean {
  return (
    input.conflictStatus === "CONFLICT" &&
    input.conflictSeverity === "HIGH"
  );
}

function hasUnfavorableBullishLocation(
  input: FinalDecisionInput
): boolean {
  return (
    isBullishDirection(input.direction) &&
    (
      input.location === "AT_RESISTANCE" ||
      input.location === "NEAR_RESISTANCE"
    )
  );
}

function hasUnfavorableBearishLocation(
  input: FinalDecisionInput
): boolean {
  return (
    isBearishDirection(input.direction) &&
    (
      input.location === "AT_SUPPORT" ||
      input.location === "NEAR_SUPPORT"
    )
  );
}

function calculateDecision(
  input: FinalDecisionInput
): {
  decision: FinalDecision;
  decisionStrength: DecisionStrength;
  decisionQuality: DecisionQuality;
  reason: string;
} {
  /*
   * RULE 1
   * High directional conflict has highest priority.
   */
  if (hasHighConflict(input)) {
    return {
      decision: "HOLD",
      decisionStrength: "WEAK",
      decisionQuality: "LOW",
      reason:
        "HOLD because Direction and Momentum contain a HIGH conflict.",
    };
  }

  /*
   * RULE 2
   * Neutral or mixed evidence cannot produce an active trade.
   */
  if (
    input.overallEvidence === "NEUTRAL_EVIDENCE" ||
    input.overallEvidence === "MIXED_EVIDENCE"
  ) {
    return {
      decision: "HOLD",
      decisionStrength: "WEAK",
      decisionQuality: "LOW",
      reason:
        "HOLD because directional evidence is neutral or mixed.",
    };
  }

  /*
   * RULE 3
   * Poor bullish entry location.
   */
  if (hasUnfavorableBullishLocation(input)) {
    return {
      decision: "HOLD",
      decisionStrength: "WEAK",
      decisionQuality: "LOW",
      reason:
        "HOLD because bullish evidence is present but price is at or near resistance.",
    };
  }

  /*
   * RULE 4
   * Poor bearish entry location.
   */
  if (hasUnfavorableBearishLocation(input)) {
    return {
      decision: "HOLD",
      decisionStrength: "WEAK",
      decisionQuality: "LOW",
      reason:
        "HOLD because bearish evidence is present but price is at or near support.",
    };
  }

  /*
   * RULE 5
   * Strong bullish alignment.
   */
  if (isStrongBullishAlignment(input)) {
    return {
      decision: "BUY",
      decisionStrength: "STRONG",
      decisionQuality: "HIGH",
      reason:
        "BUY because Direction, Momentum and Evidence are strongly aligned bullish.",
    };
  }

  /*
   * RULE 6
   * Strong bearish alignment.
   */
  if (isStrongBearishAlignment(input)) {
    return {
      decision: "SELL",
      decisionStrength: "STRONG",
      decisionQuality: "HIGH",
      reason:
        "SELL because Direction, Momentum and Evidence are strongly aligned bearish.",
    };
  }

  /*
   * RULE 7
   * Bullish directional alignment.
   */
  if (
    isBullishDirection(input.direction) &&
    isBullishMomentum(input.momentumDirection) &&
    input.overallEvidence === "BULLISH_EVIDENCE" &&
    input.momentumStrength !== "WEAK"
  ) {
    return {
      decision: "BUY",
      decisionStrength: "MODERATE",
      decisionQuality: "MEDIUM",
      reason:
        "BUY because Direction, Momentum and Evidence are aligned bullish.",
    };
  }

  /*
   * RULE 8
   * Bearish directional alignment.
   */
  if (
    isBearishDirection(input.direction) &&
    isBearishMomentum(input.momentumDirection) &&
    input.overallEvidence === "BEARISH_EVIDENCE" &&
    input.momentumStrength !== "WEAK"
  ) {
    return {
      decision: "SELL",
      decisionStrength: "MODERATE",
      decisionQuality: "MEDIUM",
      reason:
        "SELL because Direction, Momentum and Evidence are aligned bearish.",
    };
  }

  /*
   * RULE 9
   * Everything else remains HOLD.
   */
  return {
    decision: "HOLD",
    decisionStrength: "WEAK",
    decisionQuality: "LOW",
    reason:
      "HOLD because the available evidence is insufficient for a reliable active decision.",
  };
}

function buildInvalidIf(
  input: FinalDecisionInput,
  decision: FinalDecision
): string[] {
  if (decision === "BUY") {
    return [
      "Direction changes to BEARISH",
      "Momentum develops HIGH conflict",
      "Price loses key support",
    ];
  }

  if (decision === "SELL") {
    return [
      "Direction changes to BULLISH",
      "Momentum develops HIGH conflict",
      "Price breaks key resistance",
    ];
  }

  if (input.conflictSeverity === "HIGH") {
    return [
      "Direction and Momentum become aligned",
      "HIGH conflict is resolved",
    ];
  }

  return [
    "New directional evidence becomes sufficiently aligned",
  ];
}

export function calculateFinalDecision(
  input: FinalDecisionInput
): FinalDecisionResult {
  /*
   * Basic defensive validation.
   */
  if (
    !Number.isFinite(input.conflictCount) ||
    input.conflictCount < 0
  ) {
    return {
      decision: "HOLD",
      decisionStrength: "WEAK",
      decisionQuality: "LOW",
      evidence: mapEvidence(input.overallEvidence),
      conflict: input.conflictSeverity,
      reliability: input.reliabilityImpact as FinalReliability,
      reason:
        "HOLD because conflict count is invalid.",
      invalidIf: [
        "Conflict count becomes a valid non-negative number",
      ],
    };
  }

  const result = calculateDecision(input);

  return {
    decision: result.decision,
    decisionStrength: result.decisionStrength,
    decisionQuality: result.decisionQuality,
    evidence: mapEvidence(input.overallEvidence),
    conflict:
      input.conflictSeverity as FinalConflictSeverity,
    reliability:
      input.reliabilityImpact as FinalReliability,
    reason: result.reason,
    invalidIf: buildInvalidIf(
      input,
      result.decision
    ),
  };
}
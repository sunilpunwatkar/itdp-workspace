export type ConflictStatus =
  | "NO_CONFLICT"
  | "CONFLICT";

export type ConflictSeverity =
  | "NONE"
  | "LOW"
  | "MODERATE"
  | "HIGH";

export type ReliabilityImpact =
  | "HIGH_RELIABILITY"
  | "MODERATE_RELIABILITY"
  | "REDUCED_RELIABILITY"
  | "LOW_RELIABILITY";

export interface ConflictEngineResult {
  conflictStatus: ConflictStatus;
  conflictSeverity: ConflictSeverity;
  conflictCount: number;

  directionMomentumConflict: boolean;
  directionLocationConflict: boolean;
  momentumLocationConflict: boolean;

  reliabilityImpact: ReliabilityImpact;
  reason: string;
}

type Direction =
  | "STRONG_BULLISH"
  | "BULLISH"
  | "NEUTRAL"
  | "BEARISH"
  | "STRONG_BEARISH";

type MomentumDirection = Direction;

type MomentumStrength =
  | "STRONG"
  | "MODERATE"
  | "WEAK"
  | "CONFLICTING";

type MomentumAgreement =
  | "AGREE"
  | "PARTIAL"
  | "CONFLICT";

type Location =
  | "AT_SUPPORT"
  | "NEAR_SUPPORT"
  | "MID_RANGE"
  | "NEAR_RESISTANCE"
  | "AT_RESISTANCE"
  | "ABOVE_RESISTANCE"
  | "BELOW_SUPPORT";

type LocationQuality =
  | "FAVORABLE"
  | "NEUTRAL"
  | "UNFAVORABLE"
  | "NOT_AVAILABLE";

type OverallEvidence =
  | "BULLISH_EVIDENCE"
  | "BEARISH_EVIDENCE"
  | "NEUTRAL_EVIDENCE"
  | "MIXED_EVIDENCE";

type EvidenceStrength =
  | "STRONG"
  | "MODERATE"
  | "WEAK"
  | "CONFLICTING";

type EvidenceAlignment =
  | "STRONG_ALIGNMENT"
  | "PARTIAL_ALIGNMENT"
  | "MIXED"
  | "NO_ALIGNMENT";


export function calculateConflictEngine(
  direction: Direction,
  directionEvidence: string,
  momentumDirection: MomentumDirection,
  momentumStrength: MomentumStrength,
  momentumAgreement: MomentumAgreement,
  location: Location,
  locationQuality: LocationQuality,
  overallEvidence: OverallEvidence,
  evidenceStrength: EvidenceStrength,
  evidenceAlignment: EvidenceAlignment
): ConflictEngineResult {

  const directionMomentumConflict =
    isDirectionMomentumConflict(
      direction,
      momentumDirection
    );

  const directionLocationConflict =
    isDirectionLocationConflict(
      direction,
      location,
      locationQuality
    );

  const momentumLocationConflict =
    isMomentumLocationConflict(
      momentumDirection,
      location
    );

  const conflictCount =
    Number(directionMomentumConflict) +
    Number(directionLocationConflict) +
    Number(momentumLocationConflict);

  const conflictSeverity =
    calculateConflictSeverity(
      directionMomentumConflict,
      directionLocationConflict,
      momentumLocationConflict
    );

  const conflictStatus: ConflictStatus =
    conflictCount > 0
      ? "CONFLICT"
      : "NO_CONFLICT";

  const reliabilityImpact =
    calculateReliabilityImpact(conflictSeverity);

  const reason = buildConflictReason(
    direction,
    directionEvidence,
    momentumDirection,
    momentumStrength,
    momentumAgreement,
    location,
    locationQuality,
    overallEvidence,
    evidenceStrength,
    evidenceAlignment,
    directionMomentumConflict,
    directionLocationConflict,
    momentumLocationConflict,
    conflictSeverity,
    reliabilityImpact
  );

  return {
    conflictStatus,
    conflictSeverity,
    conflictCount,
    directionMomentumConflict,
    directionLocationConflict,
    momentumLocationConflict,
    reliabilityImpact,
    reason,
  };
}


function isDirectionMomentumConflict(
  direction: Direction,
  momentumDirection: MomentumDirection
): boolean {

  const bullishDirection =
    direction === "BULLISH" ||
    direction === "STRONG_BULLISH";

  const bearishDirection =
    direction === "BEARISH" ||
    direction === "STRONG_BEARISH";

  const bullishMomentum =
    momentumDirection === "BULLISH" ||
    momentumDirection === "STRONG_BULLISH";

  const bearishMomentum =
    momentumDirection === "BEARISH" ||
    momentumDirection === "STRONG_BEARISH";

  return (
    (bullishDirection && bearishMomentum) ||
    (bearishDirection && bullishMomentum)
  );
}


function isDirectionLocationConflict(
  direction: Direction,
  location: Location,
  locationQuality: LocationQuality
): boolean {

  const bullishDirection =
    direction === "BULLISH" ||
    direction === "STRONG_BULLISH";

  const bearishDirection =
    direction === "BEARISH" ||
    direction === "STRONG_BEARISH";

  if (
    bullishDirection &&
    (
      location === "AT_RESISTANCE" ||
      location === "NEAR_RESISTANCE" ||
      location === "BELOW_SUPPORT"
    )
  ) {
    return true;
  }

  if (
    bearishDirection &&
    (
      location === "AT_SUPPORT" ||
      location === "NEAR_SUPPORT" ||
      location === "ABOVE_RESISTANCE"
    )
  ) {
    return true;
  }

  return false;
}


function isMomentumLocationConflict(
  momentumDirection: MomentumDirection,
  location: Location
): boolean {

  const bullishMomentum =
    momentumDirection === "BULLISH" ||
    momentumDirection === "STRONG_BULLISH";

  const bearishMomentum =
    momentumDirection === "BEARISH" ||
    momentumDirection === "STRONG_BEARISH";

  if (
    bullishMomentum &&
    (
      location === "AT_RESISTANCE" ||
      location === "NEAR_RESISTANCE"
    )
  ) {
    return true;
  }

  if (
    bearishMomentum &&
    (
      location === "AT_SUPPORT" ||
      location === "NEAR_SUPPORT"
    )
  ) {
    return true;
  }

  return false;
}


function calculateConflictSeverity(
  directionMomentumConflict: boolean,
  directionLocationConflict: boolean,
  momentumLocationConflict: boolean
): ConflictSeverity {

  if (directionMomentumConflict) {
    return "HIGH";
  }

  if (
    directionLocationConflict ||
    momentumLocationConflict
  ) {
    return "LOW";
  }

  return "NONE";
}


function calculateReliabilityImpact(
  severity: ConflictSeverity
): ReliabilityImpact {

  switch (severity) {

    case "HIGH":
      return "LOW_RELIABILITY";

    case "MODERATE":
      return "REDUCED_RELIABILITY";

    case "LOW":
      return "MODERATE_RELIABILITY";

    default:
      return "HIGH_RELIABILITY";
  }
}


function buildConflictReason(
  direction: Direction,
  directionEvidence: string,
  momentumDirection: MomentumDirection,
  momentumStrength: MomentumStrength,
  momentumAgreement: MomentumAgreement,
  location: Location,
  locationQuality: LocationQuality,
  overallEvidence: OverallEvidence,
  evidenceStrength: EvidenceStrength,
  evidenceAlignment: EvidenceAlignment,
  directionMomentumConflict: boolean,
  directionLocationConflict: boolean,
  momentumLocationConflict: boolean,
  conflictSeverity: ConflictSeverity,
  reliabilityImpact: ReliabilityImpact
): string {

  const reasons: string[] = [];

  if (directionMomentumConflict) {
    reasons.push(
      `Direction (${direction}) conflicts with Momentum (${momentumDirection}).`
    );
  }

  if (directionLocationConflict) {
    reasons.push(
      `Direction (${direction}) conflicts with price location (${location}).`
    );
  }

  if (momentumLocationConflict) {
    reasons.push(
      `Momentum (${momentumDirection}) conflicts with price location (${location}).`
    );
  }

  if (reasons.length === 0) {
    reasons.push(
      `Direction (${direction}), Momentum (${momentumDirection}) and Location (${location}) show no meaningful conflict.`
    );
  }

  reasons.push(
    `Evidence: ${overallEvidence}, strength ${evidenceStrength}, alignment ${evidenceAlignment}.`
  );

  reasons.push(
    `Momentum agreement: ${momentumAgreement}, strength ${momentumStrength}.`
  );

  if (directionEvidence) {
    reasons.push(
      `Direction evidence: ${directionEvidence}.`
    );
  }

  reasons.push(
    `Location quality: ${locationQuality}.`
  );

  reasons.push(
    `Conflict severity: ${conflictSeverity}.`
  );

  reasons.push(
    `Reliability impact: ${reliabilityImpact}.`
  );

  return reasons.join(" ");
}
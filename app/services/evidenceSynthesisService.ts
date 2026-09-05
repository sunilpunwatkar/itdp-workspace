export type OverallEvidence =
  | "BULLISH_EVIDENCE"
  | "BEARISH_EVIDENCE"
  | "NEUTRAL_EVIDENCE"
  | "MIXED_EVIDENCE";

export type EvidenceStrength =
  | "STRONG"
  | "MODERATE"
  | "WEAK"
  | "CONFLICTING";

export type EvidenceAlignment =
  | "STRONG_ALIGNMENT"
  | "PARTIAL_ALIGNMENT"
  | "MIXED"
  | "NO_ALIGNMENT";

export interface EvidenceSynthesisResult {
  overallEvidence: OverallEvidence;
  evidenceStrength: EvidenceStrength;
  evidenceAlignment: EvidenceAlignment;

  direction: string;
  momentumDirection: string;

  location: string;
  locationQuality: string;

  reason: string;
}

export function calculateEvidenceSynthesis(
  direction:
    | "STRONG_BULLISH"
    | "BULLISH"
    | "NEUTRAL"
    | "BEARISH"
    | "STRONG_BEARISH",

  momentumDirection:
    | "STRONG_BULLISH"
    | "BULLISH"
    | "NEUTRAL"
    | "BEARISH"
    | "STRONG_BEARISH",

  momentumStrength:
    | "STRONG"
    | "MODERATE"
    | "WEAK"
    | "CONFLICTING",

  momentumAgreement:
    | "AGREE"
    | "PARTIAL"
    | "CONFLICT",

  location:
    | "AT_SUPPORT"
    | "NEAR_SUPPORT"
    | "MID_RANGE"
    | "NEAR_RESISTANCE"
    | "AT_RESISTANCE"
    | "ABOVE_RESISTANCE"
    | "BELOW_SUPPORT",

  locationQuality:
    | "FAVORABLE"
    | "NEUTRAL"
    | "UNFAVORABLE"
    | "NOT_AVAILABLE"
): EvidenceSynthesisResult {

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

  let overallEvidence: OverallEvidence;
  let evidenceStrength: EvidenceStrength;
  let evidenceAlignment: EvidenceAlignment;
  let reason: string;

  /*
   * ---------------------------------------------------------
   * 1. STRONG AGREEMENT
   * ---------------------------------------------------------
   */

  if (
    direction === "STRONG_BULLISH" &&
    momentumDirection === "STRONG_BULLISH" &&
    momentumAgreement === "AGREE"
  ) {
    overallEvidence = "BULLISH_EVIDENCE";
    evidenceStrength = "STRONG";
    evidenceAlignment = "STRONG_ALIGNMENT";

    reason =
      "Direction and momentum are strongly bullish and fully aligned.";
  }

  else if (
    direction === "STRONG_BEARISH" &&
    momentumDirection === "STRONG_BEARISH" &&
    momentumAgreement === "AGREE"
  ) {
    overallEvidence = "BEARISH_EVIDENCE";
    evidenceStrength = "STRONG";
    evidenceAlignment = "STRONG_ALIGNMENT";

    reason =
      "Direction and momentum are strongly bearish and fully aligned.";
  }

  /*
   * ---------------------------------------------------------
   * 2. DIRECT CONFLICT
   * ---------------------------------------------------------
   */

  else if (
    bullishDirection &&
    bearishMomentum
  ) {
    overallEvidence = "MIXED_EVIDENCE";
    evidenceStrength = "CONFLICTING";
    evidenceAlignment = "MIXED";

    reason =
      "Direction is bullish but momentum is bearish, creating conflicting evidence.";
  }

  else if (
    bearishDirection &&
    bullishMomentum
  ) {
    overallEvidence = "MIXED_EVIDENCE";
    evidenceStrength = "CONFLICTING";
    evidenceAlignment = "MIXED";

    reason =
      "Direction is bearish but momentum is bullish, creating conflicting evidence.";
  }

  /*
   * ---------------------------------------------------------
   * 3. BULLISH DIRECTION + BULLISH MOMENTUM
   * ---------------------------------------------------------
   */

  else if (
    bullishDirection &&
    bullishMomentum
  ) {
    overallEvidence = "BULLISH_EVIDENCE";

    if (
      direction === "STRONG_BULLISH" ||
      momentumDirection === "STRONG_BULLISH"
    ) {
      evidenceStrength = "STRONG";
    } else {
      evidenceStrength = "MODERATE";
    }

    evidenceAlignment =
      momentumAgreement === "AGREE"
        ? "STRONG_ALIGNMENT"
        : "PARTIAL_ALIGNMENT";

    reason =
      "Direction and momentum both provide bullish evidence.";
  }

  /*
   * ---------------------------------------------------------
   * 4. BEARISH DIRECTION + BEARISH MOMENTUM
   * ---------------------------------------------------------
   */

  else if (
    bearishDirection &&
    bearishMomentum
  ) {
    overallEvidence = "BEARISH_EVIDENCE";

    if (
      direction === "STRONG_BEARISH" ||
      momentumDirection === "STRONG_BEARISH"
    ) {
      evidenceStrength = "STRONG";
    } else {
      evidenceStrength = "MODERATE";
    }

    evidenceAlignment =
      momentumAgreement === "AGREE"
        ? "STRONG_ALIGNMENT"
        : "PARTIAL_ALIGNMENT";

    reason =
      "Direction and momentum both provide bearish evidence.";
  }

  /*
   * ---------------------------------------------------------
   * 5. BULLISH DIRECTION + NEUTRAL MOMENTUM
   * ---------------------------------------------------------
   */

  else if (
    bullishDirection &&
    momentumDirection === "NEUTRAL"
  ) {
    overallEvidence = "BULLISH_EVIDENCE";
    evidenceStrength =
      direction === "STRONG_BULLISH"
        ? "MODERATE"
        : "WEAK";

    evidenceAlignment = "PARTIAL_ALIGNMENT";

    reason =
      "Direction is bullish, but momentum is neutral and does not fully confirm the move.";
  }

  /*
   * ---------------------------------------------------------
   * 6. BEARISH DIRECTION + NEUTRAL MOMENTUM
   * ---------------------------------------------------------
   */

  else if (
    bearishDirection &&
    momentumDirection === "NEUTRAL"
  ) {
    overallEvidence = "BEARISH_EVIDENCE";
    evidenceStrength =
      direction === "STRONG_BEARISH"
        ? "MODERATE"
        : "WEAK";

    evidenceAlignment = "PARTIAL_ALIGNMENT";

    reason =
      "Direction is bearish, but momentum is neutral and does not fully confirm the move.";
  }

  /*
   * ---------------------------------------------------------
   * 7. NEUTRAL DIRECTION
   * ---------------------------------------------------------
   */

  else if (
    direction === "NEUTRAL" &&
    momentumDirection === "NEUTRAL"
  ) {
    overallEvidence = "NEUTRAL_EVIDENCE";
    evidenceStrength = "WEAK";
    evidenceAlignment = "NO_ALIGNMENT";

    reason =
      "Neither direction nor momentum establishes a clear directional evidence.";
  }

  /*
   * ---------------------------------------------------------
   * 8. NEUTRAL DIRECTION + MOMENTUM
   * ---------------------------------------------------------
   */

  else if (
    direction === "NEUTRAL" &&
    bullishMomentum
  ) {
    overallEvidence = "MIXED_EVIDENCE";
    evidenceStrength = "WEAK";
    evidenceAlignment = "MIXED";

    reason =
      "Momentum is bullish, but direction has not established a clear bullish trend.";
  }

  else if (
    direction === "NEUTRAL" &&
    bearishMomentum
  ) {
    overallEvidence = "MIXED_EVIDENCE";
    evidenceStrength = "WEAK";
    evidenceAlignment = "MIXED";

    reason =
      "Momentum is bearish, but direction has not established a clear bearish trend.";
  }

  /*
   * ---------------------------------------------------------
   * 9. FALLBACK
   * ---------------------------------------------------------
   */

  else {
    overallEvidence = "NEUTRAL_EVIDENCE";
    evidenceStrength = "WEAK";
    evidenceAlignment = "NO_ALIGNMENT";

    reason =
      "Available evidence does not establish a sufficiently clear directional bias.";
  }

  /*
   * ---------------------------------------------------------
   * LOCATION CONTEXT
   *
   * Location does NOT change the directional evidence.
   * It only describes entry context.
   * ---------------------------------------------------------
   */

  if (
    locationQuality === "UNFAVORABLE"
  ) {
    reason +=
      ` Price location (${location}) is unfavorable for entry context.`;
  }

  else if (
    locationQuality === "FAVORABLE"
  ) {
    reason +=
      ` Price location (${location}) is favorable for entry context.`;
  }

  else if (
    locationQuality === "NEUTRAL"
  ) {
    reason +=
      ` Price location (${location}) provides neutral entry context.`;
  }

  else {
    reason +=
      " Price location quality is not available.";
  }

  return {
    overallEvidence,
    evidenceStrength,
    evidenceAlignment,

    direction,
    momentumDirection,

    location,
    locationQuality,

    reason,
  };
}
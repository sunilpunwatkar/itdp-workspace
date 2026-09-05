export type PriceLocation =
  | "AT_SUPPORT"
  | "NEAR_SUPPORT"
  | "MID_RANGE"
  | "NEAR_RESISTANCE"
  | "AT_RESISTANCE"
  | "ABOVE_RESISTANCE"
  | "BELOW_SUPPORT";

export type RangePosition =
  | "LOWER"
  | "MIDDLE"
  | "UPPER"
  | "NOT_AVAILABLE";

export type LocationQuality =
  | "FAVORABLE"
  | "NEUTRAL"
  | "UNFAVORABLE"
  | "NOT_AVAILABLE";

export interface PriceLocationIntelligenceResult {
  location: PriceLocation;

  distanceToSupport1Atr: number | null;
  distanceToResistance1Atr: number | null;

  rangePosition: RangePosition;
  rangePositionPercent: number | null;

  locationQuality: LocationQuality;

  reason: string;
}

export function calculatePriceLocationIntelligence(
  price: number,
  support1: number | null,
  resistance1: number | null,
  atr: number
): PriceLocationIntelligenceResult {

  const validPrice =
    Number.isFinite(price) && price > 0;

  const validATR =
    Number.isFinite(atr) && atr > 0;

  const validSupport =
    support1 !== null &&
    Number.isFinite(support1) &&
    support1 > 0;

  const validResistance =
    resistance1 !== null &&
    Number.isFinite(resistance1) &&
    resistance1 > 0;

  // --------------------------------
  // 1. ATR-NORMALIZED DISTANCES
  // --------------------------------

  const distanceToSupport1Atr =
    validATR && validSupport && validPrice
      ? (price - support1!) / atr
      : null;

  const distanceToResistance1Atr =
    validATR && validResistance && validPrice
      ? (resistance1! - price) / atr
      : null;


  // --------------------------------
  // 2. RANGE POSITION
  // --------------------------------

  let rangePosition: RangePosition =
    "NOT_AVAILABLE";

  let rangePositionPercent: number | null =
    null;

  const validRange =
    validSupport &&
    validResistance &&
    resistance1! > support1!;

  if (validRange && validPrice && validATR) {

    rangePositionPercent =
      ((price - support1!) /
        (resistance1! - support1!)) *
      100;

    if (rangePositionPercent < 33) {
      rangePosition = "LOWER";
    } else if (rangePositionPercent <= 67) {
      rangePosition = "MIDDLE";
    } else {
      rangePosition = "UPPER";
    }
  }


  // --------------------------------
  // 3. LOCATION
  // --------------------------------

  let location: PriceLocation;
  let locationQuality: LocationQuality;
  let reason: string;


  // Invalid price / ATR / levels
  if (!validPrice) {

    location = "MID_RANGE";
    locationQuality = "NOT_AVAILABLE";
    reason =
      "Current price is invalid, so price location cannot be determined.";

  } else if (
    validSupport &&
    price < support1!
  ) {

    location = "BELOW_SUPPORT";
    locationQuality = "UNFAVORABLE";
    reason =
      "Price is below Support 1, indicating breakdown territory.";

  } else if (
    validResistance &&
    price > resistance1!
  ) {

    location = "ABOVE_RESISTANCE";
    locationQuality = "FAVORABLE";
    reason =
      "Price is above Resistance 1, indicating breakout territory.";

  } else if (
    validATR &&
    distanceToSupport1Atr !== null &&
    distanceToSupport1Atr <= 0.5
  ) {

    location = "AT_SUPPORT";
    locationQuality = "FAVORABLE";
    reason =
      "Price is within 0.5 ATR of Support 1.";

  } else if (
    validATR &&
    distanceToResistance1Atr !== null &&
    distanceToResistance1Atr <= 0.5
  ) {

    location = "AT_RESISTANCE";
    locationQuality = "UNFAVORABLE";
    reason =
      "Price is within 0.5 ATR of Resistance 1.";

  } else if (
    validATR &&
    distanceToSupport1Atr !== null &&
    distanceToSupport1Atr <= 1
  ) {

    location = "NEAR_SUPPORT";
    locationQuality = "FAVORABLE";
    reason =
      "Price is within 1 ATR of Support 1.";

  } else if (
    validATR &&
    distanceToResistance1Atr !== null &&
    distanceToResistance1Atr <= 1
  ) {

    location = "NEAR_RESISTANCE";
    locationQuality = "UNFAVORABLE";
    reason =
      "Price is within 1 ATR of Resistance 1.";

  } else if (
    validSupport ||
    validResistance
  ) {

    location = "MID_RANGE";
    locationQuality = "NEUTRAL";
    reason =
      "Price is not sufficiently close to the primary support or resistance level.";

  } else {

    location = "MID_RANGE";
    locationQuality = "NOT_AVAILABLE";
    reason =
      "Support and Resistance levels are not available.";
  }


  // --------------------------------
  // 4. INVALID ATR OVERRIDE
  // --------------------------------

  if (!validATR) {
    locationQuality = "NOT_AVAILABLE";

    if (
      validSupport &&
      validResistance &&
      validRange &&
      validPrice
    ) {
      reason =
        "ATR is invalid, so volatility-normalized price location cannot be determined.";
    }
  }


  return {
    location,
    distanceToSupport1Atr,
    distanceToResistance1Atr,
    rangePosition,
    rangePositionPercent,
    locationQuality,
    reason,
  };
}
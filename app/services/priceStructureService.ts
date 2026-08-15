export type PriceStructure =
  | "BREAKDOWN"
  | "NEAR_SUPPORT"
  | "RANGE"
  | "NEAR_RESISTANCE"
  | "BREAKOUT";

export interface PriceStructureResult {
  structure: PriceStructure;
  distanceToSupport1: number | null;
  distanceToResistance1: number | null;
}

export function calculatePriceStructure(
  price: number,
  support1: number | null,
  resistance1: number | null
): PriceStructureResult {

  if (
    support1 === null &&
    resistance1 === null
  ) {
    return {
      structure: "RANGE",
      distanceToSupport1: null,
      distanceToResistance1: null,
    };
  }

  const distanceToSupport1 =
    support1 !== null
      ? price - support1
      : null;

  const distanceToResistance1 =
    resistance1 !== null
      ? resistance1 - price
      : null;

  if (
    support1 !== null &&
    price < support1
  ) {
    return {
      structure: "BREAKDOWN",
      distanceToSupport1,
      distanceToResistance1,
    };
  }

  if (
    resistance1 !== null &&
    price > resistance1
  ) {
    return {
      structure: "BREAKOUT",
      distanceToSupport1,
      distanceToResistance1,
    };
  }

  if (
    support1 !== null &&
    Math.abs(price - support1) /
      support1 <= 0.005
  ) {
    return {
      structure: "NEAR_SUPPORT",
      distanceToSupport1,
      distanceToResistance1,
    };
  }

  if (
    resistance1 !== null &&
    Math.abs(price - resistance1) /
      resistance1 <= 0.005
  ) {
    return {
      structure: "NEAR_RESISTANCE",
      distanceToSupport1,
      distanceToResistance1,
    };
  }

  return {
    structure: "RANGE",
    distanceToSupport1,
    distanceToResistance1,
  };
}
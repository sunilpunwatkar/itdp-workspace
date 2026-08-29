import { EntryContext } from "../types/entryContext";

export type EntryDirection =
  | "BUY"
  | "SELL"
  | "HOLD";

export type PriceStructure =
  | "BREAKOUT"
  | "NEAR_SUPPORT"
  | "BREAKDOWN"
  | "NEAR_RESISTANCE"
  | "RANGE";

export function calculateEntryContext(
  decision: EntryDirection,
  structure: PriceStructure
): EntryContext {

  // HOLD = No confirmed trade
  if (decision === "HOLD") {
    return "UNFAVORABLE";
  }

  // BUY
  if (decision === "BUY") {

    if (
      structure === "BREAKOUT" ||
      structure === "NEAR_SUPPORT"
    ) {
      return "FAVORABLE";
    }

    if (structure === "NEAR_RESISTANCE") {
      return "CAUTION";
    }

    if (structure === "RANGE") {
      return "CAUTION";
    }

    if (structure === "BREAKDOWN") {
      return "UNFAVORABLE";
    }
  }

  // SELL
  if (decision === "SELL") {

    if (
      structure === "BREAKDOWN" ||
      structure === "NEAR_RESISTANCE"
    ) {
      return "FAVORABLE";
    }

    if (structure === "NEAR_SUPPORT") {
      return "CAUTION";
    }

    if (structure === "RANGE") {
      return "CAUTION";
    }

    if (structure === "BREAKOUT") {
      return "UNFAVORABLE";
    }
  }

  // Safety fallback
  return "UNFAVORABLE";
}
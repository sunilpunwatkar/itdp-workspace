
import { EntryContext } from "../types/entryContext";

export interface TradePlan {
  tradeQuality: string;
  holdingPeriod: string;
  aiSummary: string;
}

export function buildTradePlan(
  decision: string,
  confidence: number,
  entryContext: EntryContext
): TradePlan {

  // =====================================
  // HOLD = NO TRADE
  // =====================================

  if (decision === "HOLD") {
    return {
      tradeQuality: "NO TRADE",
      holdingPeriod: "-",
      aiSummary:
        "Indicators are mixed. Wait for a better setup.",
    };
  }

  // =====================================
  // UNFAVORABLE = NO TRADE
  // =====================================

  if (entryContext === "UNFAVORABLE") {
    return {
      tradeQuality: "NO TRADE",
      holdingPeriod: "-",
      aiSummary:
        "Entry location is unfavorable. Wait for a better setup.",
    };
  }

  // =====================================
  // FAVORABLE ENTRY
  // =====================================

  if (entryContext === "FAVORABLE") {

    return {
      tradeQuality:
        confidence >= 80 ? "A+" :
        confidence >= 60 ? "A" :
        "B",

      holdingPeriod:
        decision === "BUY"
          ? "5 - 15 Days"
          : "3 - 10 Days",

      aiSummary:
        decision === "BUY"
          ? "Bullish trend supported by technical indicators."
          : "Bearish trend supported by technical indicators.",
    };
  }

  // =====================================
  // CAUTION ENTRY
  // =====================================

  if (entryContext === "CAUTION") {

    return {
      tradeQuality:
        confidence >= 80 ? "A" :
        "B",

      holdingPeriod:
        decision === "BUY"
          ? "5 - 15 Days"
          : "3 - 10 Days",

      aiSummary:
        decision === "BUY"
          ? "Bullish setup detected, but entry location requires caution."
          : "Bearish setup detected, but entry location requires caution.",
    };
  }

  // =====================================
  // SAFETY FALLBACK
  // =====================================

  return {
    tradeQuality: "NO TRADE",
    holdingPeriod: "-",
    aiSummary:
      "Entry context could not be confirmed. Wait for a better setup.",
  };
}


import { EntryContext } from "../types/entryContext";

export type EntryDecision = "BUY" | "SELL" | "HOLD";

export type EntryDecisionStrength =
  | "STRONG"
  | "MODERATE"
  | "WEAK";

export type EntryDecisionQuality =
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export type EntryLocation =
  | "AT_SUPPORT"
  | "NEAR_SUPPORT"
  | "MID_RANGE"
  | "NEAR_RESISTANCE"
  | "AT_RESISTANCE"
  | "ABOVE_RESISTANCE"
  | "BELOW_SUPPORT";

export type EntryLocationQuality =
  | "FAVORABLE"
  | "NEUTRAL"
  | "UNFAVORABLE"
  | "NOT_AVAILABLE";

export type EntryConflictSeverity =
  | "NONE"
  | "LOW"
  | "MODERATE"
  | "HIGH";

export type EntryReliability =
  | "HIGH_RELIABILITY"
  | "MODERATE_RELIABILITY"
  | "REDUCED_RELIABILITY"
  | "LOW_RELIABILITY";

export interface EntryContextIntelligenceInput {
  decision: EntryDecision;
  decisionStrength: EntryDecisionStrength;
  decisionQuality: EntryDecisionQuality;
  location: EntryLocation;
  locationQuality: EntryLocationQuality;
  conflictSeverity: EntryConflictSeverity;
  reliability: EntryReliability;
}

export interface EntryContextIntelligenceResult {
  entryContext: EntryContext;
  reason: string;
}

export function calculateEntryContextIntelligence(
  input: EntryContextIntelligenceInput
): EntryContextIntelligenceResult {
  const {
    decision,
    decisionStrength,
    decisionQuality,
    location,
    locationQuality,
    conflictSeverity,
    reliability,
  } = input;

  // ------------------------------------------------------------
  // 1. HOLD means there is no valid entry.
  // ------------------------------------------------------------
  if (decision === "HOLD") {
    return {
      entryContext: "UNFAVORABLE",
      reason: "Final decision is HOLD, so no valid entry is available.",
    };
  }

  // ------------------------------------------------------------
  // 2. High conflict invalidates the entry.
  // ------------------------------------------------------------
  if (conflictSeverity === "HIGH") {
    return {
      entryContext: "UNFAVORABLE",
      reason:
        "High conflict is present between market evidence, so entry is not reliable.",
    };
  }

  // ------------------------------------------------------------
  // 3. Low reliability invalidates the entry.
  // ------------------------------------------------------------
  if (reliability === "LOW_RELIABILITY") {
    return {
      entryContext: "UNFAVORABLE",
      reason:
        "Decision reliability is low, so the current entry should be avoided.",
    };
  }

  // ------------------------------------------------------------
  // 4. Missing / unusable location data.
  // ------------------------------------------------------------
  if (locationQuality === "NOT_AVAILABLE") {
    return {
      entryContext: "CAUTION",
      reason:
        "Price location could not be confirmed, so entry requires caution.",
    };
  }

  // ------------------------------------------------------------
  // 5. BUY entry logic.
  // ------------------------------------------------------------
  if (decision === "BUY") {
    if (
      location === "AT_RESISTANCE" ||
      location === "NEAR_RESISTANCE"
    ) {
      return {
        entryContext: "CAUTION",
        reason:
          "BUY decision is present, but price is close to resistance.",
      };
    }

    if (location === "BELOW_SUPPORT") {
      return {
        entryContext: "UNFAVORABLE",
        reason:
          "Price is below key support, making the BUY entry structurally weak.",
      };
    }

    if (location === "MID_RANGE") {
      return {
        entryContext: "CAUTION",
        reason:
          "BUY decision is present, but price is in the middle of the trading range.",
      };
    }

    if (
      location === "AT_SUPPORT" ||
      location === "NEAR_SUPPORT"
    ) {
      if (
        locationQuality === "FAVORABLE" &&
        decisionQuality !== "LOW" &&
        reliability !== "REDUCED_RELIABILITY"
      ) {
        return {
          entryContext: "FAVORABLE",
          reason:
            "BUY decision is supported by a favorable support-side price location.",
        };
      }

      return {
        entryContext: "CAUTION",
        reason:
          "BUY decision is supported by support-side location, but confirmation quality is limited.",
      };
    }

    if (location === "ABOVE_RESISTANCE") {
      if (
        decisionStrength === "STRONG" &&
        decisionQuality === "HIGH" &&
        reliability === "HIGH_RELIABILITY"
      ) {
        return {
          entryContext: "FAVORABLE",
          reason:
            "Strong high-quality BUY decision is supported by a confirmed break above resistance.",
        };
      }

      return {
        entryContext: "CAUTION",
        reason:
          "Price is above resistance, but breakout confirmation is not strong enough for an unrestricted entry.",
      };
    }
  }

  // ------------------------------------------------------------
  // 6. SELL entry logic.
  // ------------------------------------------------------------
  if (decision === "SELL") {
    if (
      location === "AT_SUPPORT" ||
      location === "NEAR_SUPPORT"
    ) {
      return {
        entryContext: "CAUTION",
        reason:
          "SELL decision is present, but price is close to support.",
      };
    }

    if (location === "ABOVE_RESISTANCE") {
      return {
        entryContext: "CAUTION",
        reason:
          "Price is above resistance, so immediate SELL entry requires caution.",
      };
    }

    if (location === "MID_RANGE") {
      return {
        entryContext: "CAUTION",
        reason:
          "SELL decision is present, but price is in the middle of the trading range.",
      };
    }

    if (
      location === "AT_RESISTANCE" ||
      location === "NEAR_RESISTANCE"
    ) {
      if (
        locationQuality === "FAVORABLE" &&
        decisionQuality !== "LOW" &&
        reliability !== "REDUCED_RELIABILITY"
      ) {
        return {
          entryContext: "FAVORABLE",
          reason:
            "SELL decision is supported by a favorable resistance-side price location.",
        };
      }

      return {
        entryContext: "CAUTION",
        reason:
          "SELL decision is supported by resistance-side location, but confirmation quality is limited.",
      };
    }

    if (location === "BELOW_SUPPORT") {
      if (
        decisionStrength === "STRONG" &&
        decisionQuality === "HIGH" &&
        reliability === "HIGH_RELIABILITY"
      ) {
        return {
          entryContext: "FAVORABLE",
          reason:
            "Strong high-quality SELL decision is supported by a confirmed break below support.",
        };
      }

      return {
        entryContext: "CAUTION",
        reason:
          "Price is below support, but breakdown confirmation is not strong enough for an unrestricted entry.",
      };
    }
  }

  // ------------------------------------------------------------
  // 7. Safety fallback.
  // ------------------------------------------------------------
  return {
    entryContext: "UNFAVORABLE",
    reason:
      "Entry conditions could not be sufficiently confirmed.",
  };
}
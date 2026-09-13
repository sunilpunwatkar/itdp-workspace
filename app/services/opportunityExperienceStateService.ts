export type OpportunityExperienceState =
  | "OPPORTUNITIES_AVAILABLE"
  | "WATCHLIST_ONLY"
  | "NO_OPPORTUNITY";

export interface OpportunityExperienceStateInput {
  tradeCount:
    number;

  watchCount:
    number;
}

export function resolveOpportunityExperienceState(
  input:
    OpportunityExperienceStateInput
): OpportunityExperienceState {
  if (
    !Number.isInteger(
      input.tradeCount
    ) ||
    input.tradeCount < 0
  ) {
    throw new Error(
      "INVALID_TRADE_COUNT"
    );
  }

  if (
    !Number.isInteger(
      input.watchCount
    ) ||
    input.watchCount < 0
  ) {
    throw new Error(
      "INVALID_WATCH_COUNT"
    );
  }

  if (
    input.tradeCount > 0
  ) {
    return "OPPORTUNITIES_AVAILABLE";
  }

  if (
    input.watchCount > 0
  ) {
    return "WATCHLIST_ONLY";
  }

  return "NO_OPPORTUNITY";
}
import type {
  OpportunityDiscoveryInput,
} from "./opportunityDiscoveryService";

import type {
  StockUniverse,
} from "./stockUniverseService";

export interface ParsedOpportunityApiInput {
  stockUniverse:
    StockUniverse;

  discovery:
    OpportunityDiscoveryInput;

  freshnessTtlMs:
    number;
}

export function parseOpportunityApiInput(
  body: unknown
): ParsedOpportunityApiInput {
  if (
    typeof body !== "object" ||
    body === null
  ) {
    throw new Error(
      "INVALID_REQUEST_BODY"
    );
  }

  const input =
    body as Record<
      string,
      unknown
    >;

  const stockUniverse =
    input.stockUniverse;

  if (
    stockUniverse !==
      "ITDP_REAL_5" &&
    stockUniverse !==
      "ITDP_REAL_20" &&
    stockUniverse !==
      "ITDP_REAL_50" &&
    stockUniverse !==
      "ITDP_REAL_100"
  ) {
    throw new Error(
      "INVALID_STOCK_UNIVERSE"
    );
  }

  const capital =
    input.capital;

  if (
    typeof capital !==
      "number" ||
    !Number.isFinite(
      capital
    ) ||
    capital <= 0
  ) {
    throw new Error(
      "INVALID_CAPITAL"
    );
  }

  const horizon =
    input.horizon;

  if (
    horizon !== "SHORT" &&
    horizon !== "MEDIUM"
  ) {
    throw new Error(
      "INVALID_HORIZON"
    );
  }

  const riskProfile =
    input.riskProfile;

  if (
    riskProfile !==
      "CONSERVATIVE" &&
    riskProfile !==
      "BALANCED" &&
    riskProfile !==
      "AGGRESSIVE"
  ) {
    throw new Error(
      "INVALID_RISK_PROFILE"
    );
  }

  const maxResults =
    input.maxResults;

  if (
    typeof maxResults !==
      "number" ||
    !Number.isInteger(
      maxResults
    ) ||
    maxResults <= 0
  ) {
    throw new Error(
      "INVALID_MAX_RESULTS"
    );
  }

  const freshnessTtlMs =
    input.freshnessTtlMs;

  if (
    typeof freshnessTtlMs !==
      "number" ||
    !Number.isFinite(
      freshnessTtlMs
    ) ||
    freshnessTtlMs < 0
  ) {
    throw new Error(
      "INVALID_FRESHNESS_TTL"
    );
  }

  return {
    stockUniverse,

    discovery: {
      capital,

      horizon,

      riskProfile,

      universe:
        "NIFTY_500",

      maxResults,
    },

    freshnessTtlMs,
  };
}
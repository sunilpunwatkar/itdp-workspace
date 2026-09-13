import type {
  OpportunityDiscoveryInput,
} from "./opportunityDiscoveryService";

import type {
  StockUniverse,
} from "./stockUniverseService";

export interface OpportunityScanCacheIdentity {
  stockUniverse:
    StockUniverse;

  discovery:
    OpportunityDiscoveryInput;
}

export function buildOpportunityScanCacheKey(
  input:
    OpportunityScanCacheIdentity
): string {
  const {
    stockUniverse,
    discovery,
  } = input;

  return [
    stockUniverse,
    discovery.universe,
    discovery.horizon,
    discovery.riskProfile,
    discovery.capital,
    discovery.maxResults,
  ].join("|");
}
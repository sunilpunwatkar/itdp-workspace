import {
  buildOpportunityScanCacheKey,
} from "../app/services/opportunityScanCacheKeyService";

import type {
  OpportunityScanCacheIdentity,
} from "../app/services/opportunityScanCacheKeyService";

function assertEqual<T>(
  label: string,
  actual: T,
  expected: T
) {
  if (actual !== expected) {
    throw new Error(
      `${label} FAILED | Expected=${expected} | Actual=${actual}`
    );
  }

  console.log(
    `PASS | ${label} | ${String(actual)}`
  );
}

console.log(
  "=== OPPORTUNITY SCAN CACHE KEY CONTRACT ==="
);

const baseInput:
  OpportunityScanCacheIdentity = {
    stockUniverse:
      "ITDP_REAL_100",

    discovery: {
      capital:
        75_000,

      horizon:
        "SHORT",

      riskProfile:
        "BALANCED",

      universe:
        "NIFTY_500",

      maxResults:
        10,
    },
  };

// ==========================================
// CASE 1
// SAME INPUT = SAME KEY
// ==========================================

const baseKey =
  buildOpportunityScanCacheKey(
    baseInput
  );

const sameKey =
  buildOpportunityScanCacheKey({
    stockUniverse:
      "ITDP_REAL_100",

    discovery: {
      capital:
        75_000,

      horizon:
        "SHORT",

      riskProfile:
        "BALANCED",

      universe:
        "NIFTY_500",

      maxResults:
        10,
    },
  });

assertEqual(
  "Same Input Same Key",
  sameKey,
  baseKey
);

// ==========================================
// CASE 2
// DIFFERENT CAPITAL
// ==========================================

const differentCapitalKey =
  buildOpportunityScanCacheKey({
    ...baseInput,

    discovery: {
      ...baseInput.discovery,

      capital:
        500_000,
    },
  });

assertEqual(
  "Different Capital Different Key",
  differentCapitalKey !==
    baseKey,
  true
);

// ==========================================
// CASE 3
// DIFFERENT HORIZON
// ==========================================

const differentHorizonKey =
  buildOpportunityScanCacheKey({
    ...baseInput,

    discovery: {
      ...baseInput.discovery,

      horizon:
        "MEDIUM",
    },
  });

assertEqual(
  "Different Horizon Different Key",
  differentHorizonKey !==
    baseKey,
  true
);

// ==========================================
// CASE 4
// DIFFERENT RISK PROFILE
// ==========================================

const differentRiskKey =
  buildOpportunityScanCacheKey({
    ...baseInput,

    discovery: {
      ...baseInput.discovery,

      riskProfile:
        "CONSERVATIVE",
    },
  });

assertEqual(
  "Different Risk Profile Different Key",
  differentRiskKey !==
    baseKey,
  true
);

// ==========================================
// CASE 5
// DIFFERENT MAX RESULTS
// ==========================================

const differentMaxResultsKey =
  buildOpportunityScanCacheKey({
    ...baseInput,

    discovery: {
      ...baseInput.discovery,

      maxResults:
        15,
    },
  });

assertEqual(
  "Different Max Results Different Key",
  differentMaxResultsKey !==
    baseKey,
  true
);

// ==========================================
// CASE 6
// DIFFERENT STOCK UNIVERSE
// ==========================================

const differentStockUniverseKey =
  buildOpportunityScanCacheKey({
    ...baseInput,

    stockUniverse:
      "ITDP_REAL_50",
  });

assertEqual(
  "Different Stock Universe Different Key",
  differentStockUniverseKey !==
    baseKey,
  true
);

// ==========================================
// CASE 7
// KEY IS DETERMINISTIC
// ==========================================

assertEqual(
  "Deterministic Base Key",
  baseKey,
  "ITDP_REAL_100|NIFTY_500|SHORT|BALANCED|75000|10"
);

console.log("");

console.log(
  "ALL OPPORTUNITY SCAN CACHE KEY CONTRACT CASES PASS"
);
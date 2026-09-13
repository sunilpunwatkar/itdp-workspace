import {
  parseOpportunityApiInput,
} from "../app/services/opportunityApiInputService";

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

function captureError(
  operation:
    () => unknown
): string | null {
  try {
    operation();

    return null;
  } catch (error) {
    return error instanceof Error
      ? error.message
      : String(error);
  }
}

console.log(
  "=== OPPORTUNITY API INPUT CONTRACT ==="
);

// ==========================================
// CASE 1
// VALID REQUEST
// ==========================================

const valid =
  parseOpportunityApiInput({
    stockUniverse:
      "ITDP_REAL_100",

    capital:
      75_000,

    horizon:
      "SHORT",

    riskProfile:
      "BALANCED",

    maxResults:
      10,

    freshnessTtlMs:
      60_000,
  });

assertEqual(
  "Valid Stock Universe",
  valid.stockUniverse,
  "ITDP_REAL_100"
);

assertEqual(
  "Valid Capital",
  valid.discovery.capital,
  75_000
);

assertEqual(
  "Valid Horizon",
  valid.discovery.horizon,
  "SHORT"
);

assertEqual(
  "Valid Risk Profile",
  valid.discovery.riskProfile,
  "BALANCED"
);

assertEqual(
  "Valid Discovery Universe",
  valid.discovery.universe,
  "NIFTY_500"
);

assertEqual(
  "Valid Max Results",
  valid.discovery.maxResults,
  10
);

assertEqual(
  "Valid Freshness TTL",
  valid.freshnessTtlMs,
  60_000
);

// ==========================================
// CASE 2
// INVALID BODY
// ==========================================

assertEqual(
  "Null Body Error",
  captureError(
    () =>
      parseOpportunityApiInput(
        null
      )
  ),
  "INVALID_REQUEST_BODY"
);

// ==========================================
// CASE 3
// INVALID STOCK UNIVERSE
// ==========================================

assertEqual(
  "Invalid Stock Universe Error",
  captureError(
    () =>
      parseOpportunityApiInput({
        stockUniverse:
          "INVALID",

        capital:
          75_000,

        horizon:
          "SHORT",

        riskProfile:
          "BALANCED",

        maxResults:
          10,

        freshnessTtlMs:
          60_000,
      })
  ),
  "INVALID_STOCK_UNIVERSE"
);

// ==========================================
// CASE 4
// INVALID CAPITAL
// ==========================================

assertEqual(
  "Invalid Capital Error",
  captureError(
    () =>
      parseOpportunityApiInput({
        stockUniverse:
          "ITDP_REAL_100",

        capital:
          0,

        horizon:
          "SHORT",

        riskProfile:
          "BALANCED",

        maxResults:
          10,

        freshnessTtlMs:
          60_000,
      })
  ),
  "INVALID_CAPITAL"
);

// ==========================================
// CASE 5
// INVALID HORIZON
// ==========================================

assertEqual(
  "Invalid Horizon Error",
  captureError(
    () =>
      parseOpportunityApiInput({
        stockUniverse:
          "ITDP_REAL_100",

        capital:
          75_000,

        horizon:
          "LONG",

        riskProfile:
          "BALANCED",

        maxResults:
          10,

        freshnessTtlMs:
          60_000,
      })
  ),
  "INVALID_HORIZON"
);

// ==========================================
// CASE 6
// INVALID RISK PROFILE
// ==========================================

assertEqual(
  "Invalid Risk Profile Error",
  captureError(
    () =>
      parseOpportunityApiInput({
        stockUniverse:
          "ITDP_REAL_100",

        capital:
          75_000,

        horizon:
          "SHORT",

        riskProfile:
          "EXTREME",

        maxResults:
          10,

        freshnessTtlMs:
          60_000,
      })
  ),
  "INVALID_RISK_PROFILE"
);

// ==========================================
// CASE 7
// INVALID MAX RESULTS
// ==========================================

assertEqual(
  "Invalid Max Results Error",
  captureError(
    () =>
      parseOpportunityApiInput({
        stockUniverse:
          "ITDP_REAL_100",

        capital:
          75_000,

        horizon:
          "SHORT",

        riskProfile:
          "BALANCED",

        maxResults:
          0,

        freshnessTtlMs:
          60_000,
      })
  ),
  "INVALID_MAX_RESULTS"
);

// ==========================================
// CASE 8
// INVALID FRESHNESS TTL
// ==========================================

assertEqual(
  "Invalid Freshness TTL Error",
  captureError(
    () =>
      parseOpportunityApiInput({
        stockUniverse:
          "ITDP_REAL_100",

        capital:
          75_000,

        horizon:
          "SHORT",

        riskProfile:
          "BALANCED",

        maxResults:
          10,

        freshnessTtlMs:
          -1,
      })
  ),
  "INVALID_FRESHNESS_TTL"
);

// ==========================================
// CASE 9
// MISSING FIELD
// ==========================================

assertEqual(
  "Missing Capital Error",
  captureError(
    () =>
      parseOpportunityApiInput({
        stockUniverse:
          "ITDP_REAL_100",

        horizon:
          "SHORT",

        riskProfile:
          "BALANCED",

        maxResults:
          10,

        freshnessTtlMs:
          60_000,
      })
  ),
  "INVALID_CAPITAL"
);

console.log("");

console.log(
  "ALL OPPORTUNITY API INPUT CONTRACT CASES PASS"
);
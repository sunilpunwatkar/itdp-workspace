import {
  resolveOpportunityExperienceState,
} from "../app/services/opportunityExperienceStateService";

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
  "=== OPPORTUNITY EXPERIENCE STATE CONTRACT ==="
);

// ==========================================
// CASE 1
// TRADE AVAILABLE
// ==========================================

assertEqual(
  "Trade Available State",
  resolveOpportunityExperienceState({
    tradeCount:
      2,

    watchCount:
      1,
  }),
  "OPPORTUNITIES_AVAILABLE"
);

// ==========================================
// CASE 2
// WATCHLIST ONLY
// ==========================================

assertEqual(
  "Watchlist Only State",
  resolveOpportunityExperienceState({
    tradeCount:
      0,

    watchCount:
      3,
  }),
  "WATCHLIST_ONLY"
);

// ==========================================
// CASE 3
// NO OPPORTUNITY
// ==========================================

assertEqual(
  "No Opportunity State",
  resolveOpportunityExperienceState({
    tradeCount:
      0,

    watchCount:
      0,
  }),
  "NO_OPPORTUNITY"
);

// ==========================================
// CASE 4
// TRADE TAKES PRIORITY OVER WATCHLIST
// ==========================================

assertEqual(
  "Trade Priority State",
  resolveOpportunityExperienceState({
    tradeCount:
      1,

    watchCount:
      5,
  }),
  "OPPORTUNITIES_AVAILABLE"
);

// ==========================================
// CASE 5
// INVALID NEGATIVE TRADE COUNT
// ==========================================

assertEqual(
  "Negative Trade Count Error",
  captureError(
    () =>
      resolveOpportunityExperienceState({
        tradeCount:
          -1,

        watchCount:
          0,
      })
  ),
  "INVALID_TRADE_COUNT"
);

// ==========================================
// CASE 6
// INVALID NON-INTEGER TRADE COUNT
// ==========================================

assertEqual(
  "Non Integer Trade Count Error",
  captureError(
    () =>
      resolveOpportunityExperienceState({
        tradeCount:
          1.5,

        watchCount:
          0,
      })
  ),
  "INVALID_TRADE_COUNT"
);

// ==========================================
// CASE 7
// INVALID NEGATIVE WATCH COUNT
// ==========================================

assertEqual(
  "Negative Watch Count Error",
  captureError(
    () =>
      resolveOpportunityExperienceState({
        tradeCount:
          0,

        watchCount:
          -1,
      })
  ),
  "INVALID_WATCH_COUNT"
);

// ==========================================
// CASE 8
// INVALID NON-INTEGER WATCH COUNT
// ==========================================

assertEqual(
  "Non Integer Watch Count Error",
  captureError(
    () =>
      resolveOpportunityExperienceState({
        tradeCount:
          0,

        watchCount:
          2.5,
      })
  ),
  "INVALID_WATCH_COUNT"
);

console.log("");

console.log(
  "ALL OPPORTUNITY EXPERIENCE STATE CONTRACT CASES PASS"
);
import {
  clearChartHistoricalSnapshotsForTest,
  loadChartHistoricalSnapshot,
  saveChartHistoricalSnapshot,
} from "../app/services/chartHistoricalSnapshotService";

import type {
  HistoricalOHLC,
} from "../app/providers/historicalProvider";

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
  "=== CHART HISTORICAL SNAPSHOT CONTRACT ==="
);

clearChartHistoricalSnapshotsForTest();

const validData:
  HistoricalOHLC = {
    timestamps: [
      1000,
      2000,
      3000,
    ],

    open: [
      100,
      101,
      102,
    ],

    high: [
      102,
      103,
      104,
    ],

    low: [
      99,
      100,
      101,
    ],

    close: [
      101,
      102,
      103,
    ],

    volume: [
      1000,
      1100,
      1200,
    ],
  };

// ==========================================
// CASE 1
// VALID SAVE + LOAD
// ==========================================

saveChartHistoricalSnapshot(
  "RELIANCE.NS",
  10_000,
  validData
);

const loaded =
  loadChartHistoricalSnapshot({
    symbol:
      "RELIANCE.NS",

    now:
      20_000,

    maxAgeMs:
      60_000,
  });

assertEqual(
  "Valid Snapshot Exists",
  loaded !== null,
  true
);

assertEqual(
  "Valid Snapshot Symbol",
  loaded?.symbol,
  "RELIANCE.NS"
);

assertEqual(
  "Valid Snapshot Timestamp",
  loaded?.savedAt,
  10_000
);

assertEqual(
  "Valid Snapshot Candle Count",
  loaded?.data.timestamps.length,
  3
);

assertEqual(
  "Valid Snapshot Last Close",
  loaded?.data.close[2],
  103
);

// ==========================================
// CASE 2
// MISSING SNAPSHOT
// ==========================================

const missing =
  loadChartHistoricalSnapshot({
    symbol:
      "TCS.NS",

    now:
      20_000,

    maxAgeMs:
      60_000,
  });

assertEqual(
  "Missing Snapshot",
  missing,
  null
);

// ==========================================
// CASE 3
// TTL BOUNDARY IS VALID
// ==========================================

const boundary =
  loadChartHistoricalSnapshot({
    symbol:
      "RELIANCE.NS",

    now:
      70_000,

    maxAgeMs:
      60_000,
  });

assertEqual(
  "TTL Boundary Snapshot Exists",
  boundary !== null,
  true
);

// ==========================================
// CASE 4
// TOO OLD SNAPSHOT
// ==========================================

const tooOld =
  loadChartHistoricalSnapshot({
    symbol:
      "RELIANCE.NS",

    now:
      70_001,

    maxAgeMs:
      60_000,
  });

assertEqual(
  "Too Old Snapshot",
  tooOld,
  null
);

// ==========================================
// CASE 5
// FUTURE SNAPSHOT
// ==========================================

const future =
  loadChartHistoricalSnapshot({
    symbol:
      "RELIANCE.NS",

    now:
      9_999,

    maxAgeMs:
      60_000,
  });

assertEqual(
  "Future Snapshot Rejected",
  future,
  null
);

// ==========================================
// CASE 6
// INVALID SAVE SYMBOL
// ==========================================

assertEqual(
  "Invalid Save Symbol Error",
  captureError(
    () =>
      saveChartHistoricalSnapshot(
        "",
        10_000,
        validData
      )
  ),
  "INVALID_SNAPSHOT_SYMBOL"
);

// ==========================================
// CASE 7
// INVALID SAVE TIMESTAMP
// ==========================================

assertEqual(
  "Invalid Save Timestamp Error",
  captureError(
    () =>
      saveChartHistoricalSnapshot(
        "INFY.NS",
        -1,
        validData
      )
  ),
  "INVALID_SNAPSHOT_TIMESTAMP"
);

// ==========================================
// CASE 8
// INVALID LOAD SYMBOL
// ==========================================

assertEqual(
  "Invalid Load Symbol Error",
  captureError(
    () =>
      loadChartHistoricalSnapshot({
        symbol:
          "",

        now:
          20_000,

        maxAgeMs:
          60_000,
      })
  ),
  "INVALID_SNAPSHOT_SYMBOL"
);

// ==========================================
// CASE 9
// INVALID NOW
// ==========================================

assertEqual(
  "Invalid Now Error",
  captureError(
    () =>
      loadChartHistoricalSnapshot({
        symbol:
          "RELIANCE.NS",

        now:
          -1,

        maxAgeMs:
          60_000,
      })
  ),
  "INVALID_SNAPSHOT_NOW"
);

// ==========================================
// CASE 10
// INVALID MAX AGE
// ==========================================

assertEqual(
  "Invalid Max Age Error",
  captureError(
    () =>
      loadChartHistoricalSnapshot({
        symbol:
          "RELIANCE.NS",

        now:
          20_000,

        maxAgeMs:
          -1,
      })
  ),
  "INVALID_SNAPSHOT_MAX_AGE"
);

// ==========================================
// CASE 11
// CORRUPTED / MISMATCHED OHLC
// ==========================================

const invalidData:
  HistoricalOHLC = {
    timestamps: [
      1000,
      2000,
    ],

    open: [
      100,
      101,
    ],

    high: [
      102,
      103,
    ],

    low: [
      99,
      100,
    ],

    close: [
      101,
    ],

    volume: [
      1000,
      1100,
    ],
  };

assertEqual(
  "Mismatched OHLC Error",
  captureError(
    () =>
      saveChartHistoricalSnapshot(
        "BAD.NS",
        10_000,
        invalidData
      )
  ),
  "INVALID_HISTORICAL_SNAPSHOT_DATA"
);

// ==========================================
// CASE 12
// SINGLE SYMBOL CLEAR
// ==========================================

saveChartHistoricalSnapshot(
  "TCS.NS",
  10_000,
  validData
);

clearChartHistoricalSnapshotsForTest(
  "RELIANCE.NS"
);

const relianceAfterClear =
  loadChartHistoricalSnapshot({
    symbol:
      "RELIANCE.NS",

    now:
      20_000,

    maxAgeMs:
      60_000,
  });

const tcsAfterRelianceClear =
  loadChartHistoricalSnapshot({
    symbol:
      "TCS.NS",

    now:
      20_000,

    maxAgeMs:
      60_000,
  });

assertEqual(
  "Single Symbol Clear",
  relianceAfterClear,
  null
);

assertEqual(
  "Other Symbol Preserved",
  tcsAfterRelianceClear !== null,
  true
);

// ==========================================
// CASE 13
// CLEAR ALL
// ==========================================

clearChartHistoricalSnapshotsForTest();

const tcsAfterClearAll =
  loadChartHistoricalSnapshot({
    symbol:
      "TCS.NS",

    now:
      20_000,

    maxAgeMs:
      60_000,
  });

assertEqual(
  "Clear All",
  tcsAfterClearAll,
  null
);

console.log("");

console.log(
  "ALL CHART HISTORICAL SNAPSHOT CONTRACT CASES PASS"
);
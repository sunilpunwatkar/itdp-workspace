import {
  clearScanFreshnessForTest,
  getFreshScan,
  saveSuccessfulScan,
} from "../app/services/scanFreshnessService";

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
  "=== SCAN FRESHNESS CONTRACT ==="
);

clearScanFreshnessForTest();

// ==========================================
// CASE 1
// FRESH SNAPSHOT
// ==========================================

saveSuccessfulScan(
  "ITDP_REAL_100",
  10_000,
  "REAL_100_RESULT"
);

const fresh =
  getFreshScan<string>(
    "ITDP_REAL_100",
    12_000,
    5_000
  );

assertEqual(
  "Fresh Snapshot Exists",
  fresh !== null,
  true
);

assertEqual(
  "Fresh Snapshot Result",
  fresh?.result,
  "REAL_100_RESULT"
);

// ==========================================
// CASE 2
// STALE SNAPSHOT
// ==========================================

const stale =
  getFreshScan<string>(
    "ITDP_REAL_100",
    16_000,
    5_000
  );

assertEqual(
  "Stale Snapshot Rejected",
  stale === null,
  true
);

// ==========================================
// CASE 3
// EXACT TTL BOUNDARY IS STALE
// ==========================================

const boundary =
  getFreshScan<string>(
    "ITDP_REAL_100",
    15_000,
    5_000
  );

assertEqual(
  "TTL Boundary Rejected",
  boundary === null,
  true
);

// ==========================================
// CASE 4
// UNIVERSE ISOLATION
// ==========================================

saveSuccessfulScan(
  "ITDP_REAL_50",
  20_000,
  "REAL_50_RESULT"
);

const real50 =
  getFreshScan<string>(
    "ITDP_REAL_50",
    21_000,
    5_000
  );

const real100AtSameTime =
  getFreshScan<string>(
    "ITDP_REAL_100",
    21_000,
    5_000
  );

assertEqual(
  "REAL 50 Snapshot Result",
  real50?.result,
  "REAL_50_RESULT"
);

assertEqual(
  "REAL 100 Independent Stale",
  real100AtSameTime === null,
  true
);

// ==========================================
// CASE 5
// UNKNOWN UNIVERSE
// ==========================================

const missing =
  getFreshScan<string>(
    "ITDP_UNKNOWN",
    21_000,
    5_000
  );

assertEqual(
  "Missing Snapshot",
  missing === null,
  true
);

// ==========================================
// CASE 6
// FUTURE COMPLETION TIME REJECTED
// ==========================================

saveSuccessfulScan(
  "ITDP_FUTURE_TEST",
  30_000,
  "FUTURE_RESULT"
);

const future =
  getFreshScan<string>(
    "ITDP_FUTURE_TEST",
    29_000,
    5_000
  );

assertEqual(
  "Future Snapshot Rejected",
  future === null,
  true
);

// ==========================================
// CASE 7
// INVALID TTL
// ==========================================

let invalidTtlRejected =
  false;

try {
  getFreshScan(
    "ITDP_REAL_50",
    21_000,
    -1
  );
} catch {
  invalidTtlRejected =
    true;
}

assertEqual(
  "Invalid TTL Rejected",
  invalidTtlRejected,
  true
);

// ==========================================
// CASE 8
// CLEAR ONE UNIVERSE
// ==========================================

clearScanFreshnessForTest(
  "ITDP_REAL_50"
);

const clearedReal50 =
  getFreshScan<string>(
    "ITDP_REAL_50",
    21_000,
    5_000
  );

assertEqual(
  "Single Universe Clear",
  clearedReal50 === null,
  true
);

console.log("");

console.log(
  "ALL SCAN FRESHNESS CONTRACT CASES PASS"
);
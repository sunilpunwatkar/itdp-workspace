import {
  buildScanMetadata,
} from "../app/services/scanMetadataService";

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
  "=== SCAN METADATA CONTRACT TEST ==="
);

// ==========================================
// CASE 1
// VALID METADATA
// ==========================================

const metadata =
  buildScanMetadata({
    scanId:
      "SCAN-001",

    universe:
      "ITDP_REAL_100",

    startedAt:
      1000,

    completedAt:
      4500,

    scannedCount:
      100,

    analyzedCount:
      98,

    failedCount:
      2,
  });

assertEqual(
  "Scan ID",
  metadata.scanId,
  "SCAN-001"
);

assertEqual(
  "Universe",
  metadata.universe,
  "ITDP_REAL_100"
);

assertEqual(
  "Started At",
  metadata.startedAt,
  1000
);

assertEqual(
  "Completed At",
  metadata.completedAt,
  4500
);

assertEqual(
  "Duration",
  metadata.durationMs,
  3500
);

assertEqual(
  "Scanned Count",
  metadata.scannedCount,
  100
);

assertEqual(
  "Analyzed Count",
  metadata.analyzedCount,
  98
);

assertEqual(
  "Failed Count",
  metadata.failedCount,
  2
);

// ==========================================
// CASE 2
// INVALID TIME ORDER
// ==========================================

let invalidTimeRejected =
  false;

let invalidTimeError:
  string | null = null;

try {
  buildScanMetadata({
    scanId:
      "SCAN-INVALID",

    universe:
      "ITDP_REAL_100",

    startedAt:
      5000,

    completedAt:
      4000,

    scannedCount:
      100,

    analyzedCount:
      100,

    failedCount:
      0,
  });
} catch (error) {
  invalidTimeRejected =
    true;

  invalidTimeError =
    error instanceof Error
      ? error.message
      : String(error);
}

assertEqual(
  "Invalid Time Rejected",
  invalidTimeRejected,
  true
);

assertEqual(
  "Invalid Time Error",
  invalidTimeError,
  "Scan completedAt cannot be earlier than startedAt."
);

console.log("");

console.log(
  "ALL SCAN METADATA CONTRACT CASES PASS"
);
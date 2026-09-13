import {
  scanOpportunityUniverse,
} from "../app/services/opportunityScanAccessService";

import {
  clearScanFreshnessForTest,
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

async function run() {
  console.log(
    "=== OPPORTUNITY SCAN ACCESS CONTRACT ==="
  );

  clearScanFreshnessForTest();

  let currentTime =
    10_000;

  let scanSequence =
    0;

  function createScanId() {
    scanSequence += 1;

    return `ACCESS-${scanSequence}`;
  }

  // ==========================================
  // CASE 1
  // FIRST REQUEST = LIVE
  // ==========================================

  const first =
    await scanOpportunityUniverse(
      {
        stockUniverse:
          "ITDP_REAL_5",

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
            5,
        },

        freshnessTtlMs:
          60_000,

        scannerOptions: {
          concurrency:
            1,

          batchSize:
            5,

          batchDelayMs:
            0,
        },
      },
      {
        now:
          () => currentTime,

        createScanId,
      }
    );

  assertEqual(
    "First Source",
    first.source,
    "LIVE"
  );

  assertEqual(
    "First Scan ID",
    first.metadata.scanId,
    "ACCESS-1"
  );

  assertEqual(
    "First Scanned Count",
    first.metadata.scannedCount,
    5
  );

  assertEqual(
    "First Failed Count",
    first.metadata.failedCount,
    first.result.failedCount
  );

  assertEqual(
    "Discovery Universe",
    first.result.discovery.universe,
    "NIFTY_500"
  );

  assertEqual(
    "Discovery Horizon",
    first.result.discovery.horizon,
    "SHORT"
  );

  // ==========================================
  // CASE 2
  // SAME INPUT = CACHE
  // ==========================================

  currentTime =
    11_000;

  const second =
    await scanOpportunityUniverse(
      {
        stockUniverse:
          "ITDP_REAL_5",

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
            5,
        },

        freshnessTtlMs:
          60_000,

        scannerOptions: {
          concurrency:
            1,

          batchSize:
            5,

          batchDelayMs:
            0,
        },
      },
      {
        now:
          () => currentTime,

        createScanId,
      }
    );

  assertEqual(
    "Second Source",
    second.source,
    "CACHE"
  );

  assertEqual(
    "Shared Scan ID",
    second.metadata.scanId,
    first.metadata.scanId
  );

  assertEqual(
    "Cached Scanned Count",
    second.result.scannedCount,
    first.result.scannedCount
  );

  assertEqual(
    "Cached Candidate Count",
    second.result.candidateCount,
    first.result.candidateCount
  );

  assertEqual(
    "Cached Eligible Count",
    second.result.discovery.eligibleCount,
    first.result.discovery.eligibleCount
  );

  // ==========================================
  // CASE 3
  // SAME STOCK UNIVERSE
  // DIFFERENT CAPITAL
  // MUST NOT REUSE CACHE
  // ==========================================

  currentTime =
    11_500;

  const differentCapital =
    await scanOpportunityUniverse(
      {
        stockUniverse:
          "ITDP_REAL_5",

        discovery: {
          capital:
            500_000,

          horizon:
            "SHORT",

          riskProfile:
            "BALANCED",

          universe:
            "NIFTY_500",

          maxResults:
            5,
        },

        freshnessTtlMs:
          60_000,

        scannerOptions: {
          concurrency:
            1,

          batchSize:
            5,

          batchDelayMs:
            0,
        },
      },
      {
        now:
          () => currentTime,

        createScanId,
      }
    );

  assertEqual(
    "Different Capital Source",
    differentCapital.source,
    "LIVE"
  );

  assertEqual(
    "Different Capital Scan ID",
    differentCapital.metadata.scanId,
    "ACCESS-2"
  );

  assertEqual(
    "Different Capital Scanned Count",
    differentCapital.metadata.scannedCount,
    5
  );

  // ==========================================
  // CASE 4
  // DIFFERENT STOCK UNIVERSE
  // MUST RUN INDEPENDENTLY
  // ==========================================

  currentTime =
    12_000;

  const differentUniverse =
    await scanOpportunityUniverse(
      {
        stockUniverse:
          "ITDP_REAL_20",

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
            5,
        },

        freshnessTtlMs:
          60_000,

        scannerOptions: {
          concurrency:
            2,

          batchSize:
            10,

          batchDelayMs:
            0,
        },
      },
      {
        now:
          () => currentTime,

        createScanId,
      }
    );

  assertEqual(
    "Different Universe Source",
    differentUniverse.source,
    "LIVE"
  );

  assertEqual(
    "Different Universe Scan ID",
    differentUniverse.metadata.scanId,
    "ACCESS-3"
  );

  assertEqual(
    "Different Universe Scanned Count",
    differentUniverse.metadata.scannedCount,
    20
  );

  console.log("");

  console.log(
    "ALL OPPORTUNITY SCAN ACCESS CONTRACT CASES PASS"
  );
}

run().catch((error) => {
  console.error("");

  console.error(
    "OPPORTUNITY SCAN ACCESS CONTRACT: FAILED"
  );

  console.error(
    error
  );

  process.exit(1);
});
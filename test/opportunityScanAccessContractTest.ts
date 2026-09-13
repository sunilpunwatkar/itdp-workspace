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

        createScanId:
          () => {
            scanSequence += 1;

            return `ACCESS-${scanSequence}`;
          },
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
  // SECOND REQUEST
  // SAME UNIVERSE + SAME TTL
  // MUST COME FROM CACHE
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

        createScanId:
          () => {
            scanSequence += 1;

            return `ACCESS-${scanSequence}`;
          },
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
  // DIFFERENT STOCK UNIVERSE
  // MUST RUN INDEPENDENTLY
  // ==========================================

  currentTime =
    12_000;

  const different =
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

        createScanId:
          () => {
            scanSequence += 1;

            return `ACCESS-${scanSequence}`;
          },
      }
    );

  assertEqual(
    "Different Universe Source",
    different.source,
    "LIVE"
  );

  assertEqual(
    "Different Universe Scan ID",
    different.metadata.scanId,
    "ACCESS-2"
  );

  assertEqual(
    "Different Universe Scanned Count",
    different.metadata.scannedCount,
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
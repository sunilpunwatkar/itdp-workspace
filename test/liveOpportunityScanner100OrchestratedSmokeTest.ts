import {
  getStockUniverse,
} from "../app/services/stockUniverseService";

import {
  buildOpportunityScannerSources,
} from "../app/services/opportunityScannerSourceFactory";

import {
  scanOpportunities,
  OpportunityScannerResult,
} from "../app/services/opportunityScannerService";

import {
  orchestrateScan,
} from "../app/services/scanOrchestratorService";

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
    "=== LIVE REAL-100 ORCHESTRATED SCANNER SMOKE TEST ==="
  );

  const universe =
    getStockUniverse(
      "ITDP_REAL_100"
    );

  const orchestrationKey =
    "ITDP_REAL_100";

  clearScanFreshnessForTest(
    orchestrationKey
  );

  console.log(
    "Universe Size:",
    universe.symbols.length
  );

  const sources =
    buildOpportunityScannerSources(
      universe.symbols
    );

  let liveScanCalls = 0;

  let scanSequence = 0;

  const executeLiveScan =
    async (): Promise<OpportunityScannerResult> => {
      liveScanCalls += 1;

      return scanOpportunities(
        sources,
        {
          capital: 75000,
          horizon: "SHORT",
          riskProfile: "BALANCED",
          universe: "NIFTY_500",
          maxResults: 15,
        },
        {
          concurrency: 3,
          batchSize: 10,
          batchDelayMs: 1500,
        }
      );
    };

  const buildOrchestratorOptions =
    () => ({
      universe:
        orchestrationKey,

      freshnessTtlMs:
        60_000,

      now:
        () => Date.now(),

      createScanId:
        () => {
          scanSequence += 1;

          return `REAL100-${scanSequence}`;
        },

      scan:
        executeLiveScan,

      getCounts:
        (
          result:
            OpportunityScannerResult
        ) => ({
          scannedCount:
            result.scannedCount,

          analyzedCount:
            result.analyzedCount,

          failedCount:
            result.failedCount,
        }),
    });

  // ==========================================
  // FIRST REQUEST
  // MUST RUN LIVE
  // ==========================================

  const first =
    await orchestrateScan<
      OpportunityScannerResult
    >(
      buildOrchestratorOptions()
    );

  console.log("");
  console.log(
    "=== FIRST ORCHESTRATED RESULT ==="
  );

  console.log({
    source:
      first.source,

    scanId:
      first.metadata.scanId,

    durationMs:
      first.metadata.durationMs,

    scannedCount:
      first.metadata.scannedCount,

    analyzedCount:
      first.metadata.analyzedCount,

    failedCount:
      first.metadata.failedCount,

    candidateCount:
      first.result.candidateCount,

    eligibleCount:
      first.result.discovery.eligibleCount,
  });

  assertEqual(
    "First Source",
    first.source,
    "LIVE"
  );

  assertEqual(
    "First Scanned Count",
    first.metadata.scannedCount,
    100
  );

  assertEqual(
    "First Analyzed Count",
    first.metadata.analyzedCount,
    100
  );

  assertEqual(
    "First Failed Count",
    first.metadata.failedCount,
    0
  );

  assertEqual(
    "Live Scan Calls After First",
    liveScanCalls,
    1
  );

  // ==========================================
  // SECOND REQUEST
  // MUST USE FRESH CACHE
  // ==========================================

  const second =
    await orchestrateScan<
      OpportunityScannerResult
    >(
      buildOrchestratorOptions()
    );

  console.log("");
  console.log(
    "=== SECOND ORCHESTRATED RESULT ==="
  );

  console.log({
    source:
      second.source,

    scanId:
      second.metadata.scanId,

    durationMs:
      second.metadata.durationMs,

    scannedCount:
      second.metadata.scannedCount,

    analyzedCount:
      second.metadata.analyzedCount,

    failedCount:
      second.metadata.failedCount,

    candidateCount:
      second.result.candidateCount,

    eligibleCount:
      second.result.discovery.eligibleCount,
  });

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
    "Live Scan Calls After Cache",
    liveScanCalls,
    1
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

  console.log("");
  console.log(
    "=== TOP OPPORTUNITIES ==="
  );

  console.log(
    second.result.discovery.opportunities.map(
      (item) => ({
        symbol:
          item.symbol,

        decision:
          item.decision,

        score:
          item.opportunityScore,

        classification:
          item.classification,

        riskGate:
          item.riskGateStatus,
      })
    )
  );

  console.log("");

  console.log(
    "LIVE REAL-100 ORCHESTRATED SCANNER: PASSED"
  );
}

run().catch((error) => {
  console.error("");

  console.error(
    "LIVE REAL-100 ORCHESTRATED SCANNER: FAILED"
  );

  console.error(
    error
  );

  process.exit(1);
});
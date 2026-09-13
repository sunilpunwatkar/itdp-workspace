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

interface ControlledScanResult {
  scannedCount: number;
  analyzedCount: number;
  failedCount: number;
  value: string;
}

async function run() {
  console.log(
    "=== SCAN ORCHESTRATOR CONTRACT ==="
  );

  clearScanFreshnessForTest();

  // ==========================================
  // CASE 1
  // FIRST REQUEST RUNS LIVE
  // ==========================================

  let liveCalls = 0;

  let currentTime =
    10_000;

  let scanSequence = 0;

  const first =
    await orchestrateScan<ControlledScanResult>({
      universe:
        "ITDP_REAL_100",

      freshnessTtlMs:
        5_000,

      now: () =>
        currentTime,

      createScanId: () => {
        scanSequence += 1;

        return `SCAN-${scanSequence}`;
      },

      scan: async () => {
        liveCalls += 1;

        currentTime =
          12_000;

        return {
          scannedCount: 100,
          analyzedCount: 100,
          failedCount: 0,
          value:
            "FIRST_LIVE_RESULT",
        };
      },

      getCounts: (result) => ({
        scannedCount:
          result.scannedCount,

        analyzedCount:
          result.analyzedCount,

        failedCount:
          result.failedCount,
      }),
    });

  assertEqual(
    "First Source",
    first.source,
    "LIVE"
  );

  assertEqual(
    "First Scan ID",
    first.metadata.scanId,
    "SCAN-1"
  );

  assertEqual(
    "First Duration",
    first.metadata.durationMs,
    2000
  );

  assertEqual(
    "First Live Call Count",
    liveCalls,
    1
  );

  // ==========================================
  // CASE 2
  // FRESH REQUEST USES CACHE
  // ==========================================

  currentTime =
    14_000;

  const cached =
    await orchestrateScan<ControlledScanResult>({
      universe:
        "ITDP_REAL_100",

      freshnessTtlMs:
        5_000,

      now: () =>
        currentTime,

      createScanId: () => {
        scanSequence += 1;

        return `SCAN-${scanSequence}`;
      },

      scan: async () => {
        liveCalls += 1;

        return {
          scannedCount: 100,
          analyzedCount: 100,
          failedCount: 0,
          value:
            "SHOULD_NOT_RUN",
        };
      },

      getCounts: (result) => ({
        scannedCount:
          result.scannedCount,

        analyzedCount:
          result.analyzedCount,

        failedCount:
          result.failedCount,
      }),
    });

  assertEqual(
    "Fresh Source",
    cached.source,
    "CACHE"
  );

  assertEqual(
    "Cached Scan ID",
    cached.metadata.scanId,
    "SCAN-1"
  );

  assertEqual(
    "Cached Result",
    cached.result.value,
    "FIRST_LIVE_RESULT"
  );

  assertEqual(
    "Fresh Cache Live Call Count",
    liveCalls,
    1
  );

  // ==========================================
  // CASE 3
  // STALE REQUEST RUNS LIVE AGAIN
  // ==========================================

  currentTime =
    17_000;

  const staleRefresh =
    await orchestrateScan<ControlledScanResult>({
      universe:
        "ITDP_REAL_100",

      freshnessTtlMs:
        5_000,

      now: () =>
        currentTime,

      createScanId: () => {
        scanSequence += 1;

        return `SCAN-${scanSequence}`;
      },

      scan: async () => {
        liveCalls += 1;

        currentTime =
          18_000;

        return {
          scannedCount: 100,
          analyzedCount: 99,
          failedCount: 1,
          value:
            "SECOND_LIVE_RESULT",
        };
      },

      getCounts: (result) => ({
        scannedCount:
          result.scannedCount,

        analyzedCount:
          result.analyzedCount,

        failedCount:
          result.failedCount,
      }),
    });

  assertEqual(
    "Stale Refresh Source",
    staleRefresh.source,
    "LIVE"
  );

  assertEqual(
    "Stale Refresh Scan ID",
    staleRefresh.metadata.scanId,
    "SCAN-2"
  );

  assertEqual(
    "Stale Refresh Live Count",
    liveCalls,
    2
  );

  assertEqual(
    "Stale Refresh Failed Count",
    staleRefresh.metadata.failedCount,
    1
  );

  // ==========================================
  // CASE 4
  // SAME UNIVERSE CONCURRENT REQUESTS SHARE
  // ==========================================

  clearScanFreshnessForTest(
    "ITDP_CONCURRENT"
  );

  let concurrentCalls = 0;

  let concurrentTime =
    30_000;

  let releaseScan:
    () => void =
      () => {};

  const gate =
    new Promise<void>(
      (resolve) => {
        releaseScan =
          resolve;
      }
    );

  let concurrentSequence = 0;

  const concurrentOptions = {
    universe:
      "ITDP_CONCURRENT",

    freshnessTtlMs:
      5_000,

    now: () =>
      concurrentTime,

    createScanId: () => {
      concurrentSequence += 1;

      return `CONCURRENT-${concurrentSequence}`;
    },

    scan: async () => {
      concurrentCalls += 1;

      await gate;

      concurrentTime =
        31_000;

      return {
        scannedCount: 100,
        analyzedCount: 100,
        failedCount: 0,
        value:
          "SHARED_RESULT",
      };
    },

    getCounts:
      (
        result: ControlledScanResult
      ) => ({
        scannedCount:
          result.scannedCount,

        analyzedCount:
          result.analyzedCount,

        failedCount:
          result.failedCount,
      }),
  };

  const concurrentFirst =
    orchestrateScan<ControlledScanResult>(
      concurrentOptions
    );

  const concurrentSecond =
    orchestrateScan<ControlledScanResult>(
      concurrentOptions
    );

  assertEqual(
    "Concurrent Live Call Before Release",
    concurrentCalls,
    1
  );

  releaseScan();

  const [
    concurrentResult1,
    concurrentResult2,
  ] =
    await Promise.all([
      concurrentFirst,
      concurrentSecond,
    ]);

  assertEqual(
    "Concurrent Live Call Count",
    concurrentCalls,
    1
  );

  assertEqual(
    "Concurrent First Result",
    concurrentResult1.result.value,
    "SHARED_RESULT"
  );

  assertEqual(
    "Concurrent Second Result",
    concurrentResult2.result.value,
    "SHARED_RESULT"
  );

  assertEqual(
    "Concurrent Shared Scan ID",
    concurrentResult1.metadata.scanId,
    concurrentResult2.metadata.scanId
  );

  // ==========================================
  // CASE 5
  // FAILED SCAN IS NOT CACHED
  // ==========================================

  clearScanFreshnessForTest(
    "ITDP_FAILURE"
  );

  let failureCalls = 0;

  let failureTime =
    40_000;

  let failureSequence = 0;

  try {
    await orchestrateScan<ControlledScanResult>({
      universe:
        "ITDP_FAILURE",

      freshnessTtlMs:
        5_000,

      now: () =>
        failureTime,

      createScanId: () => {
        failureSequence += 1;

        return `FAIL-${failureSequence}`;
      },

      scan: async () => {
        failureCalls += 1;

        throw new Error(
          "CONTROLLED_SCAN_FAILURE"
        );
      },

      getCounts: (result) => ({
        scannedCount:
          result.scannedCount,

        analyzedCount:
          result.analyzedCount,

        failedCount:
          result.failedCount,
      }),
    });
  } catch {
    // Expected.
  }

  failureTime =
    41_000;

  const recovery =
    await orchestrateScan<ControlledScanResult>({
      universe:
        "ITDP_FAILURE",

      freshnessTtlMs:
        5_000,

      now: () =>
        failureTime,

      createScanId: () => {
        failureSequence += 1;

        return `FAIL-${failureSequence}`;
      },

      scan: async () => {
        failureCalls += 1;

        failureTime =
          42_000;

        return {
          scannedCount: 100,
          analyzedCount: 100,
          failedCount: 0,
          value:
            "RECOVERED",
        };
      },

      getCounts: (result) => ({
        scannedCount:
          result.scannedCount,

        analyzedCount:
          result.analyzedCount,

        failedCount:
          result.failedCount,
      }),
    });

  assertEqual(
    "Failure Operation Count",
    failureCalls,
    2
  );

  assertEqual(
    "Failure Recovery Source",
    recovery.source,
    "LIVE"
  );

  assertEqual(
    "Failure Recovery Result",
    recovery.result.value,
    "RECOVERED"
  );

  console.log("");

  console.log(
    "ALL SCAN ORCHESTRATOR CONTRACT CASES PASS"
  );
}

run().catch((error) => {
  console.error("");

  console.error(
    "SCAN ORCHESTRATOR CONTRACT: FAILED"
  );

  console.error(error);

  process.exit(1);
});
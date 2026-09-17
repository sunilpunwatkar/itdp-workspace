import {
  seedHistoricalCacheForTest,
  clearHistoricalCacheForTest,
  getCachedHistoricalOHLC,
} from "../app/services/historicalDataCache";

// ==========================================
// TEST CONSTANTS
// ==========================================

const SYMBOL =
  "TEST.BOUNDED.STALE";

const MINUTE =
  60 * 1000;

const HOUR =
  60 * MINUTE;

const DAY =
  24 * HOUR;

const MAX_STALE_AGE =
  7 * DAY;

// ==========================================
// CONTROLLED HISTORICAL DATA
// ==========================================

const historicalData = {
  timestamps: Array.from(
    { length: 250 },
    (_, i) =>
      1_700_000_000 +
      i * 86_400
  ),

  open: Array.from(
    { length: 250 },
    (_, i) =>
      100 + i
  ),

  high: Array.from(
    { length: 250 },
    (_, i) =>
      105 + i
  ),

  low: Array.from(
    { length: 250 },
    (_, i) =>
      95 + i
  ),

  close: Array.from(
    { length: 250 },
    (_, i) =>
      102 + i
  ),

  volume: Array.from(
    { length: 250 },
    (_, i) =>
      1_000_000 + i
  ),
};

// ==========================================
// ASSERT HELPERS
// ==========================================

function assert(
  condition: boolean,
  message: string
) {
  if (!condition) {
    throw new Error(
      `ASSERTION FAILED: ${message}`
    );
  }
}

function sameHistoricalData(
  actual: unknown
): boolean {
  return (
    JSON.stringify(actual) ===
    JSON.stringify(historicalData)
  );
}

// ==========================================
// CONTROLLED PROVIDER FAILURE
// ==========================================

const originalFetch =
  globalThis.fetch;

function installControlledFailure() {
  globalThis.fetch =
    async () =>
      new Response(
        "Controlled Yahoo failure",
        {
          status: 404,
          statusText:
            "Not Found",
        }
      );
}

function restoreFetch() {
  globalThis.fetch =
    originalFetch;
}

// ==========================================
// TEST RUNNER
// ==========================================

async function runTest() {
  console.log(
    "=== HISTORICAL DATA CACHE BOUNDED FALLBACK CONTRACT ==="
  );

  let passed = 0;
  let failed = 0;

  installControlledFailure();

  try {
    // ======================================
    // TEST 1
    // FRESH CACHE (< 15 MIN)
    // ======================================

    clearHistoricalCacheForTest(
      SYMBOL
    );

    seedHistoricalCacheForTest(
      SYMBOL,
      historicalData,
      Date.now() -
        (10 * MINUTE)
    );

    try {
      const result =
        await getCachedHistoricalOHLC(
          SYMBOL
        );

      assert(
        sameHistoricalData(result),
        "Fresh cache must be returned"
      );

      console.log(
        "TEST 1: Fresh cache accepted: PASS"
      );

      passed++;
    } catch (error) {
      console.error(
        "TEST 1: Fresh cache accepted: FAIL",
        error
      );

      failed++;
    }

    // ======================================
    // TEST 2
    // 16 MIN STALE + PROVIDER FAILURE
    // ======================================

    clearHistoricalCacheForTest(
      SYMBOL
    );

    seedHistoricalCacheForTest(
      SYMBOL,
      historicalData,
      Date.now() -
        (16 * MINUTE)
    );

    try {
      const result =
        await getCachedHistoricalOHLC(
          SYMBOL
        );

      assert(
        sameHistoricalData(result),
        "16-minute stale cache must remain available during provider failure"
      );

      console.log(
        "TEST 2: 16-minute stale fallback accepted: PASS"
      );

      passed++;
    } catch (error) {
      console.error(
        "TEST 2: 16-minute stale fallback accepted: FAIL",
        error
      );

      failed++;
    }

    // ======================================
    // TEST 3
    // 1 HOUR STALE + PROVIDER FAILURE
    // ======================================

    clearHistoricalCacheForTest(
      SYMBOL
    );

    seedHistoricalCacheForTest(
      SYMBOL,
      historicalData,
      Date.now() -
        HOUR
    );

    try {
      const result =
        await getCachedHistoricalOHLC(
          SYMBOL
        );

      assert(
        sameHistoricalData(result),
        "1-hour stale cache must remain available during provider failure"
      );

      console.log(
        "TEST 3: 1-hour stale fallback accepted: PASS"
      );

      passed++;
    } catch (error) {
      console.error(
        "TEST 3: 1-hour stale fallback accepted: FAIL",
        error
      );

      failed++;
    }

    // ======================================
    // TEST 4
    // EXACT 7-DAY BOUNDARY
    // ======================================

    clearHistoricalCacheForTest(
      SYMBOL
    );

    seedHistoricalCacheForTest(
      SYMBOL,
      historicalData,
      Date.now() -
        MAX_STALE_AGE
    );

    try {
      const result =
        await getCachedHistoricalOHLC(
          SYMBOL
        );

      assert(
        sameHistoricalData(result),
        "7-day boundary cache must remain available during provider failure"
      );

      console.log(
        "TEST 4: 7-day boundary fallback accepted: PASS"
      );

      passed++;
    } catch (error) {
      console.error(
        "TEST 4: 7-day boundary fallback accepted: FAIL",
        error
      );

      failed++;
    }

    // ======================================
    // TEST 5
    // OLDER THAN 7 DAYS MUST BE REJECTED
    // ======================================

    clearHistoricalCacheForTest(
      SYMBOL
    );

    seedHistoricalCacheForTest(
      SYMBOL,
      historicalData,
      Date.now() -
        MAX_STALE_AGE -
        MINUTE
    );

    try {
      await getCachedHistoricalOHLC(
        SYMBOL
      );

      console.error(
        "TEST 5: Too-old stale cache rejected: FAIL"
      );

      failed++;
    } catch {
      console.log(
        "TEST 5: Too-old stale cache rejected: PASS"
      );

      passed++;
    }

    // ======================================
    // TEST 6
    // FUTURE-DATED CACHE MUST BE REJECTED
    // ======================================

    clearHistoricalCacheForTest(
      SYMBOL
    );

    seedHistoricalCacheForTest(
      SYMBOL,
      historicalData,
      Date.now() +
        HOUR
    );

    try {
      await getCachedHistoricalOHLC(
        SYMBOL
      );

      console.error(
        "TEST 6: Future-dated cache rejected: FAIL"
      );

      failed++;
    } catch {
      console.log(
        "TEST 6: Future-dated cache rejected: PASS"
      );

      passed++;
    }

    // ======================================
    // TEST 7
    // NO CACHE + PROVIDER FAILURE
    // ======================================

    clearHistoricalCacheForTest(
      SYMBOL
    );

    try {
      await getCachedHistoricalOHLC(
        SYMBOL
      );

      console.error(
        "TEST 7: No-cache provider failure propagated: FAIL"
      );

      failed++;
    } catch {
      console.log(
        "TEST 7: No-cache provider failure propagated: PASS"
      );

      passed++;
    }
  } finally {
    restoreFetch();

    clearHistoricalCacheForTest(
      SYMBOL
    );
  }

  // ==========================================
  // FINAL RESULT
  // ==========================================

  console.log(
    "=== FINAL CHECK ==="
  );

  console.log({
    totalTests:
      passed + failed,

    passed,

    failed,

    allPassed:
      failed === 0,
  });

  if (failed > 0) {
    process.exit(1);
  }
}

runTest().catch(
  (error) => {
    restoreFetch();

    clearHistoricalCacheForTest(
      SYMBOL
    );

    console.error(
      "HISTORICAL CACHE CONTRACT ERROR:",
      error
    );

    process.exit(1);
  }
);
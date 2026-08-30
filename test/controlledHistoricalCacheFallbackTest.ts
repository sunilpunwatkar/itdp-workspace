import {
  getCachedHistoricalOHLC,
  seedHistoricalCacheForTest,
  clearHistoricalCacheForTest,
} from "../app/services/historicalDataCache";

const symbol = "TEST.STALE";

const testData = {
  timestamps: [1, 2, 3],
  open: [100, 101, 102],
  high: [105, 106, 107],
  low: [98, 99, 100],
  close: [103, 104, 106],
  volume: [1000, 1100, 1200],
};

async function runTest() {

  console.log(
    "=== CONTROLLED HISTORICAL CACHE FALLBACK TEST ==="
  );

  // =====================================
  // TEST 1: Seed stale cache
  // =====================================

  seedHistoricalCacheForTest(
    symbol,
    testData,
    Date.now() - (16 * 60 * 1000)
  );

  console.log(
    "TEST 1: Stale cache seeded: PASS"
  );

  // =====================================
  // TEST 2: Request data
  // =====================================

  try {

    const result =
      await getCachedHistoricalOHLC(symbol);

    const sameData =
      JSON.stringify(result) ===
      JSON.stringify(testData);

    console.log(
      `TEST 2: Stale cache fallback: ${
        sameData ? "PASS" : "FAIL"
      }`
    );

    if (!sameData) {
      console.log(
        "Expected:",
        testData
      );

      console.log(
        "Actual:",
        result
      );
    }

  } catch (error) {

    console.log(
      "TEST 2: Stale cache fallback: FAIL"
    );

    console.error(error);
  }

  // =====================================
  // CLEANUP
  // =====================================

  clearHistoricalCacheForTest(symbol);

  console.log(
    "=== FINAL CHECK ==="
  );
}

runTest().catch((error) => {

  console.error(
    "TEST RUNNER ERROR:",
    error
  );

  process.exit(1);
});
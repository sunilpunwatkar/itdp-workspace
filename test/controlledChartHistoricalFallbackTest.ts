import {
  getCachedHistoricalOHLC,
  seedHistoricalCacheForTest,
  clearHistoricalCacheForTest,
} from "../app/services/historicalDataCache";

import {
  getChartData,
  clearChartCacheForTest,
} from "../app/services/chartDataService";

const symbol = "TEST.STALE";

const testData = {
  timestamps: Array.from(
    { length: 201 },
    (_, i) => 1000000000 + i * 86400
  ),

  open: Array.from(
    { length: 201 },
    (_, i) => 100 + i
  ),

  high: Array.from(
    { length: 201 },
    (_, i) => 105 + i
  ),

  low: Array.from(
    { length: 201 },
    (_, i) => 98 + i
  ),

  close: Array.from(
    { length: 201 },
    (_, i) => 103 + i
  ),

  volume: Array.from(
    { length: 201 },
    (_, i) => 1000 + i * 10
  ),
};

async function runTest() {

  console.log(
    "=== CONTROLLED CHART HISTORICAL FALLBACK TEST ==="
  );

  // =====================================
  // CLEAN START
  // =====================================

  clearHistoricalCacheForTest(symbol);
  clearChartCacheForTest(symbol);

  // =====================================
  // TEST 1: Seed stale historical cache
  // =====================================

  seedHistoricalCacheForTest(
    symbol,
    testData,
    Date.now() - (16 * 60 * 1000)
  );

  console.log(
    "TEST 1: Stale historical cache seeded: PASS"
  );

  // =====================================
  // TEST 2: Verify stale cache fallback
  // =====================================

  let historicalData;

  try {

    historicalData =
      await getCachedHistoricalOHLC(symbol);

    const sameData =
      JSON.stringify(historicalData) ===
      JSON.stringify(testData);

    console.log(
      "TEST 2: Historical stale fallback: " +
      (sameData ? "PASS" : "FAIL")
    );

    if (!sameData) {

      console.log(
        "Expected:",
        testData
      );

      console.log(
        "Actual:",
        historicalData
      );

      process.exit(1);
    }

  } catch (error) {

    console.error(
      "TEST 2: Historical stale fallback: FAIL",
      error
    );

    process.exit(1);
  }

  // =====================================
  // TEST 3: Chart builds from fallback
  // =====================================

  try {

    clearChartCacheForTest(symbol);

    const chartData =
      await getChartData(symbol);

    const candlesAvailable =
      chartData.length === 201;

    console.log(
      "TEST 3: Chart Data from fallback: " +
      (candlesAvailable ? "PASS" : "FAIL")
    );

    if (!candlesAvailable) {

      console.log(
        "Expected candles:",
        201
      );

      console.log(
        "Actual candles:",
        chartData.length
      );

      process.exit(1);
    }

    // =================================
    // TEST 4: Latest candle valid
    // =================================

    const latest =
      chartData[chartData.length - 1];

    const latestValid =
      latest.close === 303 &&
      latest.open === 300 &&
      latest.high === 305 &&
      latest.low === 298;

    console.log(
      "TEST 4: Latest Candle Valid: " +
      (latestValid ? "PASS" : "FAIL")
    );

    if (!latestValid) {

      console.log(
        "Latest Candle:",
        latest
      );

      process.exit(1);
    }

    // =================================
    // TEST 5: Indicators available
    // =================================

    const latestIndicators =
      latest.ema20 !== undefined &&
      latest.ema50 !== undefined &&
      latest.ema200 !== undefined &&
      latest.rsi !== undefined;

    console.log(
      "TEST 5: Indicators Pipeline: " +
      (latestIndicators ? "PASS" : "FAIL")
    );

    if (!latestIndicators) {

      console.log(
        "Latest Indicators:",
        {
          ema20: latest.ema20,
          ema50: latest.ema50,
          ema200: latest.ema200,
          rsi: latest.rsi,
        }
      );

      process.exit(1);
    }

    // =================================
    // FINAL DATA
    // =================================

    console.log(
      "Chart candles:",
      chartData.length
    );

    console.log(
      "Latest close:",
      latest.close
    );

  } catch (error) {

    console.error(
      "Chart fallback pipeline failed:",
      error
    );

    process.exit(1);
  }

  // =====================================
  // CLEANUP
  // =====================================

  clearChartCacheForTest(symbol);
  clearHistoricalCacheForTest(symbol);

  console.log(
    "=== FINAL CHECK ==="
  );

  console.log({
    totalTests: 5,
    passed: 5,
    failed: 0,
    allPassed: true,
  });
}

runTest().catch((error) => {

  console.error(
    "TEST RUNNER ERROR:",
    error
  );

  process.exit(1);
});


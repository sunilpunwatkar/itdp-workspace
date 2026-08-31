import {
  getChartData,
  clearChartCacheForTest,
} from "../app/services/chartDataService";

const symbol = "RELIANCE";

async function runTest() {

  console.log(
    "=== CONTROLLED CHART IN-FLIGHT TEST ==="
  );

  // =====================================
  // CLEAN START
  // =====================================

  clearChartCacheForTest(symbol);

  // =====================================
  // TEST 1: Three concurrent requests
  // =====================================

  console.log(
    "TEST 1: Starting 3 concurrent chart requests..."
  );

  const start =
    Date.now();

  const results =
    await Promise.all([
      getChartData(symbol),
      getChartData(symbol),
      getChartData(symbol),
    ]);

  const totalTime =
    Date.now() - start;

  // =====================================
  // TEST 1 VALIDATION
  // =====================================

  const allArrays =
    results.every(
      (result) =>
        Array.isArray(result) &&
        result.length > 0
    );

  console.log(
    `TEST 1: All concurrent requests returned data: ${
      allArrays ? "PASS" : "FAIL"
    }`
  );

  // =====================================
  // TEST 2: Same candle count
  // =====================================

  const sameLength =
    results[0].length ===
    results[1].length &&
    results[1].length ===
    results[2].length;

  console.log(
    `TEST 2: Same candle count: ${
      sameLength ? "PASS" : "FAIL"
    }`
  );

  // =====================================
  // TEST 3: Same latest close
  // =====================================

  const latestClose1 =
    results[0][results[0].length - 1]?.close;

  const latestClose2 =
    results[1][results[1].length - 1]?.close;

  const latestClose3 =
    results[2][results[2].length - 1]?.close;

  const sameLatestClose =
    latestClose1 ===
    latestClose2 &&
    latestClose2 ===
    latestClose3;

  console.log(
    `TEST 3: Same latest close: ${
      sameLatestClose ? "PASS" : "FAIL"
    }`
  );

  // =====================================
  // TEST 4: Same latest candle
  // =====================================

  const latestCandle1 =
    results[0][results[0].length - 1];

  const latestCandle2 =
    results[1][results[1].length - 1];

  const latestCandle3 =
    results[2][results[2].length - 1];

  const sameLatestCandle =
    JSON.stringify(latestCandle1) ===
      JSON.stringify(latestCandle2) &&
    JSON.stringify(latestCandle2) ===
      JSON.stringify(latestCandle3);

  console.log(
    `TEST 4: Same latest candle: ${
      sameLatestCandle ? "PASS" : "FAIL"
    }`
  );

  // =====================================
  // RESULTS
  // =====================================

  console.log(
    "Total concurrent request time:",
    `${totalTime} ms`
  );

  console.log(
    "Candles:",
    results.map(
      (result) => result.length
    )
  );

  console.log(
    "Latest closes:",
    [
      latestClose1,
      latestClose2,
      latestClose3,
    ]
  );

  // =====================================
  // FINAL CHECK
  // =====================================

  const allPassed =
    allArrays &&
    sameLength &&
    sameLatestClose &&
    sameLatestCandle;

  console.log(
    "=== FINAL CHECK ==="
  );

  console.log({
    totalTests: 4,
    passed: allPassed ? 4 : 0,
    failed: allPassed ? 0 : 4,
    allPassed,
  });

  // =====================================
  // CLEANUP
  // =====================================

  clearChartCacheForTest(symbol);

  if (!allPassed) {
    process.exit(1);
  }
}

runTest().catch((error) => {

  console.error(
    "TEST RUNNER ERROR:",
    error
  );

  process.exit(1);
});
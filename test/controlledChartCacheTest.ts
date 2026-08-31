import {
  getChartData,
  clearChartCacheForTest,
} from "../app/services/chartDataService";

const symbol = "RELIANCE";

async function runTest() {

  console.log(
    "=== CONTROLLED CHART CACHE TEST ==="
  );

  // =====================================
  // CLEAN START
  // =====================================

  clearChartCacheForTest(symbol);

  // =====================================
  // TEST 1: First request
  // =====================================

  console.log(
    "TEST 1: First chart request..."
  );

  const firstStart = Date.now();

  const firstData =
    await getChartData(symbol);

  const firstTime =
    Date.now() - firstStart;

  const firstValid =
    Array.isArray(firstData) &&
    firstData.length > 0;

  console.log(
    `TEST 1: First Chart Data: ${
      firstValid ? "PASS" : "FAIL"
    }`
  );

  console.log(
    "First request time:",
    `${firstTime} ms`
  );

  if (!firstValid) {
    throw new Error(
      "First chart request returned invalid data"
    );
  }

  // =====================================
  // TEST 2: Second request
  // =====================================

  console.log(
    "TEST 2: Second chart request..."
  );

  const secondStart = Date.now();

  const secondData =
    await getChartData(symbol);

  const secondTime =
    Date.now() - secondStart;

  const secondValid =
    Array.isArray(secondData) &&
    secondData.length > 0;

  console.log(
    `TEST 2: Second Chart Data: ${
      secondValid ? "PASS" : "FAIL"
    }`
  );

  console.log(
    "Second request time:",
    `${secondTime} ms`
  );

  // =====================================
  // TEST 3: CACHE HIT BEHAVIOR
  // =====================================

  const sameLength =
    firstData.length ===
    secondData.length;

  const sameLatestClose =
    firstData[firstData.length - 1]?.close ===
    secondData[secondData.length - 1]?.close;

  const cacheBehaviorValid =
    secondValid &&
    sameLength &&
    sameLatestClose &&
    secondTime < firstTime;

  console.log(
    `TEST 3: Chart Cache HIT Behavior: ${
      cacheBehaviorValid ? "PASS" : "FAIL"
    }`
  );

  // =====================================
  // FINAL DATA
  // =====================================

  console.log(
    "First candles:",
    firstData.length
  );

  console.log(
    "Second candles:",
    secondData.length
  );

  console.log(
    "Latest close:",
    secondData[
      secondData.length - 1
    ]?.close
  );

  // =====================================
  // CLEANUP
  // =====================================

  clearChartCacheForTest(symbol);

  console.log(
    "=== FINAL CHECK ==="
  );

  console.log({
    firstDataValid: firstValid,
    secondDataValid: secondValid,
    sameLength,
    sameLatestClose,
    cacheBehaviorValid,
  });

  if (!cacheBehaviorValid) {
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
import { buildTradePlan } from "../app/services/tradePlannerService";

function check(
  name: string,
  actual: string,
  expected: string
) {
  const pass = actual === expected;

  console.log(
    `${name}: ${pass ? "PASS" : "FAIL"}`
  );

  if (!pass) {
    console.log(
      `  Expected: ${expected}`
    );

    console.log(
      `  Actual:   ${actual}`
    );
  }

  return pass;
}

console.log(
  "=== TRADE QUALITY V2 TEST ==="
);

let passed = 0;
let failed = 0;

// TEST 1
if (
  check(
    "TEST 1: BUY 90 + FAVORABLE",
    buildTradePlan(
      "BUY",
      90,
      "FAVORABLE"
    ).tradeQuality,
    "A+"
  )
) passed++;
else failed++;

// TEST 2
if (
  check(
    "TEST 2: BUY 75 + FAVORABLE",
    buildTradePlan(
      "BUY",
      75,
      "FAVORABLE"
    ).tradeQuality,
    "A"
  )
) passed++;
else failed++;

// TEST 3
if (
  check(
    "TEST 3: BUY 90 + CAUTION",
    buildTradePlan(
      "BUY",
      90,
      "CAUTION"
    ).tradeQuality,
    "A"
  )
) passed++;
else failed++;

// TEST 4
if (
  check(
    "TEST 4: BUY 75 + CAUTION",
    buildTradePlan(
      "BUY",
      75,
      "CAUTION"
    ).tradeQuality,
    "B"
  )
) passed++;
else failed++;

// TEST 5
if (
  check(
    "TEST 5: BUY 50 + CAUTION",
    buildTradePlan(
      "BUY",
      50,
      "CAUTION"
    ).tradeQuality,
    "B"
  )
) passed++;
else failed++;

// TEST 6
if (
  check(
    "TEST 6: BUY 90 + UNFAVORABLE",
    buildTradePlan(
      "BUY",
      90,
      "UNFAVORABLE"
    ).tradeQuality,
    "NO TRADE"
  )
) passed++;
else failed++;

// TEST 7
if (
  check(
    "TEST 7: SELL 85 + FAVORABLE",
    buildTradePlan(
      "SELL",
      85,
      "FAVORABLE"
    ).tradeQuality,
    "A+"
  )
) passed++;
else failed++;

// TEST 8
if (
  check(
    "TEST 8: SELL 70 + CAUTION",
    buildTradePlan(
      "SELL",
      70,
      "CAUTION"
    ).tradeQuality,
    "B"
  )
) passed++;
else failed++;

// TEST 9
if (
  check(
    "TEST 9: HOLD",
    buildTradePlan(
      "HOLD",
      90,
      "UNFAVORABLE"
    ).tradeQuality,
    "NO TRADE"
  )
) passed++;
else failed++;

console.log(
  "=== FINAL CHECK ==="
);

console.log({
  totalTests: passed + failed,
  passed,
  failed,
  allPassed: failed === 0,
});
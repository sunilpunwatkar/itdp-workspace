import {
  calculateConflictEngine,
} from "../app/services/conflictEngineService";

let passed = 0;
let failed = 0;

function assertEqual<T>(
  actual: T,
  expected: T,
  testName: string
) {
  if (actual === expected) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(
      `❌ FAIL: ${testName} | Expected: ${expected} | Actual: ${actual}`
    );
    failed++;
  }
}

/*
========================================================
TEST 1
Strong Bullish Direction + Strong Bullish Momentum
+ Mid Range
Expected: NO CONFLICT
========================================================
*/

const test1 = calculateConflictEngine(
  "STRONG_BULLISH",
  "EMA20 > EMA50 > EMA200",
  "STRONG_BULLISH",
  "STRONG",
  "AGREE",
  "MID_RANGE",
  "NEUTRAL",
  "BULLISH_EVIDENCE",
  "STRONG",
  "STRONG_ALIGNMENT"
);

assertEqual(
  test1.conflictStatus,
  "NO_CONFLICT",
  "Strong bullish alignment should have no conflict"
);

assertEqual(
  test1.conflictSeverity,
  "NONE",
  "Strong bullish alignment severity should be NONE"
);

assertEqual(
  test1.conflictCount,
  0,
  "Strong bullish alignment conflict count should be 0"
);

assertEqual(
  test1.reliabilityImpact,
  "HIGH_RELIABILITY",
  "No conflict should produce HIGH_RELIABILITY"
);


/*
========================================================
TEST 2
Strong Bullish Direction + Bearish Momentum
Expected: HIGH conflict
========================================================
*/

const test2 = calculateConflictEngine(
  "STRONG_BULLISH",
  "Strong bullish EMA structure",
  "BEARISH",
  "MODERATE",
  "CONFLICT",
  "MID_RANGE",
  "NEUTRAL",
  "MIXED_EVIDENCE",
  "CONFLICTING",
  "MIXED"
);

assertEqual(
  test2.conflictStatus,
  "CONFLICT",
  "Bullish direction vs bearish momentum should conflict"
);

assertEqual(
  test2.directionMomentumConflict,
  true,
  "Direction-Momentum conflict should be detected"
);

assertEqual(
  test2.conflictSeverity,
  "HIGH",
  "Strong bullish direction vs bearish momentum should be HIGH"
);

assertEqual(
  test2.reliabilityImpact,
  "LOW_RELIABILITY",
  "HIGH conflict should produce LOW_RELIABILITY"
);


/*
========================================================
TEST 3
Bullish Direction + Near Resistance
Expected: LOW conflict
========================================================
*/

const test3 = calculateConflictEngine(
  "BULLISH",
  "Bullish EMA structure",
  "BULLISH",
  "MODERATE",
  "AGREE",
  "NEAR_RESISTANCE",
  "UNFAVORABLE",
  "BULLISH_EVIDENCE",
  "MODERATE",
  "STRONG_ALIGNMENT"
);

assertEqual(
  test3.directionLocationConflict,
  true,
  "Bullish direction near resistance should create location conflict"
);

assertEqual(
  test3.conflictStatus,
  "CONFLICT",
  "Bullish direction with unfavorable resistance location should conflict"
);

assertEqual(
  test3.conflictSeverity,
  "LOW",
  "Direction-location conflict should be LOW when no directional disagreement exists"
);

assertEqual(
  test3.reliabilityImpact,
  "MODERATE_RELIABILITY",
  "LOW conflict should produce MODERATE_RELIABILITY"
);


/*
========================================================
TEST 4
Bearish Direction + At Support
Expected: LOW conflict
========================================================
*/

const test4 = calculateConflictEngine(
  "BEARISH",
  "Bearish EMA structure",
  "BEARISH",
  "MODERATE",
  "AGREE",
  "AT_SUPPORT",
  "FAVORABLE",
  "BEARISH_EVIDENCE",
  "MODERATE",
  "STRONG_ALIGNMENT"
);

assertEqual(
  test4.directionLocationConflict,
  true,
  "Bearish direction at support should create location conflict"
);

assertEqual(
  test4.conflictSeverity,
  "LOW",
  "Bearish direction vs support should be LOW"
);


/*
========================================================
TEST 5
Strong Bullish Direction + Bearish Momentum
+ Near Resistance
Expected: 2 conflicts
Expected severity: HIGH
========================================================
*/

const test5 = calculateConflictEngine(
  "STRONG_BULLISH",
  "Strong bullish EMA structure",
  "BEARISH",
  "MODERATE",
  "CONFLICT",
  "NEAR_RESISTANCE",
  "UNFAVORABLE",
  "MIXED_EVIDENCE",
  "CONFLICTING",
  "MIXED"
);

assertEqual(
  test5.conflictCount,
  2,
  "Bullish direction + bearish momentum + near resistance should create 2 conflicts"
);

assertEqual(
  test5.directionMomentumConflict,
  true,
  "Direction-Momentum conflict should exist"
);

assertEqual(
  test5.directionLocationConflict,
  true,
  "Direction-Location conflict should exist"
);

assertEqual(
  test5.conflictSeverity,
  "HIGH",
  "Directional disagreement should dominate severity as HIGH"
);


/*
========================================================
TEST 6
Strong Bullish Momentum + At Resistance
Expected: Momentum-Location conflict
========================================================
*/

const test6 = calculateConflictEngine(
  "BULLISH",
  "Bullish EMA structure",
  "STRONG_BULLISH",
  "STRONG",
  "AGREE",
  "AT_RESISTANCE",
  "UNFAVORABLE",
  "BULLISH_EVIDENCE",
  "STRONG",
  "STRONG_ALIGNMENT"
);

assertEqual(
  test6.momentumLocationConflict,
  true,
  "Strong bullish momentum at resistance should create conflict"
);

assertEqual(
  test6.conflictSeverity,
  "LOW",
  "Momentum-location conflict without directional disagreement should be LOW"
);


/*
========================================================
TEST 7
Strong Bearish Momentum + At Support
Expected: Momentum-Location conflict
========================================================
*/

const test7 = calculateConflictEngine(
  "BEARISH",
  "Bearish EMA structure",
  "STRONG_BEARISH",
  "STRONG",
  "AGREE",
  "AT_SUPPORT",
  "FAVORABLE",
  "BEARISH_EVIDENCE",
  "STRONG",
  "STRONG_ALIGNMENT"
);

assertEqual(
  test7.momentumLocationConflict,
  true,
  "Strong bearish momentum at support should create conflict"
);

assertEqual(
  test7.conflictSeverity,
  "LOW",
  "Bearish momentum vs support should be LOW"
);


/*
========================================================
TEST 8
Neutral Direction + Neutral Momentum + Mid Range
Expected: NO CONFLICT
========================================================
*/

const test8 = calculateConflictEngine(
  "NEUTRAL",
  "Mixed EMA structure",
  "NEUTRAL",
  "WEAK",
  "PARTIAL",
  "MID_RANGE",
  "NEUTRAL",
  "NEUTRAL_EVIDENCE",
  "WEAK",
  "NO_ALIGNMENT"
);

assertEqual(
  test8.conflictStatus,
  "NO_CONFLICT",
  "Neutral market should not create artificial conflict"
);

assertEqual(
  test8.conflictSeverity,
  "NONE",
  "Neutral market severity should be NONE"
);

assertEqual(
  test8.reliabilityImpact,
  "HIGH_RELIABILITY",
  "No conflict should produce HIGH_RELIABILITY"
);


/*
========================================================
TEST 9
Bullish Direction + Unfavorable Location
Expected: Direction-Location conflict
========================================================
*/

const test9 = calculateConflictEngine(
  "BULLISH",
  "Bullish EMA structure",
  "NEUTRAL",
  "WEAK",
  "PARTIAL",
  "MID_RANGE",
  "UNFAVORABLE",
  "BULLISH_EVIDENCE",
  "WEAK",
  "PARTIAL_ALIGNMENT"
);

assertEqual(
  test9.directionLocationConflict,
  true,
  "Bullish direction with unfavorable location should conflict"
);

assertEqual(
  test9.conflictSeverity,
  "LOW",
  "Unfavorable location should create LOW conflict"
);


/*
========================================================
TEST 10
Bearish Direction + Above Resistance
Expected: Direction-Location conflict
========================================================
*/

const test10 = calculateConflictEngine(
  "BEARISH",
  "Bearish EMA structure",
  "BEARISH",
  "MODERATE",
  "AGREE",
  "ABOVE_RESISTANCE",
  "FAVORABLE",
  "BEARISH_EVIDENCE",
  "MODERATE",
  "STRONG_ALIGNMENT"
);

assertEqual(
  test10.directionLocationConflict,
  true,
  "Bearish direction above resistance should create location conflict"
);

assertEqual(
  test10.conflictSeverity,
  "LOW",
  "Bearish direction vs above resistance should be LOW"
);


/*
========================================================
FINAL RESULT
========================================================
*/

console.log("");
console.log("========================================");
console.log("CONFLICT ENGINE v1 TEST RESULT");
console.log("========================================");
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total : ${passed + failed}`);
console.log("========================================");

if (failed > 0) {
  throw new Error(
    `Conflict Engine tests failed: ${failed} test(s)`
  );
}

console.log("🎯 ALL CONFLICT ENGINE TESTS PASSED");
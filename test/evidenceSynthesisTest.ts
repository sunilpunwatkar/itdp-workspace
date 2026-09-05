import { calculateEvidenceSynthesis } from "../app/services/evidenceSynthesisService";

let passed = 0;
let failed = 0;

function assertEqual<T>(
  name: string,
  actual: T,
  expected: T
) {
  if (actual === expected) {
    console.log(`✅ PASS: ${name}`);
    passed++;
  } else {
    console.log(
      `❌ FAIL: ${name} | Expected ${expected} | Actual ${actual}`
    );
    failed++;
  }
}

function runTest(
  name: string,
  params: Parameters<typeof calculateEvidenceSynthesis>
) {
  console.log(`\n🧪 ${name}`);

  const result = calculateEvidenceSynthesis(...params);

  return result;
}

/*
 * ---------------------------------------------------------
 * 1. STRONG BULLISH AGREEMENT
 * ---------------------------------------------------------
 */

{
  const result = runTest(
    "Strong Bullish Agreement",
    [
      "STRONG_BULLISH",
      "STRONG_BULLISH",
      "STRONG",
      "AGREE",
      "AT_SUPPORT",
      "FAVORABLE",
    ]
  );

  assertEqual(
    "Strong Bullish overall evidence",
    result.overallEvidence,
    "BULLISH_EVIDENCE"
  );

  assertEqual(
    "Strong Bullish strength",
    result.evidenceStrength,
    "STRONG"
  );

  assertEqual(
    "Strong Bullish alignment",
    result.evidenceAlignment,
    "STRONG_ALIGNMENT"
  );
}

/*
 * ---------------------------------------------------------
 * 2. STRONG BEARISH AGREEMENT
 * ---------------------------------------------------------
 */

{
  const result = runTest(
    "Strong Bearish Agreement",
    [
      "STRONG_BEARISH",
      "STRONG_BEARISH",
      "STRONG",
      "AGREE",
      "AT_RESISTANCE",
      "UNFAVORABLE",
    ]
  );

  assertEqual(
    "Strong Bearish overall evidence",
    result.overallEvidence,
    "BEARISH_EVIDENCE"
  );

  assertEqual(
    "Strong Bearish strength",
    result.evidenceStrength,
    "STRONG"
  );

  assertEqual(
    "Strong Bearish alignment",
    result.evidenceAlignment,
    "STRONG_ALIGNMENT"
  );
}

/*
 * ---------------------------------------------------------
 * 3. BULLISH + BULLISH
 * ---------------------------------------------------------
 */

{
  const result = runTest(
    "Bullish Direction + Bullish Momentum",
    [
      "BULLISH",
      "BULLISH",
      "MODERATE",
      "AGREE",
      "MID_RANGE",
      "NEUTRAL",
    ]
  );

  assertEqual(
    "Bullish evidence",
    result.overallEvidence,
    "BULLISH_EVIDENCE"
  );

  assertEqual(
    "Bullish strength",
    result.evidenceStrength,
    "MODERATE"
  );

  assertEqual(
    "Bullish alignment",
    result.evidenceAlignment,
    "STRONG_ALIGNMENT"
  );
}

/*
 * ---------------------------------------------------------
 * 4. BEARISH + BEARISH
 * ---------------------------------------------------------
 */

{
  const result = runTest(
    "Bearish Direction + Bearish Momentum",
    [
      "BEARISH",
      "BEARISH",
      "MODERATE",
      "AGREE",
      "MID_RANGE",
      "NEUTRAL",
    ]
  );

  assertEqual(
    "Bearish evidence",
    result.overallEvidence,
    "BEARISH_EVIDENCE"
  );

  assertEqual(
    "Bearish strength",
    result.evidenceStrength,
    "MODERATE"
  );

  assertEqual(
    "Bearish alignment",
    result.evidenceAlignment,
    "STRONG_ALIGNMENT"
  );
}

/*
 * ---------------------------------------------------------
 * 5. BULLISH DIRECTION + BEARISH MOMENTUM
 * ---------------------------------------------------------
 */

{
  const result = runTest(
    "Bullish Direction + Bearish Momentum Conflict",
    [
      "STRONG_BULLISH",
      "BEARISH",
      "CONFLICTING",
      "CONFLICT",
      "NEAR_RESISTANCE",
      "UNFAVORABLE",
    ]
  );

  assertEqual(
    "Conflict overall evidence",
    result.overallEvidence,
    "MIXED_EVIDENCE"
  );

  assertEqual(
    "Conflict strength",
    result.evidenceStrength,
    "CONFLICTING"
  );

  assertEqual(
    "Conflict alignment",
    result.evidenceAlignment,
    "MIXED"
  );
}

/*
 * ---------------------------------------------------------
 * 6. BEARISH DIRECTION + BULLISH MOMENTUM
 * ---------------------------------------------------------
 */

{
  const result = runTest(
    "Bearish Direction + Bullish Momentum Conflict",
    [
      "STRONG_BEARISH",
      "BULLISH",
      "CONFLICTING",
      "CONFLICT",
      "AT_SUPPORT",
      "FAVORABLE",
    ]
  );

  assertEqual(
    "Reverse conflict overall evidence",
    result.overallEvidence,
    "MIXED_EVIDENCE"
  );

  assertEqual(
    "Reverse conflict strength",
    result.evidenceStrength,
    "CONFLICTING"
  );

  assertEqual(
    "Reverse conflict alignment",
    result.evidenceAlignment,
    "MIXED"
  );
}

/*
 * ---------------------------------------------------------
 * 7. BULLISH DIRECTION + NEUTRAL MOMENTUM
 * ---------------------------------------------------------
 */

{
  const result = runTest(
    "Bullish Direction + Neutral Momentum",
    [
      "BULLISH",
      "NEUTRAL",
      "WEAK",
      "PARTIAL",
      "NEAR_SUPPORT",
      "FAVORABLE",
    ]
  );

  assertEqual(
    "Bullish neutral evidence",
    result.overallEvidence,
    "BULLISH_EVIDENCE"
  );

  assertEqual(
    "Bullish neutral strength",
    result.evidenceStrength,
    "WEAK"
  );

  assertEqual(
    "Bullish neutral alignment",
    result.evidenceAlignment,
    "PARTIAL_ALIGNMENT"
  );
}

/*
 * ---------------------------------------------------------
 * 8. STRONG BULLISH DIRECTION + NEUTRAL MOMENTUM
 * ---------------------------------------------------------
 */

{
  const result = runTest(
    "Strong Bullish Direction + Neutral Momentum",
    [
      "STRONG_BULLISH",
      "NEUTRAL",
      "WEAK",
      "PARTIAL",
      "MID_RANGE",
      "NEUTRAL",
    ]
  );

  assertEqual(
    "Strong bullish neutral evidence",
    result.overallEvidence,
    "BULLISH_EVIDENCE"
  );

  assertEqual(
    "Strong bullish neutral strength",
    result.evidenceStrength,
    "MODERATE"
  );
}

/*
 * ---------------------------------------------------------
 * 9. BEARISH DIRECTION + NEUTRAL MOMENTUM
 * ---------------------------------------------------------
 */

{
  const result = runTest(
    "Bearish Direction + Neutral Momentum",
    [
      "BEARISH",
      "NEUTRAL",
      "WEAK",
      "PARTIAL",
      "MID_RANGE",
      "NEUTRAL",
    ]
  );

  assertEqual(
    "Bearish neutral evidence",
    result.overallEvidence,
    "BEARISH_EVIDENCE"
  );

  assertEqual(
    "Bearish neutral strength",
    result.evidenceStrength,
    "WEAK"
  );
}

/*
 * ---------------------------------------------------------
 * 10. NEUTRAL + NEUTRAL
 * ---------------------------------------------------------
 */

{
  const result = runTest(
    "Neutral Direction + Neutral Momentum",
    [
      "NEUTRAL",
      "NEUTRAL",
      "WEAK",
      "PARTIAL",
      "MID_RANGE",
      "NEUTRAL",
    ]
  );

  assertEqual(
    "Neutral overall evidence",
    result.overallEvidence,
    "NEUTRAL_EVIDENCE"
  );

  assertEqual(
    "Neutral strength",
    result.evidenceStrength,
    "WEAK"
  );

  assertEqual(
    "Neutral alignment",
    result.evidenceAlignment,
    "NO_ALIGNMENT"
  );
}

/*
 * ---------------------------------------------------------
 * 11. NEUTRAL DIRECTION + BULLISH MOMENTUM
 * ---------------------------------------------------------
 */

{
  const result = runTest(
    "Neutral Direction + Bullish Momentum",
    [
      "NEUTRAL",
      "BULLISH",
      "MODERATE",
      "PARTIAL",
      "MID_RANGE",
      "NEUTRAL",
    ]
  );

  assertEqual(
    "Neutral + bullish evidence",
    result.overallEvidence,
    "MIXED_EVIDENCE"
  );

  assertEqual(
    "Neutral + bullish strength",
    result.evidenceStrength,
    "WEAK"
  );

  assertEqual(
    "Neutral + bullish alignment",
    result.evidenceAlignment,
    "MIXED"
  );
}

/*
 * ---------------------------------------------------------
 * 12. NEUTRAL DIRECTION + BEARISH MOMENTUM
 * ---------------------------------------------------------
 */

{
  const result = runTest(
    "Neutral Direction + Bearish Momentum",
    [
      "NEUTRAL",
      "BEARISH",
      "MODERATE",
      "PARTIAL",
      "MID_RANGE",
      "NEUTRAL",
    ]
  );

  assertEqual(
    "Neutral + bearish evidence",
    result.overallEvidence,
    "MIXED_EVIDENCE"
  );

  assertEqual(
    "Neutral + bearish strength",
    result.evidenceStrength,
    "WEAK"
  );

  assertEqual(
    "Neutral + bearish alignment",
    result.evidenceAlignment,
    "MIXED"
  );
}

/*
 * ---------------------------------------------------------
 * 13. BULLISH EVIDENCE + UNFAVORABLE LOCATION
 * ---------------------------------------------------------
 */

{
  const result = runTest(
    "Bullish Evidence + Unfavorable Location",
    [
      "STRONG_BULLISH",
      "STRONG_BULLISH",
      "STRONG",
      "AGREE",
      "NEAR_RESISTANCE",
      "UNFAVORABLE",
    ]
  );

  assertEqual(
    "Unfavorable location does not erase bullish evidence",
    result.overallEvidence,
    "BULLISH_EVIDENCE"
  );

  assertEqual(
    "Unfavorable location does not change strength",
    result.evidenceStrength,
    "STRONG"
  );
}

/*
 * ---------------------------------------------------------
 * 14. BEARISH EVIDENCE + FAVORABLE LOCATION
 * ---------------------------------------------------------
 */

{
  const result = runTest(
    "Bearish Evidence + Favorable Location",
    [
      "STRONG_BEARISH",
      "STRONG_BEARISH",
      "STRONG",
      "AGREE",
      "AT_SUPPORT",
      "FAVORABLE",
    ]
  );

  assertEqual(
    "Favorable support does not erase bearish evidence",
    result.overallEvidence,
    "BEARISH_EVIDENCE"
  );

  assertEqual(
    "Favorable support does not change bearish strength",
    result.evidenceStrength,
    "STRONG"
  );
}

/*
 * ---------------------------------------------------------
 * FINAL RESULT
 * ---------------------------------------------------------
 */

console.log("\n----------------------------------------");
console.log(`📊 Tests Passed : ${passed}`);
console.log(`📊 Tests Failed : ${failed}`);
console.log("----------------------------------------");

if (failed === 0) {
  console.log(
    "\n🎯 ALL EVIDENCE SYNTHESIS TESTS PASSED"
  );
} else {
  console.log(
    "\n❌ EVIDENCE SYNTHESIS TEST FAILED"
  );

  process.exit(1);
}
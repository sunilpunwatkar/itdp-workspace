import { calculatePriceLocationIntelligence } from "../app/services/priceLocationIntelligenceService";

function assertEqual(
  testName: string,
  actual: string | number | null,
  expected: string | number | null
) {
  if (actual !== expected) {
    console.error(
      `❌ FAIL: ${testName} | Expected: ${expected} | Actual: ${actual}`
    );
    process.exitCode = 1;
    return;
  }

  console.log(`✅ PASS: ${testName}`);
}


// --------------------------------
// 1. AT SUPPORT
// --------------------------------

const atSupport = calculatePriceLocationIntelligence(
  100,
  100,
  120,
  5
);

assertEqual(
  "AT_SUPPORT location",
  atSupport.location,
  "AT_SUPPORT"
);

assertEqual(
  "AT_SUPPORT quality",
  atSupport.locationQuality,
  "FAVORABLE"
);


// --------------------------------
// 2. NEAR SUPPORT
// --------------------------------

const nearSupport = calculatePriceLocationIntelligence(
  104,
  100,
  120,
  5
);

assertEqual(
  "NEAR_SUPPORT location",
  nearSupport.location,
  "NEAR_SUPPORT"
);

assertEqual(
  "NEAR_SUPPORT quality",
  nearSupport.locationQuality,
  "FAVORABLE"
);


// --------------------------------
// 3. MID RANGE
// --------------------------------

const midRange = calculatePriceLocationIntelligence(
  110,
  100,
  120,
  5
);

assertEqual(
  "MID_RANGE location",
  midRange.location,
  "MID_RANGE"
);

assertEqual(
  "MID_RANGE quality",
  midRange.locationQuality,
  "NEUTRAL"
);


// --------------------------------
// 4. NEAR RESISTANCE
// --------------------------------

const nearResistance = calculatePriceLocationIntelligence(
  116,
  100,
  120,
  5
);

assertEqual(
  "NEAR_RESISTANCE location",
  nearResistance.location,
  "NEAR_RESISTANCE"
);

assertEqual(
  "NEAR_RESISTANCE quality",
  nearResistance.locationQuality,
  "UNFAVORABLE"
);


// --------------------------------
// 5. AT RESISTANCE
// --------------------------------

const atResistance = calculatePriceLocationIntelligence(
  120,
  100,
  120,
  5
);

assertEqual(
  "AT_RESISTANCE location",
  atResistance.location,
  "AT_RESISTANCE"
);

assertEqual(
  "AT_RESISTANCE quality",
  atResistance.locationQuality,
  "UNFAVORABLE"
);


// --------------------------------
// 6. ABOVE RESISTANCE
// --------------------------------

const aboveResistance = calculatePriceLocationIntelligence(
  125,
  100,
  120,
  5
);

assertEqual(
  "ABOVE_RESISTANCE location",
  aboveResistance.location,
  "ABOVE_RESISTANCE"
);

assertEqual(
  "ABOVE_RESISTANCE quality",
  aboveResistance.locationQuality,
  "FAVORABLE"
);


// --------------------------------
// 7. BELOW SUPPORT
// --------------------------------

const belowSupport = calculatePriceLocationIntelligence(
  95,
  100,
  120,
  5
);

assertEqual(
  "BELOW_SUPPORT location",
  belowSupport.location,
  "BELOW_SUPPORT"
);

assertEqual(
  "BELOW_SUPPORT quality",
  belowSupport.locationQuality,
  "UNFAVORABLE"
);


// --------------------------------
// 8. RANGE POSITION - LOWER
// --------------------------------

const lower = calculatePriceLocationIntelligence(
  104,
  100,
  120,
  5
);

assertEqual(
  "LOWER range position",
  lower.rangePosition,
  "LOWER"
);


// --------------------------------
// 9. RANGE POSITION - MIDDLE
// --------------------------------

const middle = calculatePriceLocationIntelligence(
  110,
  100,
  120,
  5
);

assertEqual(
  "MIDDLE range position",
  middle.rangePosition,
  "MIDDLE"
);


// --------------------------------
// 10. RANGE POSITION - UPPER
// --------------------------------

const upper = calculatePriceLocationIntelligence(
  116,
  100,
  120,
  5
);

assertEqual(
  "UPPER range position",
  upper.rangePosition,
  "UPPER"
);


// --------------------------------
// 11. INVALID ATR
// --------------------------------

const invalidAtr = calculatePriceLocationIntelligence(
  110,
  100,
  120,
  0
);

assertEqual(
  "Invalid ATR quality",
  invalidAtr.locationQuality,
  "NOT_AVAILABLE"
);

assertEqual(
  "Invalid ATR range position",
  invalidAtr.rangePosition,
  "NOT_AVAILABLE"
);


// --------------------------------
// 12. MISSING LEVELS
// --------------------------------

const missingLevels = calculatePriceLocationIntelligence(
  110,
  null,
  null,
  5
);

assertEqual(
  "Missing levels quality",
  missingLevels.locationQuality,
  "NOT_AVAILABLE"
);

assertEqual(
  "Missing levels range position",
  missingLevels.rangePosition,
  "NOT_AVAILABLE"
);


// --------------------------------
// 13. INVALID RANGE
// --------------------------------

const invalidRange = calculatePriceLocationIntelligence(
  110,
  120,
  100,
  5
);

assertEqual(
  "Invalid range position",
  invalidRange.rangePosition,
  "NOT_AVAILABLE"
);


// --------------------------------
// 14. ATR-NORMALIZED DISTANCE
// --------------------------------

const normalizedDistance =
  calculatePriceLocationIntelligence(
    105,
    100,
    120,
    5
  );

assertEqual(
  "Support ATR distance",
  normalizedDistance.distanceToSupport1Atr,
  1
);

assertEqual(
  "Resistance ATR distance",
  normalizedDistance.distanceToResistance1Atr,
  3
);


// --------------------------------
// FINAL RESULT
// --------------------------------

if (process.exitCode === 1) {
  console.error(
    "\n❌ Price Location Intelligence Test FAILED"
  );
} else {
  console.log(
    "\n🎯 ALL PRICE LOCATION INTELLIGENCE TESTS PASSED"
  );
}
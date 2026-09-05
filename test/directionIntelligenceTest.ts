import { calculateDirectionIntelligence } from "../app/services/directionIntelligenceService";

function assertEqual(
  testName: string,
  actual: string,
  expected: string
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


// 1. STRONG BULLISH
const strongBullish = calculateDirectionIntelligence(
  120,
  110,
  95,
  8
);

assertEqual(
  "STRONG BULLISH direction",
  strongBullish.direction,
  "STRONG_BULLISH"
);

assertEqual(
  "STRONG BULLISH trend",
  strongBullish.trend,
  "UPTREND"
);

assertEqual(
  "STRONG BULLISH EMA structure",
  strongBullish.emaStructure,
  "BULLISH"
);

assertEqual(
  "STRONG BULLISH EMA separation",
  strongBullish.emaSeparation,
  "STRONG"
);


// 2. BULLISH
const bullish = calculateDirectionIntelligence(
  112,
  108,
  105,
  8
);

assertEqual(
  "BULLISH direction",
  bullish.direction,
  "BULLISH"
);

assertEqual(
  "BULLISH trend",
  bullish.trend,
  "UPTREND"
);


// 3. NEUTRAL
const neutral = calculateDirectionIntelligence(
  105,
  110,
  108,
  8
);

assertEqual(
  "NEUTRAL direction",
  neutral.direction,
  "NEUTRAL"
);

assertEqual(
  "NEUTRAL trend",
  neutral.trend,
  "SIDEWAYS"
);


// 4. BEARISH
const bearish = calculateDirectionIntelligence(
  100,
  103,
  105,
  8
);

assertEqual(
  "BEARISH direction",
  bearish.direction,
  "BEARISH"
);

assertEqual(
  "BEARISH trend",
  bearish.trend,
  "DOWNTREND"
);


// 5. STRONG BEARISH
const strongBearish = calculateDirectionIntelligence(
  90,
  100,
  115,
  8
);

assertEqual(
  "STRONG BEARISH direction",
  strongBearish.direction,
  "STRONG_BEARISH"
);

assertEqual(
  "STRONG BEARISH trend",
  strongBearish.trend,
  "DOWNTREND"
);

assertEqual(
  "STRONG BEARISH EMA separation",
  strongBearish.emaSeparation,
  "STRONG"
);


// 6. INVALID ATR
const invalidATR = calculateDirectionIntelligence(
  120,
  110,
  95,
  0
);

assertEqual(
  "INVALID ATR separation",
  invalidATR.emaSeparation,
  "NOT_AVAILABLE"
);

if (invalidATR.ema20To50Atr !== null) {
  console.error(
    "❌ FAIL: INVALID ATR EMA20-50 ATR ratio should be null"
  );
  process.exitCode = 1;
} else {
  console.log(
    "✅ PASS: INVALID ATR EMA20-50 ATR ratio"
  );
}

if (invalidATR.ema50To200Atr !== null) {
  console.error(
    "❌ FAIL: INVALID ATR EMA50-200 ATR ratio should be null"
  );
  process.exitCode = 1;
} else {
  console.log(
    "✅ PASS: INVALID ATR EMA50-200 ATR ratio"
  );
}


if (process.exitCode === 1) {
  console.error("\n❌ Direction Intelligence Test FAILED");
} else {
  console.log("\n🎯 ALL DIRECTION INTELLIGENCE TESTS PASSED");
}
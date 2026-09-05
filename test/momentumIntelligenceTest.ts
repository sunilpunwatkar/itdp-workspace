import { calculateMomentumIntelligence } from "../app/services/momentumIntelligenceService";

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
const strongBullish = calculateMomentumIntelligence(
  65,
  "BUY",
  2
);

assertEqual(
  "STRONG BULLISH direction",
  strongBullish.momentumDirection,
  "STRONG_BULLISH"
);

assertEqual(
  "STRONG BULLISH strength",
  strongBullish.momentumStrength,
  "STRONG"
);

assertEqual(
  "STRONG BULLISH agreement",
  strongBullish.agreement,
  "AGREE"
);


// 2. BULLISH
const bullish = calculateMomentumIntelligence(
  65,
  "BUY",
  -1
);

assertEqual(
  "BULLISH direction",
  bullish.momentumDirection,
  "BULLISH"
);

assertEqual(
  "BULLISH strength",
  bullish.momentumStrength,
  "CONFLICTING"
);

assertEqual(
  "BULLISH agreement",
  bullish.agreement,
  "CONFLICT"
);


// 3. NEUTRAL
const neutral = calculateMomentumIntelligence(
  50,
  "HOLD",
  0
);

assertEqual(
  "NEUTRAL direction",
  neutral.momentumDirection,
  "NEUTRAL"
);

assertEqual(
  "NEUTRAL strength",
  neutral.momentumStrength,
  "WEAK"
);

assertEqual(
  "NEUTRAL agreement",
  neutral.agreement,
  "PARTIAL"
);


// 4. BEARISH
const bearish = calculateMomentumIntelligence(
  35,
  "SELL",
  1
);

assertEqual(
  "BEARISH direction",
  bearish.momentumDirection,
  "BEARISH"
);

assertEqual(
  "BEARISH strength",
  bearish.momentumStrength,
  "CONFLICTING"
);

assertEqual(
  "BEARISH agreement",
  bearish.agreement,
  "CONFLICT"
);


// 5. STRONG BEARISH
const strongBearish = calculateMomentumIntelligence(
  35,
  "SELL",
  -2
);

assertEqual(
  "STRONG BEARISH direction",
  strongBearish.momentumDirection,
  "STRONG_BEARISH"
);

assertEqual(
  "STRONG BEARISH strength",
  strongBearish.momentumStrength,
  "STRONG"
);

assertEqual(
  "STRONG BEARISH agreement",
  strongBearish.agreement,
  "AGREE"
);


// 6. RSI / MACD CONFLICT
const rsiMacdConflict = calculateMomentumIntelligence(
  65,
  "SELL",
  -1
);

assertEqual(
  "RSI/MACD conflict direction",
  rsiMacdConflict.momentumDirection,
  "BEARISH"
);

assertEqual(
  "RSI/MACD conflict strength",
  rsiMacdConflict.momentumStrength,
  "CONFLICTING"
);

assertEqual(
  "RSI/MACD conflict agreement",
  rsiMacdConflict.agreement,
  "CONFLICT"
);


// 7. MACD / HISTOGRAM CONFLICT
const macdHistogramConflict = calculateMomentumIntelligence(
  50,
  "BUY",
  -1
);

assertEqual(
  "MACD/HISTOGRAM conflict direction",
  macdHistogramConflict.momentumDirection,
  "NEUTRAL"
);

assertEqual(
  "MACD/HISTOGRAM conflict strength",
  macdHistogramConflict.momentumStrength,
  "CONFLICTING"
);

assertEqual(
  "MACD/HISTOGRAM conflict agreement",
  macdHistogramConflict.agreement,
  "CONFLICT"
);


// 8. HISTOGRAM ZERO
const histogramZero = calculateMomentumIntelligence(
  65,
  "BUY",
  0
);

assertEqual(
  "Histogram zero state",
  histogramZero.histogramState,
  "NEUTRAL"
);

assertEqual(
  "Histogram zero direction",
  histogramZero.momentumDirection,
  "BULLISH"
);


// 9. HISTOGRAM TREND
assertEqual(
  "Histogram trend availability",
  strongBullish.histogramTrend,
  "NOT_AVAILABLE"
);


// FINAL RESULT

if (process.exitCode === 1) {
  console.error("\n❌ Momentum Intelligence Test FAILED");
} else {
  console.log("\n🎯 ALL MOMENTUM INTELLIGENCE TESTS PASSED");
}
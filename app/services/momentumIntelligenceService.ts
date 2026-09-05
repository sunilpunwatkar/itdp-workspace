export type MomentumDirection =
  | "STRONG_BULLISH"
  | "BULLISH"
  | "NEUTRAL"
  | "BEARISH"
  | "STRONG_BEARISH";

export type MomentumStrength =
  | "STRONG"
  | "MODERATE"
  | "WEAK"
  | "CONFLICTING";

export type RSIState =
  | "BULLISH"
  | "NEUTRAL"
  | "BEARISH";

export type MACDState =
  | "BULLISH"
  | "NEUTRAL"
  | "BEARISH";

export type HistogramState =
  | "POSITIVE"
  | "NEUTRAL"
  | "NEGATIVE";

export type MomentumAgreement =
  | "AGREE"
  | "PARTIAL"
  | "CONFLICT";

export type HistogramTrend =
  | "STRENGTHENING"
  | "WEAKENING"
  | "STABLE"
  | "NOT_AVAILABLE";

export interface MomentumIntelligenceResult {
  momentumDirection: MomentumDirection;
  momentumStrength: MomentumStrength;

  rsiState: RSIState;
  macdState: MACDState;
  histogramState: HistogramState;

  agreement: MomentumAgreement;
  histogramTrend: HistogramTrend;

  reason: string;
}

export function calculateMomentumIntelligence(
  rsi: number,
  macdSignal: "BUY" | "SELL" | "HOLD",
  histogram: number
): MomentumIntelligenceResult {

  // --------------------------------
  // 1. RSI STATE
  // --------------------------------

  let rsiState: RSIState;

  if (rsi > 60) {
    rsiState = "BULLISH";
  } else if (rsi < 40) {
    rsiState = "BEARISH";
  } else {
    rsiState = "NEUTRAL";
  }


  // --------------------------------
  // 2. MACD STATE
  // --------------------------------

  let macdState: MACDState;

  if (macdSignal === "BUY") {
    macdState = "BULLISH";
  } else if (macdSignal === "SELL") {
    macdState = "BEARISH";
  } else {
    macdState = "NEUTRAL";
  }


  // --------------------------------
  // 3. HISTOGRAM STATE
  // --------------------------------

  let histogramState: HistogramState;

  if (histogram > 0) {
    histogramState = "POSITIVE";
  } else if (histogram < 0) {
    histogramState = "NEGATIVE";
  } else {
    histogramState = "NEUTRAL";
  }


  // --------------------------------
  // 4. EVIDENCE COUNTS
  // --------------------------------

  const bullishCount =
    (rsiState === "BULLISH" ? 1 : 0) +
    (macdState === "BULLISH" ? 1 : 0) +
    (histogramState === "POSITIVE" ? 1 : 0);

  const bearishCount =
    (rsiState === "BEARISH" ? 1 : 0) +
    (macdState === "BEARISH" ? 1 : 0) +
    (histogramState === "NEGATIVE" ? 1 : 0);


  // --------------------------------
  // 5. AGREEMENT / CONFLICT
  // --------------------------------

  let agreement: MomentumAgreement;

  if (
    bullishCount === 3 ||
    bearishCount === 3
  ) {
    agreement = "AGREE";
  } else if (
    bullishCount >= 2 &&
    bearishCount === 0
  ) {
    agreement = "PARTIAL";
  } else if (
    bearishCount >= 2 &&
    bullishCount === 0
  ) {
    agreement = "PARTIAL";
  } else if (
    bullishCount > 0 &&
    bearishCount > 0
  ) {
    agreement = "CONFLICT";
  } else {
    agreement = "PARTIAL";
  }


  // --------------------------------
// 6. MOMENTUM DIRECTION
// --------------------------------

let momentumDirection: MomentumDirection;

if (bullishCount === 3) {
  momentumDirection = "STRONG_BULLISH";
} else if (bullishCount === 2) {
  momentumDirection = "BULLISH";
} else if (bearishCount === 3) {
  momentumDirection = "STRONG_BEARISH";
} else if (bearishCount === 2) {
  momentumDirection = "BEARISH";
} else {
  momentumDirection = "NEUTRAL";
}


  // --------------------------------
// 7. MOMENTUM STRENGTH
// --------------------------------

let momentumStrength: MomentumStrength;

if (
  bullishCount === 3 ||
  bearishCount === 3
) {
  momentumStrength = "STRONG";
} else if (
  bullishCount > 0 &&
  bearishCount > 0
) {
  momentumStrength = "CONFLICTING";
} else if (
  bullishCount === 2 ||
  bearishCount === 2
) {
  momentumStrength = "MODERATE";
} else {
  momentumStrength = "WEAK";
}


  // --------------------------------
  // 8. HISTOGRAM TREND
  // --------------------------------
  //
  // Previous histogram is not available
  // in v1. Therefore trend cannot be
  // calculated without guessing.
  //

  const histogramTrend: HistogramTrend =
    "NOT_AVAILABLE";


  // --------------------------------
  // 9. REASON
  // --------------------------------

  let reason = "";

  if (
    momentumDirection === "STRONG_BULLISH"
  ) {
    reason =
      "RSI, MACD and MACD Histogram all confirm bullish momentum.";
  } else if (
    momentumDirection === "BULLISH"
  ) {
    reason =
      "Most momentum evidence is bullish, but full confirmation is not present.";
  } else if (
    momentumDirection === "STRONG_BEARISH"
  ) {
    reason =
      "RSI, MACD and MACD Histogram all confirm bearish momentum.";
  } else if (
    momentumDirection === "BEARISH"
  ) {
    reason =
      "Most momentum evidence is bearish, but full confirmation is not present.";
  } else if (
    agreement === "CONFLICT"
  ) {
    reason =
      "Momentum indicators are conflicting and do not provide clear confirmation.";
  } else {
    reason =
      "Momentum evidence is neutral and does not establish a clear directional bias.";
  }


  return {
    momentumDirection,
    momentumStrength,
    rsiState,
    macdState,
    histogramState,
    agreement,
    histogramTrend,
    reason,
  };
}
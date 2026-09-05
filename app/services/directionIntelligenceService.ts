import { detectTrend } from "./trendService";

export type DirectionStrength =
  | "STRONG_BULLISH"
  | "BULLISH"
  | "NEUTRAL"
  | "BEARISH"
  | "STRONG_BEARISH";

export interface DirectionIntelligenceResult {
  direction: DirectionStrength;

  trend: "UPTREND" | "DOWNTREND" | "SIDEWAYS";

  emaStructure:
    | "BULLISH"
    | "BEARISH"
    | "MIXED";

  emaSeparation:
    | "STRONG"
    | "MODERATE"
    | "WEAK"
    | "NOT_AVAILABLE";

  ema20To50Atr: number | null;
  ema50To200Atr: number | null;

  evidence:
    | "STRONG_ALIGNMENT"
    | "PARTIAL_ALIGNMENT"
    | "MIXED"
    | "NO_DIRECTION";

  reason: string;
}

export function calculateDirectionIntelligence(
  ema20: number,
  ema50: number,
  ema200: number,
  atr: number
): DirectionIntelligenceResult {

  const trendResult =
    detectTrend(
      ema20,
      ema50,
      ema200
    );

  const trend =
    trendResult.trend;

  const bullishEMA =
    ema20 > ema50 &&
    ema50 > ema200;

  const bearishEMA =
    ema20 < ema50 &&
    ema50 < ema200;

  const emaStructure =
    bullishEMA
      ? "BULLISH"
      : bearishEMA
      ? "BEARISH"
      : "MIXED";

  /*
   * ATR normalization
   *
   * EMA separation is measured relative
   * to current market volatility.
   *
   * This prevents raw price differences
   * from being treated equally across
   * different stocks.
   */

  const validATR =
    Number.isFinite(atr) &&
    atr > 0;

  const ema20To50Atr =
    validATR
      ? Math.abs(ema20 - ema50) / atr
      : null;

  const ema50To200Atr =
    validATR
      ? Math.abs(ema50 - ema200) / atr
      : null;

  /*
   * Direction strength thresholds are
   * provisional v1 rules.
   *
   * They must later be validated through
   * historical backtesting.
   */

  let emaSeparation:
    | "STRONG"
    | "MODERATE"
    | "WEAK"
    | "NOT_AVAILABLE";

  if (!validATR) {
    emaSeparation = "NOT_AVAILABLE";
  } else if (
    ema20To50Atr !== null &&
    ema50To200Atr !== null &&
    ema20To50Atr >= 1 &&
    ema50To200Atr >= 1
  ) {
    emaSeparation = "STRONG";
  } else if (
    ema20To50Atr !== null &&
    ema50To200Atr !== null &&
    ema20To50Atr >= 0.5 &&
    ema50To200Atr >= 0.5
  ) {
    emaSeparation = "MODERATE";
  } else {
    emaSeparation = "WEAK";
  }

  let direction:
    DirectionStrength;

  let evidence:
    | "STRONG_ALIGNMENT"
    | "PARTIAL_ALIGNMENT"
    | "MIXED"
    | "NO_DIRECTION";

  if (
    bullishEMA &&
    trend === "UPTREND" &&
    emaSeparation === "STRONG"
  ) {
    direction = "STRONG_BULLISH";
    evidence = "STRONG_ALIGNMENT";
  } else if (
    bullishEMA &&
    trend === "UPTREND"
  ) {
    direction = "BULLISH";
    evidence = "PARTIAL_ALIGNMENT";
  } else if (
    bearishEMA &&
    trend === "DOWNTREND" &&
    emaSeparation === "STRONG"
  ) {
    direction = "STRONG_BEARISH";
    evidence = "STRONG_ALIGNMENT";
  } else if (
    bearishEMA &&
    trend === "DOWNTREND"
  ) {
    direction = "BEARISH";
    evidence = "PARTIAL_ALIGNMENT";
  } else if (
    trend === "SIDEWAYS"
  ) {
    direction = "NEUTRAL";
    evidence = "NO_DIRECTION";
  } else {
    direction = "NEUTRAL";
    evidence = "MIXED";
  }

  let reason = "";

  if (direction === "STRONG_BULLISH") {
    reason =
      "Bullish EMA structure and uptrend are supported by strong ATR-normalized EMA separation.";
  } else if (direction === "BULLISH") {
    reason =
      "Bullish EMA structure and uptrend are present, but EMA separation is not yet strong.";
  } else if (direction === "STRONG_BEARISH") {
    reason =
      "Bearish EMA structure and downtrend are supported by strong ATR-normalized EMA separation.";
  } else if (direction === "BEARISH") {
    reason =
      "Bearish EMA structure and downtrend are present, but EMA separation is not yet strong.";
  } else if (trend === "SIDEWAYS") {
    reason =
      "EMA structure does not establish a clear directional trend.";
  } else {
    reason =
      "Trend and EMA structure are not sufficiently aligned to establish a clear direction.";
  }

  return {
    direction,
    trend,
    emaStructure,
    emaSeparation,
    ema20To50Atr,
    ema50To200Atr,
    evidence,
    reason,
  };
}
import { MarketSignal } from "../types/marketSignal";
import { AnalysisResult } from "../types/analysis";

export function analyzeStock(
  symbol: string,
  signal: MarketSignal
): AnalysisResult {

  // =====================================================
  // INTELLIGENT MULTI-FACTOR SCORING
  // =====================================================

  let score = 0;

  const reasons: string[] = [];

  // =====================================================
  // 1. TREND — PRIMARY FACTOR
  // =====================================================

  if (signal.trend === "UPTREND") {
    score += 2;
    reasons.push("Trend: UPTREND");
  }

  if (signal.trend === "DOWNTREND") {
    score -= 2;
    reasons.push("Trend: DOWNTREND");
  }

  if (signal.trend === "SIDEWAYS") {
    reasons.push("Trend: SIDEWAYS");
  }

  // =====================================================
  // 2. EMA STRUCTURE
  // =====================================================

  const bullishEMA =
    signal.ema20 > signal.ema50 &&
    signal.ema50 > signal.ema200;

  const bearishEMA =
    signal.ema20 < signal.ema50 &&
    signal.ema50 < signal.ema200;

  if (bullishEMA) {
    score += 2;
    reasons.push("EMA Structure: BULLISH");
  } else if (bearishEMA) {
    score -= 2;
    reasons.push("EMA Structure: BEARISH");
  } else {
    reasons.push("EMA Structure: MIXED");
  }

  // =====================================================
  // 3. RSI — MOMENTUM
  // =====================================================

  if (signal.rsiSignal === "BUY") {
    score += 1;
    reasons.push(`RSI: BUY (${signal.rsi.toFixed(2)})`);
  }

  if (signal.rsiSignal === "SELL") {
    score -= 1;
    reasons.push(`RSI: SELL (${signal.rsi.toFixed(2)})`);
  }

  if (signal.rsiSignal === "HOLD") {
    reasons.push(`RSI: HOLD (${signal.rsi.toFixed(2)})`);
  }

  // =====================================================
  // 4. MACD — MOMENTUM CONFIRMATION
  // =====================================================

  if (signal.macdSignal === "BUY") {
    score += 1;
    reasons.push("MACD: BUY");
  }

  if (signal.macdSignal === "SELL") {
    score -= 1;
    reasons.push("MACD: SELL");
  }

  if (signal.macdSignal === "HOLD") {
    reasons.push("MACD: HOLD");
  }

  // =====================================================
  // 5. MACD HISTOGRAM CONFIRMATION
  // =====================================================

  if (signal.histogram > 0) {
    score += 1;
    reasons.push("MACD Histogram: POSITIVE");
  }

  if (signal.histogram < 0) {
    score -= 1;
    reasons.push("MACD Histogram: NEGATIVE");
  }

  // =====================================================
  // FINAL DECISION
  // =====================================================

  let decision: "BUY" | "SELL" | "HOLD";

  if (score >= 4) {
    decision = "BUY";
  } else if (score <= -4) {
    decision = "SELL";
  } else {
    decision = "HOLD";
  }

  // =====================================================
  // CONFIDENCE
  // =====================================================

  const maxScore = 7;

  const confidence = Math.min(
    Math.round(
      50 + (Math.abs(score) / maxScore) * 45
    ),
    95
  );

  // =====================================================
  // RISK
  // =====================================================

  let risk: "LOW" | "MEDIUM" | "HIGH";

  if (signal.trend === "SIDEWAYS") {
    risk = "HIGH";
  } else if (Math.abs(score) >= 6) {
    risk = "LOW";
  } else {
    risk = "MEDIUM";
  }

  // =====================================================
  // TRADE QUALITY
  // =====================================================

  let tradeQuality: string;

  if (
    decision !== "HOLD" &&
    confidence >= 80 &&
    risk === "LOW"
  ) {
    tradeQuality = "EXCELLENT";
  } else if (
    decision !== "HOLD" &&
    confidence >= 70
  ) {
    tradeQuality = "GOOD";
  } else if (decision === "HOLD") {
    tradeQuality = "WAIT";
  } else {
    tradeQuality = "WEAK";
  }

  // =====================================================
  // HOLDING PERIOD
  // =====================================================

  let holdingPeriod: string;

  if (signal.trend === "UPTREND") {
    holdingPeriod = "SWING";
  } else if (signal.trend === "DOWNTREND") {
    holdingPeriod = "SWING";
  } else {
    holdingPeriod = "WAIT";
  }

  // =====================================================
  // ENTRY / TARGET / STOP LOSS
  //
  // IMPORTANT:
  // Current price is not available inside MarketSignal yet.
  // Therefore we deliberately keep these at 0.
  // We will add real price + ATR based risk management
  // in the next step.
  // =====================================================

  const entry = 0;
  const target = 0;
  const stopLoss = 0;

  // =====================================================
  // AI SUMMARY
  // =====================================================

  let aiSummary = "";

  if (decision === "BUY") {
    aiSummary =
      `Bullish setup detected with ${confidence}% confidence. ` +
      `Trend and momentum factors support BUY.`;
  } else if (decision === "SELL") {
    aiSummary =
      `Bearish setup detected with ${confidence}% confidence. ` +
      `Trend and momentum factors support SELL.`;
  } else {
    aiSummary =
      "Market conditions are mixed. Waiting for stronger confirmation.";
  }

  // =====================================================
  // INVALIDATION
  // =====================================================

  const invalidIf =
    decision === "BUY"
      ? "Bullish trend structure breaks"
      : decision === "SELL"
      ? "Bearish trend structure breaks"
      : "No confirmed directional setup";

  // =====================================================
  // FINAL RESULT
  // =====================================================

  return {
    symbol,
    decision,
    confidence,
    risk,

    entry,

    support1: null,
    support2: null,
    resistance1: null,
    resistance2: null,

    target,
    target1: target,
    target2: target,

    stopLoss,

    tradeQuality,
    holdingPeriod,

    aiSummary,

    reasons,

    invalidIf,
  };
}
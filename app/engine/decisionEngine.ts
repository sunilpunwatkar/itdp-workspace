import { MarketSignal } from "../types/marketSignal";
import { AnalysisResult } from "../types/analysis";

export function analyzeStock(
  symbol: string,
  signal: MarketSignal
): AnalysisResult {

  let score = 0;

  // EMA
  if (signal.emaSignal === "BUY") score++;
  if (signal.emaSignal === "SELL") score--;

  // RSI
  if (signal.rsiSignal === "BUY") score++;
  if (signal.rsiSignal === "SELL") score--;

  // MACD
  if (signal.macdSignal === "BUY") score++;
  if (signal.macdSignal === "SELL") score--;

  let decision: "BUY" | "SELL" | "HOLD";

  if (score >= 2)
    decision = "BUY";
  else if (score <= -2)
    decision = "SELL";
  else
    decision = "HOLD";

  return {
    symbol,

    decision,

    confidence: Math.abs(score) * 25 + 25,

    risk:
      decision === "BUY"
        ? "LOW"
        : decision === "SELL"
        ? "HIGH"
        : "MEDIUM",

    entry: signal.ema20,

    target: 0,

    stopLoss: 0,

    reasons: [
      `EMA : ${signal.emaSignal}`,
      `RSI : ${signal.rsiSignal}`,
      `MACD : ${signal.macdSignal}`,
      `Score : ${score}`,
    ],

    invalidIf: "Price closes below stop loss",
  };
}
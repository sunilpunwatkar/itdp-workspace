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
  confidence,
  risk,
  entry,
  target,
  target1: target,
  target2: target,
  stopLoss,
  tradeQuality: "-",
  holdingPeriod: "-",
  aiSummary: "",
  reasons,
  invalidIf,
};}
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

  const confidence = Math.abs(score) * 25 + 50;

const risk =
  decision === "BUY"
    ? "LOW"
    : decision === "SELL"
    ? "HIGH"
    : "MEDIUM";

const entry = 0;
const target = 0;
const stopLoss = 0;

const reasons = [
  `EMA : ${signal.emaSignal}`,
  `RSI : ${signal.rsiSignal}`,
  `MACD : ${signal.macdSignal}`,
];

const invalidIf = "-";

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
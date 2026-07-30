import { MarketSignal } from "../services/marketSignalService";
import { AnalysisResult } from "../types/analysis";

export function analyzeStock(
  symbol: string,
  signal: MarketSignal
): AnalysisResult {
  return {
    symbol,

    decision: signal.emaSignal,

    confidence: 75,

    risk: "MEDIUM",

    entry: signal.ema20,
    target: 0,
    stopLoss: 0,

    reasons: [
      `EMA Signal: ${signal.emaSignal}`,
      `RSI Signal: ${signal.rsiSignal}`,
      `RSI Value: ${signal.rsi}`,
    ],

    invalidIf: "Price closes below stop loss",
  };
}
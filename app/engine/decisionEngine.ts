import { AnalysisResult } from "../types/analysis";

export function analyzeStock(symbol: string): AnalysisResult {
  return {
    symbol,

    decision: "BUY",

    confidence: 91,

    risk: "LOW",

    entry: 3200,

    target: 3450,

    stopLoss: 3100,

    reasons: [
      "EMA Bullish",
      "RSI Above 60",
      "MACD Positive",
      "Strong Volume",
    ],

    invalidIf: "Price closes below Stop Loss",
  };
}
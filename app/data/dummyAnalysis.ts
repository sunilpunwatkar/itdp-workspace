import { AnalysisResult } from "../types/analysis";

export const dummyAnalysis: AnalysisResult = {
  symbol: "RELIANCE",

  decision: "BUY",

  confidence: 91,

  risk: "LOW",

  entry: 3180,

  target: 3520,

  stopLoss: 2980,

  reasons: [
    "Breakout Confirmed",
    "RSI Above 60",
    "Strong Volume",
  ],

  invalidIf: "Price closes below ₹2980",
};
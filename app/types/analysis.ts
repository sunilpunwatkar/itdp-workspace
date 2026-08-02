export type DecisionType = "BUY" | "SELL" | "HOLD";

export interface AnalysisResult {
  symbol: string;

  decision: DecisionType;

  confidence: number;

  risk: "LOW" | "MEDIUM" | "HIGH";

  entry: number;

  target: number;

  target1: number;

  target2: number;

  stopLoss: number;

  tradeQuality: string;

  holdingPeriod: string;

  aiSummary: string;

  reasons: string[];

  invalidIf: string;
}
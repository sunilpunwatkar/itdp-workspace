export type DecisionType = "BUY" | "SELL" | "HOLD";

export interface AnalysisResult {
  symbol: string;
  decision: DecisionType;
  confidence: number;
  risk: "LOW" | "MEDIUM" | "HIGH";
  entry: number;
  target: number;
  stopLoss: number;
  reasons: string[];
  invalidIf: string;
}
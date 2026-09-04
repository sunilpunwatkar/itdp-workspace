export type DecisionType = "BUY" | "SELL" | "HOLD";
export interface DecisionEngineResult {
  symbol: string;

  decision: DecisionType;

  confidence: number;

  risk: "LOW" | "MEDIUM" | "HIGH";

  entryContext: "FAVORABLE" | "CAUTION" | "UNFAVORABLE";

  entry: number;

  target: number;

  target1: number;

  support1: number | null;

  support2: number | null;

  resistance1: number | null;

  resistance2: number | null;

  target2: number;

  stopLoss: number;

  tradeQuality: string;

  holdingPeriod: string;

  aiSummary: string;

  reasons: string[];

  invalidIf: string;
}
export interface AnalysisResult {
  symbol: string;

  decision: DecisionType;

  confidence: number;

  risk: "LOW" | "MEDIUM" | "HIGH";

  entryContext: "FAVORABLE" | "CAUTION" | "UNFAVORABLE";

  entry: number;

  target: number;

  target1: number;

  support1: number | null;

  support2: number | null;

  resistance1: number | null;

  resistance2: number | null;

  target2: number;

  stopLoss: number;

  riskReward: string;

  capital: number;

  riskPercent: number;

  maxRisk: number;

  quantity: number;

  tradeQuality: string;

  holdingPeriod: string;

  aiSummary: string;

  reasons: string[];

  invalidIf: string;
}
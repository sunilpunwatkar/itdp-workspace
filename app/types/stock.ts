export type StockQuote = {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
};

export type DecisionAnalysis = {
  symbol: string;
  decision: "BUY" | "SELL" | "HOLD" | "NO DATA";
  confidence: number;
  risk: "LOW" | "MEDIUM" | "HIGH";
  target: number;
  stopLoss: number;
  reason: string[];
  invalidIf: string;
};
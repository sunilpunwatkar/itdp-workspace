import { dummyAnalysis } from "../data/dummyAnalysis";

export function analyzeStock(symbol: string) {
  return {
    ...dummyAnalysis,
    symbol: symbol.toUpperCase(),
  };
}
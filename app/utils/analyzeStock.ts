import { dummyAnalysis } from "../data/dummyAnalysis";

export function analyzeStock(symbol: string) {
  const key = symbol.toUpperCase().trim();

  return (
    dummyAnalysis[key as keyof typeof dummyAnalysis] ?? {
      symbol: key,
      decision: "NO DATA",
      confidence: 0,
      risk: "-",
      target: 0,
      stopLoss: 0,
      reason: ["Stock not found in demo database."],
      invalidIf: "-",
    }
  );
}
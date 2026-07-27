import { YahooProvider } from "../../providers/yahooProvider";
import { analyzeStock } from "../../engine/decisionEngine";
import { AnalysisResult } from "../../types/analysis";

const provider = new YahooProvider();

export async function getStockAnalysis(
  symbol: string
): Promise<AnalysisResult> {

  // Live Quote
  const quote = await provider.getQuote(symbol);

  // AI Decision
  const analysis = analyzeStock(symbol);

  // Merge Quote + Decision
  return {
    ...analysis,

    entry: quote.price,

    target: quote.price * 1.05,

    stopLoss: quote.price * 0.97,
  };
}
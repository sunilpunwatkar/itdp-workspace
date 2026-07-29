import { YahooProvider } from "../app/providers/yahooProvider";
import { HistoricalProvider } from "../app/providers/historicalProvider";
import { analyzeStock } from "../app/engine/decisionEngine";
import { AnalysisResult } from "../app/types/analysis";

const yahoo = new YahooProvider();
const historical = new HistoricalProvider();

export async function getStockAnalysis(
  symbol: string
): Promise<AnalysisResult> {
  const quote = await yahoo.getQuote(symbol);

  await historical.getHistoricalPrices(symbol);

  const result = analyzeStock(symbol);

  return {
    ...result,
    entry: quote.price,
  };
}
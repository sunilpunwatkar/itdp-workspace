import { YahooProvider } from "../app/providers/yahooProvider";
import { HistoricalProvider } from "../app/providers/historicalProvider";
import { analyzeStock } from "../app/utils/analyzeStock";
import { AnalysisResult } from "../app/types/analysis";
import { calculateEMAValues } from "../app/services/emaService";

const yahoo = new YahooProvider();
const historical = new HistoricalProvider();

export async function getStockAnalysis(
  symbol: string
): Promise<AnalysisResult> {

  // Live Quote
  const quote = await yahoo.getQuote(symbol);

  // Historical Prices
  const prices = await historical.getHistoricalPrices(symbol);

  // EMA Calculation
  const ema = calculateEMAValues(prices);

  console.log("EMA Values:", ema);

  // Decision Engine
  const result = analyzeStock(symbol);

  return {
    ...result,
    entry: quote.price,
  };
}
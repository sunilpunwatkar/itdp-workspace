import { YahooProvider } from "../app/providers/yahooProvider";
import { HistoricalProvider } from "../app/providers/historicalProvider";
import { analyzeStock } from "../app/engine/decisionEngine";
import { AnalysisResult } from "../app/types/analysis";
import { calculateEMAValues } from "../app/services/emaService";
import { calculateRSIValues } from "../app/services/rsiService";
import { buildMarketSignal } from "../app/services/marketSignalService";

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

// RSI Calculation
const rsi = calculateRSIValues(prices);

console.log("RSI:", rsi);

// Market Signal
console.log("Prices Array Length:", prices.length);

const signal = buildMarketSignal(prices);

console.log("Market Signal:", signal);

// Decision Engine
const result = analyzeStock(symbol, signal);

  return {
  ...result,
  entry: quote.price,
  target:
    result.decision === "BUY"
      ? quote.price * 1.05
      : quote.price * 0.95,
  stopLoss:
    result.decision === "BUY"
      ? quote.price * 0.98
      : quote.price * 1.02,
};
}
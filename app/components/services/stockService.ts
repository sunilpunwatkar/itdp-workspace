import { YahooProvider } from "../../providers/yahooProvider";

import { analyzeStock } from "../../engine/decisionEngine";
import { AnalysisResult } from "../../types/analysis";

const provider = new YahooProvider();

export async function getStockAnalysis(
  symbol: string
): Promise<AnalysisResult> {

  // Live Quote
  const quote = await provider.getQuote(symbol);

  // Historical Data via Server API
const historyResponse = await fetch(
  `/api/history?symbol=${symbol}`
);

if (!historyResponse.ok) {
  throw new Error("Historical API failed");
}

const historyData = await historyResponse.json();

const closes = historyData.prices;

console.log("Historical Close Prices:", closes);

  // AI Decision
  const analysis = analyzeStock(symbol);

  return {
    ...analysis,

    entry: quote.price,

    target: quote.price * 1.05,

    stopLoss: quote.price * 0.97,
  };
}
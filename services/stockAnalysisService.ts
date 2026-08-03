import { YahooProvider } from "../app/providers/yahooProvider";
import { HistoricalProvider } from "../app/providers/historicalProvider";
import { analyzeStock } from "../app/engine/decisionEngine";
import { AnalysisResult } from "../app/types/analysis";
import { calculateEMAValues } from "../app/services/emaService";
import { calculateRSIValues } from "../app/services/rsiService";
import { buildMarketSignal } from "../app/services/marketSignalService";
import { calculateATRValues } from "../app/services/atrService";
import { buildRiskPlan } from "../app/services/riskEngine";
import { calculatePositionSize } from "../app/services/positionSizingService";
import { buildTradePlan } from "../app/services/tradePlannerService";
import { resolveSymbol } from "../app/services/symbolResolver";

const yahoo = new YahooProvider();
const historical = new HistoricalProvider();

export async function getStockAnalysis(
  symbol: string
): Promise<AnalysisResult> {
  const resolvedSymbol = resolveSymbol(symbol);

console.log("Resolved Symbol:", resolvedSymbol);

  // Live Quote
  const quote = await yahoo.getQuote(resolvedSymbol);
  console.log("QUOTE OBJECT:", quote);

  // Historical Prices
  const prices = await historical.getHistoricalPrices(resolvedSymbol);

  // EMA Calculation
const ema = calculateEMAValues(prices);

console.log("EMA Values:", ema);

// RSI Calculation
const rsi = calculateRSIValues(prices);

console.log("RSI:", rsi);

// ATR Calculation
const atr = calculateATRValues(prices);

console.log("ATR:", atr);


// Market Signal
console.log("Prices Array Length:", prices.length);

const signal = buildMarketSignal(prices);

console.log("Market Signal:", signal);

// Decision Engine
const result = analyzeStock(symbol, signal);


console.log("Decision Engine Result:", result);

const riskPlan = buildRiskPlan(
  quote.price,
  signal.atr,
  result.decision
);

console.log("Risk Plan:", riskPlan);
const position = calculatePositionSize(
  75000,
  2,
  quote.price,
  riskPlan.stopLoss
);

console.log("Position Size:", position);

const tradePlan = buildTradePlan(
  result.decision,
  quote.price,
  signal.atr,
  result.confidence
);

console.log("Trade Plan:", tradePlan);

 return {
  ...result,

  entry: quote.price,

  target: tradePlan.target1,

  target1: tradePlan.target1,

  target2: tradePlan.target2,

  stopLoss: riskPlan.stopLoss,

  tradeQuality: tradePlan.tradeQuality,

  holdingPeriod: tradePlan.holdingPeriod,

  aiSummary: tradePlan.aiSummary,

  reasons: [
    ...result.reasons,
    `Risk Reward : ${riskPlan.riskReward}`,
    `Capital : ₹${position.capital}`,
    `Max Risk : ₹${position.maxRisk}`,
    `Quantity : ${position.quantity} Shares`,
  ],

  invalidIf: result.invalidIf,
};
}
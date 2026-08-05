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
import { resolveUniversalSymbol } from "../app/services/universalSymbolEngine";

const yahoo = new YahooProvider();
const historical = new HistoricalProvider();

export async function getStockAnalysis(
  symbol: string
): Promise<AnalysisResult> {
  const resolvedSymbol = resolveUniversalSymbol(symbol);

console.log(
  `USI Engine : ${symbol} -> ${resolvedSymbol}`
);

  // Live Quote
  // ================================
// Parallel Fetch
// ================================

const [quote, prices] = await Promise.all([
  yahoo.getQuote(resolvedSymbol),
  historical.getHistoricalPrices(resolvedSymbol),
]);

console.log("QUOTE OBJECT:", quote);
console.log("Prices Length:", prices.length);

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
const result = analyzeStock(resolvedSymbol, signal);


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
  riskPlan.stopLoss ?? quote.price
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

  target: riskPlan.target1 ?? 0,

target1: riskPlan.target1 ?? 0,

target2: riskPlan.target2 ?? 0,

  stopLoss: riskPlan.stopLoss ?? 0,
  
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
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
import { getMarketData } from "../app/services/marketDataEngine";

export async function getStockAnalysis(
  symbol: string
): Promise<AnalysisResult> {

  console.time("⏱ TOTAL ANALYSIS");

  const resolvedSymbol =
    resolveUniversalSymbol(symbol);

  console.log(
    `USI Engine : ${symbol} -> ${resolvedSymbol}`
  );

  // =====================================
  // Market Data
  // =====================================

  console.time("⏱ MarketData");

  const market =
    await getMarketData(symbol);

  console.timeEnd("⏱ MarketData");

  const quote = market.quote;
  const prices = market.prices;

  console.log("QUOTE OBJECT:", quote);
  console.log("Prices Length:", prices.length);

  // =====================================
  // EMA
  // =====================================

  console.time("⏱ EMA");

  const ema =
    calculateEMAValues(prices);

  console.timeEnd("⏱ EMA");

  console.log("EMA Values:", ema);

  // =====================================
  // RSI
  // =====================================

  console.time("⏱ RSI");

  const rsi =
    calculateRSIValues(prices);

  console.timeEnd("⏱ RSI");

  console.log("RSI:", rsi);

  // =====================================
  // ATR
  // =====================================

  console.time("⏱ ATR");

  const atr =
    calculateATRValues(prices);

  console.timeEnd("⏱ ATR");

  console.log("ATR:", atr);

  // =====================================
  // Market Signal
  // =====================================

  console.time("⏱ MarketSignal");

  console.log(
    "Prices Array Length:",
    prices.length
  );

  const signal =
  buildMarketSignal(
    ema,
    rsi,
    atr,
    prices
  );

  console.timeEnd("⏱ MarketSignal");

  console.log(
    "Market Signal:",
    signal
  );

  // =====================================
  // Decision Engine
  // =====================================

  console.time("⏱ DecisionEngine");

  const result =
    analyzeStock(
      resolvedSymbol,
      signal
    );

  console.timeEnd("⏱ DecisionEngine");

  console.log(
    "Decision Engine Result:",
    result
  );

  // =====================================
  // Risk Plan
  // =====================================

  console.time("⏱ RiskPlan");

  const riskPlan =
    buildRiskPlan(
      quote.price,
      signal.atr,
      result.decision
    );

  console.timeEnd("⏱ RiskPlan");

  console.log(
    "Risk Plan:",
    riskPlan
  );

  // =====================================
  // Position Size
  // =====================================

  console.time("⏱ PositionSize");

  const position =
    calculatePositionSize(
      75000,
      2,
      quote.price,
      riskPlan.stopLoss ??
        quote.price
    );

  console.timeEnd("⏱ PositionSize");

  console.log(
    "Position Size:",
    position
  );

  // =====================================
  // Trade Plan
  // =====================================

  console.time("⏱ TradePlan");

  const tradePlan =
    buildTradePlan(
      result.decision,
      quote.price,
      signal.atr,
      result.confidence
    );

  console.timeEnd("⏱ TradePlan");

  console.log(
    "Trade Plan:",
    tradePlan
  );

  // =====================================
  // Final Result
  // =====================================

  const finalResult = {
    ...result,

    entry: quote.price,

    target:
      riskPlan.target1 ?? 0,

    target1:
      riskPlan.target1 ?? 0,

    target2:
      riskPlan.target2 ?? 0,

    stopLoss:
      riskPlan.stopLoss ?? 0,

    tradeQuality:
      tradePlan.tradeQuality,

    holdingPeriod:
      tradePlan.holdingPeriod,

    aiSummary:
      tradePlan.aiSummary,

    reasons: [
      ...result.reasons,

      `Risk Reward : ${riskPlan.riskReward}`,

      `Capital : ₹${position.capital}`,

      `Max Risk : ₹${position.maxRisk}`,

      `Quantity : ${position.quantity} Shares`,
    ],

    invalidIf:
      result.invalidIf,
  };

  console.timeEnd("⏱ TOTAL ANALYSIS");

  return finalResult;
}
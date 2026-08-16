import { analyzeStock } from "../app/engine/decisionEngine";
import { AnalysisResult } from "../app/types/analysis";
import { CandleData } from "../app/types/chart";
import { calculateEMAValues } from "../app/services/emaService";
import { calculateRSIValues } from "../app/services/rsiService";
import { buildMarketSignal } from "../app/services/marketSignalService";
import { calculateATRValues } from "../app/services/atrService";
import { buildRiskPlan } from "../app/services/riskEngine";
import { calculatePositionSize } from "../app/services/positionSizingService";
import { buildTradePlan } from "../app/services/tradePlannerService";
import { resolveUniversalSymbol } from "../app/services/universalSymbolEngine";
import { getMarketData } from "../app/services/marketDataEngine";
import { calculateSupportResistance } from "../app/services/supportResistanceService";
import { buildChartData } from "../app/services/chartDataService";
import { calculatePriceStructure } from "../app/services/priceStructureService";


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

    const candles: CandleData[] =
    buildChartData(
      market.ohlc.timestamps,
      market.ohlc.open,
      market.ohlc.high,
      market.ohlc.low,
      market.ohlc.close,
      market.ohlc.volume
    );

  const supportResistance =
    calculateSupportResistance(candles);

  console.log(
    "Support Resistance:",
    supportResistance
  );
    // =====================================
  // Price Structure
  // =====================================

  console.time("⏱ PriceStructure");

  const priceStructure =
    calculatePriceStructure(
      quote.price,
      supportResistance.support1,
      supportResistance.resistance1
    );

  console.timeEnd("⏱ PriceStructure");

  console.log(
    "Price Structure:",
    priceStructure
  );

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
  signal,
  supportResistance,
  priceStructure
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
    result.decision,
    supportResistance.support1,
    supportResistance.support2,
    supportResistance.resistance1,
    supportResistance.resistance2
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
  riskPlan.stopLoss !== null
    ? calculatePositionSize(
        75000,
        2,
        quote.price,
        riskPlan.stopLoss
      )
    : {
        capital: 75000,
        riskPercent: 2,
        maxRisk: 1500,
        quantity: 0,
      };
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

    support1:
      supportResistance.support1 ?? 0,

    support2:
      supportResistance.support2 ?? 0,

    resistance1:
      supportResistance.resistance1 ?? 0,

    resistance2:
      supportResistance.resistance2 ?? 0,

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
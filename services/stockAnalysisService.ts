import { calculateDirectionIntelligence } from "../app/services/directionIntelligenceService";
import { calculateMomentumIntelligence } from "../app/services/momentumIntelligenceService";
import { calculatePriceLocationIntelligence } from "../app/services/priceLocationIntelligenceService";
import { calculateEvidenceSynthesis } from "../app/services/evidenceSynthesisService";
import { calculateConflictEngine } from "../app/services/conflictEngineService";
import { calculateFinalDecision } from "../app/services/finalDecisionIntelligenceService";
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
import { MarketProvider } from "../app/providers/marketProvider";
import { calculateSupportResistance } from "../app/services/supportResistanceService";
import { buildChartData } from "../app/services/chartDataService";
import { calculatePriceStructure } from "../app/services/priceStructureService";
import {
  calculateEntryContextIntelligence,
} from "../app/services/entryContextIntelligenceService";
import {
  calculateRiskGateIntelligence,
} from "../app/services/riskGateIntelligenceService";


export async function getStockAnalysis(
  symbol: string,
  marketProvider?: MarketProvider
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
  await getMarketData(
    symbol,
    marketProvider
  );

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
  // FINAL DECISION INTELLIGENCE PIPELINE
  // =====================================

  console.time("⏱ Final Decision Intelligence");

  // -------------------------------------
  // Direction Intelligence
  // -------------------------------------

  const direction =
    calculateDirectionIntelligence(
      ema.ema20,
      ema.ema50,
      ema.ema200,
      atr.atr
    );

  console.log(
    "Direction Intelligence:",
    direction
  );

  // -------------------------------------
  // Momentum Intelligence
  // -------------------------------------

  const momentum =
    calculateMomentumIntelligence(
      rsi.rsi,
      signal.macdSignal,
      signal.histogram
    );

  console.log(
    "Momentum Intelligence:",
    momentum
  );

  // -------------------------------------
  // Price Location Intelligence
  // -------------------------------------

  const location =
    calculatePriceLocationIntelligence(
      quote.price,
      supportResistance.support1,
      supportResistance.resistance1,
      atr.atr
    );

  console.log(
    "Price Location Intelligence:",
    location
  );

  // -------------------------------------
  // Evidence Synthesis
  // -------------------------------------

  const evidence =
    calculateEvidenceSynthesis(
      direction.direction,
      momentum.momentumDirection,
      momentum.momentumStrength,
      momentum.agreement,
      location.location,
      location.locationQuality
    );

  console.log(
    "Evidence Synthesis:",
    evidence
  );

  // -------------------------------------
  // Conflict Engine
  // -------------------------------------

  const conflict =
    calculateConflictEngine(
      direction.direction,
      direction.evidence,
      momentum.momentumDirection,
      momentum.momentumStrength,
      momentum.agreement,
      location.location,
      location.locationQuality,
      evidence.overallEvidence,
      evidence.evidenceStrength,
      evidence.evidenceAlignment
    );

  console.log(
    "Conflict Engine:",
    conflict
  );

  // -------------------------------------
  // Final Decision
  // -------------------------------------

  const finalDecision =
    calculateFinalDecision({
      direction: direction.direction,
      momentumDirection: momentum.momentumDirection,
      momentumStrength: momentum.momentumStrength,
      momentumAgreement: momentum.agreement,

      location: location.location,
      locationQuality: location.locationQuality,

      overallEvidence: evidence.overallEvidence,
      evidenceStrength: evidence.evidenceStrength,
      evidenceAlignment: evidence.evidenceAlignment,

      conflictStatus: conflict.conflictStatus,
      conflictCount: conflict.conflictCount,
      conflictSeverity: conflict.conflictSeverity,
      reliabilityImpact: conflict.reliabilityImpact,
    });

  console.log(
    "FINAL DECISION INTELLIGENCE:",
    finalDecision
  );

  console.timeEnd("⏱ Final Decision Intelligence");

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
  // ENTRY CONTEXT INTELLIGENCE
  // =====================================

  console.time("⏱ EntryContext Intelligence");

  const entryContextResult =
    calculateEntryContextIntelligence({
      decision: finalDecision.decision,
      decisionStrength: finalDecision.decisionStrength,
      decisionQuality: finalDecision.decisionQuality,
      location: location.location,
      locationQuality: location.locationQuality,
      conflictSeverity: conflict.conflictSeverity,
      reliability: finalDecision.reliability,
    });

  const entryContext =
    entryContextResult.entryContext;

  console.timeEnd("⏱ EntryContext Intelligence");

  console.log(
    "ENTRY CONTEXT INTELLIGENCE:",
    entryContextResult
  );

  // =====================================
  // Risk Plan
  // =====================================

  console.time("⏱ RiskPlan");

  const riskPlan =
  buildRiskPlan(
    quote.price,
    signal.atr,
    finalDecision.decision,
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
    console.time("⏱ RiskGate");

  const riskGate =
    calculateRiskGateIntelligence({
      decision: finalDecision.decision,
      entryContext,
      conflictSeverity: conflict.conflictSeverity,
      reliability: finalDecision.reliability,
      decisionQuality: finalDecision.decisionQuality,

      entry: quote.price,
      stopLoss: riskPlan.stopLoss ?? NaN,
      target1: riskPlan.target1 ?? NaN,
      riskReward: riskPlan.riskRewardRatio ?? NaN,
      quantity: position.quantity,
    });

  console.timeEnd("⏱ RiskGate");

  console.log(
    "Risk Gate Intelligence:",
    riskGate
  );

  // =====================================
  // Trade Plan
  // =====================================

  console.time("⏱ TradePlan");

    const tradePlan =
    buildTradePlan(
    finalDecision.decision,
    result.confidence,
    entryContext
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
            decision:
      finalDecision.decision,

    finalDecision:
      finalDecision,

    decisionStrength:
      finalDecision.decisionStrength,

    decisionQuality:
      finalDecision.decisionQuality,

    decisionEvidence:
      finalDecision.evidence,

    decisionConflict:
      finalDecision.conflict,

    decisionReliability:
  finalDecision.reliability,

conflictSeverity:
  conflict.conflictSeverity,

riskGate:
  riskGate,

            riskReward:
      riskPlan.riskReward,

    capital:
      position.capital,

    riskPercent:
      position.riskPercent,

    maxRisk:
      position.maxRisk,

    quantity:
      position.quantity,

    entryContext,

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
      finalDecision.invalidIf.join(" | "),
  };

  console.timeEnd("⏱ TOTAL ANALYSIS");

  return finalResult;
}

import { analyzeStock } from "../app/engine/decisionEngine";
import { buildRiskPlan } from "../app/services/riskEngine";
import { calculatePositionSize } from "../app/services/positionSizingService";
import { buildTradePlan } from "../app/services/tradePlannerService";

const entry = 1310;
const atr = 10;

const supportResistance = {
  support1: 1280,
  support2: 1260,
  resistance1: 1370,
  resistance2: 1400,
};

const priceStructure = {
  structure: "NEAR_SUPPORT" as const,
  distanceToSupport1: 30,
  distanceToResistance1: 60,
};

const buySignal = {
  ema20: 1350,
  ema50: 1330,
  ema200: 1300,
  emaSignal: "BUY" as const,

  rsi: 65,
  rsiSignal: "BUY" as const,

  atr,

  macd: 8,
  signal: 5,
  histogram: 3,
  macdSignal: "BUY" as const,

  trend: "UPTREND" as const,
};

console.log("=== CONTROLLED FULL BUY PIPELINE ===");

// 1. Decision
const decision = analyzeStock(
  "TEST.BUY",
  buySignal,
  supportResistance,
  priceStructure
);

console.log("Decision:", {
  decision: decision.decision,
  confidence: decision.confidence,
  risk: decision.risk,
});

// 2. Risk Plan
const riskPlan = buildRiskPlan(
  entry,
  atr,
  decision.decision,
  supportResistance.support1,
  supportResistance.support2,
  supportResistance.resistance1,
  supportResistance.resistance2
);

console.log("Risk Plan:", riskPlan);

// 3. Position Size
const position =
  riskPlan.stopLoss !== null
    ? calculatePositionSize(
        75000,
        2,
        entry,
        riskPlan.stopLoss
      )
    : {
        capital: 75000,
        riskPercent: 2,
        maxRisk: 1500,
        quantity: 0,
      };

console.log("Position Size:", position);

// 4. Trade Plan
const tradePlan = buildTradePlan(
  decision.decision,
  decision.confidence
);

console.log("Trade Plan:", tradePlan);

// 5. Final Check
console.log("=== FINAL CHECK ===");

console.log({
  decision: decision.decision,
  confidence: decision.confidence,
  entry,

  stopLoss: riskPlan.stopLoss,
  target1: riskPlan.target1,
  target2: riskPlan.target2,
  riskReward: riskPlan.riskReward,

  quantity: position.quantity,

  tradeQuality: tradePlan.tradeQuality,
  holdingPeriod: tradePlan.holdingPeriod,
});

import { buildRiskPlan } from "../app/services/riskEngine";
import { calculatePositionSize } from "../app/services/positionSizingService";
import { buildTradePlan } from "../app/services/tradePlannerService";

const entry = 1310;
const atr = 10;

const riskPlan = buildRiskPlan(
  entry,
  atr,
  "BUY",
  1280,
  1260,
  1370,
  1400
);

const position = calculatePositionSize(
  75000,
  2,
  entry,
  riskPlan.stopLoss ?? entry
);

const tradePlan = buildTradePlan(
  "BUY",
  85
);

console.log("=== FULL BUY PIPELINE TEST ===");
console.log("Risk Plan:", riskPlan);
console.log("Position Size:", position);
console.log("Trade Plan:", tradePlan);

console.log("=== FINAL CHECK ===");

console.log({
  entry,
  target1: riskPlan.target1,
  target2: riskPlan.target2,
  stopLoss: riskPlan.stopLoss,
  riskReward: riskPlan.riskReward,
  quantity: position.quantity,
  tradeQuality: tradePlan.tradeQuality,
  holdingPeriod: tradePlan.holdingPeriod
});

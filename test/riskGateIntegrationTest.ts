import { buildRiskPlan } from "../app/services/riskEngine";
import { calculatePositionSize } from "../app/services/positionSizingService";
import { calculateRiskGateIntelligence } from "../app/services/riskGateIntelligenceService";

function assert(
  condition: boolean,
  message: string
): void {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

console.log("=== RISK GATE INTEGRATION TEST ===");

// =====================================================
// BUY
// =====================================================

const buyEntry = 1310;

const buyRiskPlan = buildRiskPlan(
  buyEntry,
  10,
  "BUY",
  1280,
  1260,
  1370,
  1400
);

const buyPosition = calculatePositionSize(
  75000,
  2,
  buyEntry,
  buyRiskPlan.stopLoss ?? buyEntry
);

const buyGate = calculateRiskGateIntelligence({
  decision: "BUY",
  entryContext: "FAVORABLE",
  conflictSeverity: "NONE",
  reliability: "HIGH_RELIABILITY",
  decisionQuality: "HIGH",

  entry: buyEntry,
  stopLoss: buyRiskPlan.stopLoss ?? NaN,
  target1: buyRiskPlan.target1 ?? NaN,
  riskReward: buyRiskPlan.riskRewardRatio ?? NaN,
  quantity: buyPosition.quantity,
});

console.log("BUY Risk Gate:", buyGate);

assert(
  buyGate.status === "PASS",
  "BUY Risk Gate should PASS"
);

assert(
  buyGate.failures.length === 0,
  "BUY should have no critical failures"
);

assert(
  buyGate.warnings.length === 0,
  "BUY should have no warnings"
);


// =====================================================
// SELL
// =====================================================

const sellEntry = 1310;

const sellRiskPlan = buildRiskPlan(
  sellEntry,
  10,
  "SELL",
  1280,
  1260,
  1370,
  1400
);

const sellPosition = calculatePositionSize(
  75000,
  2,
  sellEntry,
  sellRiskPlan.stopLoss ?? sellEntry
);

const sellGate = calculateRiskGateIntelligence({
  decision: "SELL",
  entryContext: "FAVORABLE",
  conflictSeverity: "NONE",
  reliability: "HIGH_RELIABILITY",
  decisionQuality: "HIGH",

  entry: sellEntry,
  stopLoss: sellRiskPlan.stopLoss ?? NaN,
  target1: sellRiskPlan.target1 ?? NaN,
  riskReward: sellRiskPlan.riskRewardRatio ?? NaN,
  quantity: sellPosition.quantity,
});

console.log("SELL Risk Gate:", sellGate);

assert(
  sellGate.status === "PASS",
  "SELL Risk Gate should PASS"
);

assert(
  sellGate.failures.length === 0,
  "SELL should have no critical failures"
);

assert(
  sellGate.warnings.length === 0,
  "SELL should have no warnings"
);


// =====================================================
// HOLD
// =====================================================

const holdEntry = 1310;

const holdRiskPlan = buildRiskPlan(
  holdEntry,
  10,
  "HOLD",
  1280,
  1260,
  1370,
  1400
);

const holdPosition = calculatePositionSize(
  75000,
  2,
  holdEntry,
  holdRiskPlan.stopLoss ?? holdEntry
);

const holdGate = calculateRiskGateIntelligence({
  decision: "HOLD",
  entryContext: "UNFAVORABLE",
  conflictSeverity: "NONE",
  reliability: "HIGH_RELIABILITY",
  decisionQuality: "LOW",

  entry: holdEntry,
  stopLoss: holdRiskPlan.stopLoss ?? NaN,
  target1: holdRiskPlan.target1 ?? NaN,
  riskReward: holdRiskPlan.riskRewardRatio ?? NaN,
  quantity: holdPosition.quantity,
});

console.log("HOLD Risk Gate:", holdGate);

assert(
  holdGate.status === "BLOCK",
  "HOLD Risk Gate should BLOCK"
);

assert(
  holdGate.failures.length > 0,
  "HOLD should have critical failures"
);

console.log("");
console.log("Passed: BUY + SELL + HOLD Risk Gate integration checks");
console.log("ALL RISK GATE INTEGRATION TESTS PASSED");
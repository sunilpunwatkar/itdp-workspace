import { buildRiskPlan } from "../app/services/riskEngine";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

console.log("=== RISK ENGINE V2 CONTRACT TEST ===");

// =====================================================
// BUY
// =====================================================

const buy = buildRiskPlan(
  1300,
  8.5,
  "BUY",
  1282.51,
  1270,
  1351.24,
  1364.98
);

console.log("BUY:", buy);

assert(
  buy.stopLoss === 1282.51,
  "BUY stopLoss changed"
);

assert(
  buy.target1 === 1351.24,
  "BUY target1 changed"
);

assert(
  buy.target2 === 1364.98,
  "BUY target2 changed"
);

assert(
  buy.riskReward === "1 : 2.93",
  "BUY riskReward string changed"
);

assert(
  "riskRewardRatio" in buy,
  "BUY riskRewardRatio field missing"
);

assert(
  buy.riskRewardRatio === 2.93,
  "BUY riskRewardRatio should be 2.93"
);

// =====================================================
// SELL
// =====================================================

const sell = buildRiskPlan(
  1300,
  8.5,
  "SELL",
  1268.76,
  1255.02,
  1337.49,
  1350
);

console.log("SELL:", sell);

assert(
  sell.stopLoss === 1337.49,
  "SELL stopLoss changed"
);

assert(
  sell.target1 === 1243.76,
  "SELL target1 changed"
);

assert(
  sell.target2 === 1225.02,
  "SELL target2 changed"
);

assert(
  sell.riskReward === "1 : 1.50",
  "SELL riskReward string changed"
);

assert(
  "riskRewardRatio" in sell,
  "SELL riskRewardRatio field missing"
);

assert(
  sell.riskRewardRatio === 1.5,
  "SELL riskRewardRatio should be 1.5"
);

// =====================================================
// HOLD
// =====================================================

const hold = buildRiskPlan(
  1300,
  8.5,
  "HOLD",
  1282.51,
  1270,
  1351.24,
  1364.98
);

console.log("HOLD:", hold);

assert(
  hold.stopLoss === null,
  "HOLD stopLoss should be null"
);

assert(
  hold.target1 === null,
  "HOLD target1 should be null"
);

assert(
  hold.target2 === null,
  "HOLD target2 should be null"
);

assert(
  hold.riskReward === "-",
  "HOLD riskReward string should remain '-'"
);

assert(
  "riskRewardRatio" in hold,
  "HOLD riskRewardRatio field missing"
);

assert(
  hold.riskRewardRatio === null,
  "HOLD riskRewardRatio should be null"
);

console.log("");
console.log("Passed: BUY + SELL + HOLD contract checks");
console.log("ALL RISK ENGINE V2 CONTRACT TESTS PASSED");

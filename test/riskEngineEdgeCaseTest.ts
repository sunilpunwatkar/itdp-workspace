import { buildRiskPlan } from "../app/services/riskEngine";

console.log("=== RISK ENGINE EDGE CASE TEST ===");

// TEST 1 — BUY with good R:R
console.log("\nTEST 1 — BUY GOOD R:R");

console.log(
  buildRiskPlan(
    1310,
    10,
    "BUY",
    1280,
    1260,
    1370,
    1400
  )
);

// TEST 2 — SELL with good R:R
console.log("\nTEST 2 — SELL GOOD R:R");

console.log(
  buildRiskPlan(
    1310,
    10,
    "SELL",
    1250,
    1240,
    1340,
    1380
  )
);

// TEST 3 — BUY with poor R:R
console.log("\nTEST 3 — BUY POOR R:R");

console.log(
  buildRiskPlan(
    1310,
    10,
    "BUY",
    1305,
    1300,
    1320,
    1330
  )
);

// TEST 4 — SELL with poor R:R
console.log("\nTEST 4 — SELL POOR R:R");

console.log(
  buildRiskPlan(
    1310,
    10,
    "SELL",
    1300,
    1290,
    1315,
    1320
  )
);

// TEST 5 — HOLD
console.log("\nTEST 5 — HOLD");

console.log(
  buildRiskPlan(
    1310,
    10,
    "HOLD",
    1280,
    1260,
    1370,
    1400
  )
);

// TEST 6 — BUY with null support
console.log("\nTEST 6 — BUY NULL SUPPORT");

console.log(
  buildRiskPlan(
    1310,
    10,
    "BUY",
    null,
    null,
    1370,
    1400
  )
);

// TEST 7 — SELL with null resistance
console.log("\nTEST 7 — SELL NULL RESISTANCE");

console.log(
  buildRiskPlan(
    1310,
    10,
    "SELL",
    1250,
    1240,
    null,
    null
  )
);

// TEST 8 — BUY with zero ATR
console.log("\nTEST 8 — BUY ZERO ATR");

console.log(
  buildRiskPlan(
    1310,
    0,
    "BUY",
    1280,
    1260,
    1370,
    1400
  )
);

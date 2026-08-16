import { buildRiskPlan } from "../app/services/riskEngine";

console.log("=== VALID BUY TEST ===");

console.log(
  buildRiskPlan(
    1310,
    10,
    "BUY",
    1280,
    1260,
    1350,
    1400
  )
);

console.log("=== VALID SELL TEST ===");

console.log(
  buildRiskPlan(
    1310,
    10,
    "SELL",
    1270,
    1250,
    1340,
    1380
  )
);

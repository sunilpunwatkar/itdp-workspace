import { buildRiskPlan } from "../app/services/riskEngine";

console.log("=== TRUE VALID BUY TEST ===");

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

console.log("=== TRUE VALID SELL TEST ===");

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

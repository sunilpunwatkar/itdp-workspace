import { buildRiskPlan } from "../app/services/riskEngine";

console.log("=== BUY TEST ===");

console.log(
  buildRiskPlan(
    1310,
    13.742867606026786,
    "BUY",
    1307,
    1297.5,
    1311.1,
    1319
  )
);

console.log("=== SELL TEST ===");

console.log(
  buildRiskPlan(
    1310,
    13.742867606026786,
    "SELL",
    1307,
    1297.5,
    1311.1,
    1319
  )
);

import { analyzeStock } from "../app/engine/decisionEngine";
import { buildTradePlan } from "../app/services/tradePlannerService";

function check(
  name: string,
  actual: string,
  expected: string
) {
  const pass = actual === expected;

  console.log(
    `${name}: ${pass ? "PASS" : "FAIL"}`
  );

  if (!pass) {
    console.log(`  Expected: ${expected}`);
    console.log(`  Actual:   ${actual}`);
  }

  return pass;
}

const supportResistance = {
  support1: 1286.9,
  support2: 1271.6,
  resistance1: 1288.7,
  resistance2: 1300.5,
};

const priceStructure = {
  structure: "NEAR_SUPPORT" as const,
  distanceToSupport1: 0.1,
  distanceToResistance1: 1.7,
};

const sellSignal = {
  ema20: 1305.79,
  ema50: 1310.27,
  ema200: 1358.06,
  emaSignal: "SELL" as const,

  rsi: 42.89,
  rsiSignal: "HOLD" as const,

  atr: 7.75,

  macd: -2.16,
  signal: 1.57,
  histogram: -3.73,
  macdSignal: "SELL" as const,

  trend: "DOWNTREND" as const,
};

console.log(
  "=== CONTROLLED CAUTION PIPELINE TEST ==="
);

const decision = analyzeStock(
  "TEST.CAUTION",
  sellSignal,
  supportResistance,
  priceStructure
);

const tradePlan = buildTradePlan(
  decision.decision,
  decision.confidence,
  decision.entryContext
);

let passed = 0;
let failed = 0;

if (
  check(
    "TEST 1: Decision",
    decision.decision,
    "SELL"
  )
) passed++;
else failed++;

if (
  check(
    "TEST 2: Entry Context",
    decision.entryContext ?? "UNDEFINED",
    "CAUTION"
  )
) passed++;
else failed++;

if (
  check(
    "TEST 3: Trade Quality",
    tradePlan.tradeQuality,
    "B"
  )
) passed++;
else failed++;

console.log("=== FINAL CHECK ===");

console.log({
  totalTests: passed + failed,
  passed,
  failed,
  allPassed: failed === 0,
});
import { analyzeStock } from "../app/engine/decisionEngine";

const supportResistance = {
  support1: 1280,
  support2: 1260,
  resistance1: 1370,
  resistance2: 1400,
};

const buySignal = {
  ema20: 1350,
  ema50: 1330,
  ema200: 1300,
  emaSignal: "BUY" as const,

  rsi: 65,
  rsiSignal: "BUY" as const,

  atr: 10,

  macd: 8,
  signal: 5,
  histogram: 3,
  macdSignal: "BUY" as const,

  trend: "UPTREND" as const,
};

console.log("=== CONTROLLED BUY DECISION TEST ===");

const result = analyzeStock(
  "TEST.BUY",
  buySignal,
  supportResistance
);

console.log(JSON.stringify(result, null, 2));

console.log("=== FINAL CHECK ===");

console.log({
  decision: result.decision,
  confidence: result.confidence,
  risk: result.risk,
  entry: result.entry,
  target1: result.target1,
  target2: result.target2,
  stopLoss: result.stopLoss,
});

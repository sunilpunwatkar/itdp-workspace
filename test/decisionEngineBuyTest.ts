import { analyzeStock } from "../app/engine/decisionEngine";

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

  atr: 10,

  macd: 8,
  signal: 5,
  histogram: 3,
  macdSignal: "BUY" as const,

  trend: "UPTREND" as const,
};

console.log("=== CONTROLLED BUY TEST ===");

console.log(
  analyzeStock(
    "TEST.BUY",
    buySignal,
    supportResistance,
    priceStructure
  )
);

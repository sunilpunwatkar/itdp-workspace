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

// =====================================================
// TEST 1 — CONTROLLED STRONG BUY
// =====================================================

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

console.log("=== TEST 1: CONTROLLED STRONG BUY ===");

const buyResult = analyzeStock(
  "TEST.BUY",
  buySignal,
  supportResistance,
  priceStructure
);

console.log({
  decision: buyResult.decision,
  confidence: buyResult.confidence,
  risk: buyResult.risk,
  primaryDirection: buyResult.reasons.find(
    (r) => r.startsWith("Primary Direction:")
  ),
});

// =====================================================
// TEST 2 — CONFLICTING BUY
// DOWNTREND + BEARISH EMA
// RSI + MACD + Histogram bullish
// BUY must be blocked
// =====================================================

const conflictingBuySignal = {
  ema20: 1250,
  ema50: 1300,
  ema200: 1350,
  emaSignal: "SELL" as const,

  rsi: 65,
  rsiSignal: "BUY" as const,

  atr: 10,

  macd: 8,
  signal: 5,
  histogram: 3,
  macdSignal: "BUY" as const,

  trend: "DOWNTREND" as const,
};

console.log("=== TEST 2: CONFLICTING BUY ===");

const conflictingResult = analyzeStock(
  "TEST.CONFLICT",
  conflictingBuySignal,
  supportResistance,
  priceStructure
);

console.log({
  decision: conflictingResult.decision,
  confidence: conflictingResult.confidence,
  risk: conflictingResult.risk,
  primaryDirection: conflictingResult.reasons.find(
    (r) => r.startsWith("Primary Direction:")
  ),
});

// =====================================================
// FINAL CHECK
// =====================================================

console.log("=== FINAL CHECK ===");

console.log({
  strongBuyMustBeBUY:
    buyResult.decision === "BUY",

  conflictingBuyMustNotBeBUY:
    conflictingResult.decision !== "BUY",
});

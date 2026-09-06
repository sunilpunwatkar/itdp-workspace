import {
  calculateEntryContextIntelligence,
} from "../app/services/entryContextIntelligenceService";

let passed = 0;
let failed = 0;

function test(
  name: string,
  actual: string,
  expected: string
) {
  if (actual === expected) {
    console.log(`PASS: ${name}`);
    passed++;
  } else {
    console.log(
      `FAIL: ${name} | Expected: ${expected} | Actual: ${actual}`
    );
    failed++;
  }
}

// 1. HOLD -> UNFAVORABLE
test(
  "HOLD decision",
  calculateEntryContextIntelligence({
    decision: "HOLD",
    decisionStrength: "WEAK",
    decisionQuality: "LOW",
    location: "NEAR_SUPPORT",
    locationQuality: "FAVORABLE",
    conflictSeverity: "NONE",
    reliability: "HIGH_RELIABILITY",
  }).entryContext,
  "UNFAVORABLE"
);

// 2. BUY + NEAR_SUPPORT -> FAVORABLE
test(
  "BUY near support",
  calculateEntryContextIntelligence({
    decision: "BUY",
    decisionStrength: "MODERATE",
    decisionQuality: "HIGH",
    location: "NEAR_SUPPORT",
    locationQuality: "FAVORABLE",
    conflictSeverity: "NONE",
    reliability: "HIGH_RELIABILITY",
  }).entryContext,
  "FAVORABLE"
);

// 3. BUY + NEAR_RESISTANCE -> CAUTION
test(
  "BUY near resistance",
  calculateEntryContextIntelligence({
    decision: "BUY",
    decisionStrength: "MODERATE",
    decisionQuality: "MEDIUM",
    location: "NEAR_RESISTANCE",
    locationQuality: "UNFAVORABLE",
    conflictSeverity: "NONE",
    reliability: "HIGH_RELIABILITY",
  }).entryContext,
  "CAUTION"
);

// 4. SELL + NEAR_RESISTANCE -> FAVORABLE
test(
  "SELL near resistance",
  calculateEntryContextIntelligence({
    decision: "SELL",
    decisionStrength: "MODERATE",
    decisionQuality: "HIGH",
    location: "NEAR_RESISTANCE",
    locationQuality: "FAVORABLE",
    conflictSeverity: "NONE",
    reliability: "HIGH_RELIABILITY",
  }).entryContext,
  "FAVORABLE"
);

// 5. SELL + NEAR_SUPPORT -> CAUTION
test(
  "SELL near support",
  calculateEntryContextIntelligence({
    decision: "SELL",
    decisionStrength: "MODERATE",
    decisionQuality: "MEDIUM",
    location: "NEAR_SUPPORT",
    locationQuality: "UNFAVORABLE",
    conflictSeverity: "NONE",
    reliability: "HIGH_RELIABILITY",
  }).entryContext,
  "CAUTION"
);

// 6. BUY + HIGH conflict -> UNFAVORABLE
test(
  "BUY with high conflict",
  calculateEntryContextIntelligence({
    decision: "BUY",
    decisionStrength: "STRONG",
    decisionQuality: "HIGH",
    location: "NEAR_SUPPORT",
    locationQuality: "FAVORABLE",
    conflictSeverity: "HIGH",
    reliability: "HIGH_RELIABILITY",
  }).entryContext,
  "UNFAVORABLE"
);

// 7. SELL + LOW reliability -> UNFAVORABLE
test(
  "SELL with low reliability",
  calculateEntryContextIntelligence({
    decision: "SELL",
    decisionStrength: "STRONG",
    decisionQuality: "HIGH",
    location: "NEAR_RESISTANCE",
    locationQuality: "FAVORABLE",
    conflictSeverity: "NONE",
    reliability: "LOW_RELIABILITY",
  }).entryContext,
  "UNFAVORABLE"
);

// 8. BUY + ABOVE_RESISTANCE + strong confirmation -> FAVORABLE
test(
  "BUY above resistance with strong confirmation",
  calculateEntryContextIntelligence({
    decision: "BUY",
    decisionStrength: "STRONG",
    decisionQuality: "HIGH",
    location: "ABOVE_RESISTANCE",
    locationQuality: "FAVORABLE",
    conflictSeverity: "NONE",
    reliability: "HIGH_RELIABILITY",
  }).entryContext,
  "FAVORABLE"
);

// 9. SELL + BELOW_SUPPORT + strong confirmation -> FAVORABLE
test(
  "SELL below support with strong confirmation",
  calculateEntryContextIntelligence({
    decision: "SELL",
    decisionStrength: "STRONG",
    decisionQuality: "HIGH",
    location: "BELOW_SUPPORT",
    locationQuality: "FAVORABLE",
    conflictSeverity: "NONE",
    reliability: "HIGH_RELIABILITY",
  }).entryContext,
  "FAVORABLE"
);

// 10. MID_RANGE -> CAUTION
test(
  "BUY in mid range",
  calculateEntryContextIntelligence({
    decision: "BUY",
    decisionStrength: "MODERATE",
    decisionQuality: "MEDIUM",
    location: "MID_RANGE",
    locationQuality: "NEUTRAL",
    conflictSeverity: "NONE",
    reliability: "MODERATE_RELIABILITY",
  }).entryContext,
  "CAUTION"
);

// 11. BUY + BELOW_SUPPORT -> UNFAVORABLE
test(
  "BUY below support",
  calculateEntryContextIntelligence({
    decision: "BUY",
    decisionStrength: "MODERATE",
    decisionQuality: "MEDIUM",
    location: "BELOW_SUPPORT",
    locationQuality: "UNFAVORABLE",
    conflictSeverity: "NONE",
    reliability: "MODERATE_RELIABILITY",
  }).entryContext,
  "UNFAVORABLE"
);

// 12. SELL + ABOVE_RESISTANCE -> CAUTION
test(
  "SELL above resistance",
  calculateEntryContextIntelligence({
    decision: "SELL",
    decisionStrength: "MODERATE",
    decisionQuality: "MEDIUM",
    location: "ABOVE_RESISTANCE",
    locationQuality: "UNFAVORABLE",
    conflictSeverity: "NONE",
    reliability: "MODERATE_RELIABILITY",
  }).entryContext,
  "CAUTION"
);

console.log("");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
  throw new Error("ENTRY CONTEXT INTELLIGENCE TESTS FAILED");
}

console.log("ALL ENTRY CONTEXT INTELLIGENCE TESTS PASSED");
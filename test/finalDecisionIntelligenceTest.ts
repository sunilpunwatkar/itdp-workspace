import {
  FinalDecisionInput,
} from "../app/types/finalDecision";

import {
  calculateFinalDecision,
} from "../app/services/finalDecisionIntelligenceService";

let passed = 0;
let failed = 0;

function assert(
  condition: boolean,
  message: string
): void {
  if (!condition) {
    failed++;
    console.log(`❌ FAIL: ${message}`);
    return;
  }

  passed++;
  console.log(`✅ PASS: ${message}`);
}

function baseInput(): FinalDecisionInput {
  return {
    direction: "BULLISH",

    momentumDirection: "BULLISH",

    momentumStrength: "MODERATE",

    momentumAgreement: "AGREE",

    location: "MID_RANGE",

    locationQuality: "NEUTRAL",

    overallEvidence: "BULLISH_EVIDENCE",

    evidenceStrength: "MODERATE",

    evidenceAlignment: "STRONG_ALIGNMENT",

    conflictStatus: "NO_CONFLICT",

    conflictCount: 0,

    conflictSeverity: "NONE",

    reliabilityImpact: "HIGH_RELIABILITY",
  };
}

console.log("========================================");
console.log("FINAL DECISION INTELLIGENCE v1");
console.log("REAL BEHAVIORAL TEST");
console.log("========================================");

// ==================================================
// 1. Strong Bullish → BUY / STRONG / HIGH
// ==================================================

{
  const input = baseInput();

  input.direction = "STRONG_BULLISH";
  input.momentumDirection = "STRONG_BULLISH";
  input.momentumStrength = "STRONG";

  input.overallEvidence = "BULLISH_EVIDENCE";
  input.evidenceStrength = "STRONG";
  input.evidenceAlignment = "STRONG_ALIGNMENT";

  input.location = "MID_RANGE";

  const result = calculateFinalDecision(input);

  assert(
    result.decision === "BUY",
    "Strong bullish alignment should produce BUY"
  );

  assert(
    result.decisionStrength === "STRONG",
    "Strong bullish alignment should have STRONG strength"
  );

  assert(
    result.decisionQuality === "HIGH",
    "Strong bullish alignment should have HIGH quality"
  );
}

// ==================================================
// 2. Strong Bearish → SELL / STRONG / HIGH
// ==================================================

{
  const input = baseInput();

  input.direction = "STRONG_BEARISH";
  input.momentumDirection = "STRONG_BEARISH";
  input.momentumStrength = "STRONG";

  input.overallEvidence = "BEARISH_EVIDENCE";
  input.evidenceStrength = "STRONG";
  input.evidenceAlignment = "STRONG_ALIGNMENT";

  input.location = "MID_RANGE";

  const result = calculateFinalDecision(input);

  assert(
    result.decision === "SELL",
    "Strong bearish alignment should produce SELL"
  );

  assert(
    result.decisionStrength === "STRONG",
    "Strong bearish alignment should have STRONG strength"
  );

  assert(
    result.decisionQuality === "HIGH",
    "Strong bearish alignment should have HIGH quality"
  );
}

// ==================================================
// 3. Bullish alignment → BUY / MODERATE
// ==================================================

{
  const input = baseInput();

  input.direction = "BULLISH";
  input.momentumDirection = "BULLISH";
  input.momentumStrength = "MODERATE";

  const result = calculateFinalDecision(input);

  assert(
    result.decision === "BUY",
    "Bullish alignment should produce BUY"
  );

  assert(
    result.decisionStrength === "MODERATE",
    "Bullish alignment should have MODERATE strength"
  );

  assert(
    result.decisionQuality === "MEDIUM",
    "Bullish alignment should have MEDIUM quality"
  );
}

// ==================================================
// 4. Bearish alignment → SELL / MODERATE
// ==================================================

{
  const input = baseInput();

  input.direction = "BEARISH";
  input.momentumDirection = "BEARISH";
  input.momentumStrength = "MODERATE";

  input.overallEvidence = "BEARISH_EVIDENCE";

  const result = calculateFinalDecision(input);

  assert(
    result.decision === "SELL",
    "Bearish alignment should produce SELL"
  );

  assert(
    result.decisionStrength === "MODERATE",
    "Bearish alignment should have MODERATE strength"
  );
}

// ==================================================
// 5. Direction-Momentum HIGH conflict → HOLD
// ==================================================

{
  const input = baseInput();

  input.direction = "STRONG_BULLISH";
  input.momentumDirection = "BEARISH";
  input.momentumStrength = "CONFLICTING";
  input.momentumAgreement = "CONFLICT";

  input.conflictStatus = "CONFLICT";
  input.conflictCount = 1;
  input.conflictSeverity = "HIGH";
  input.reliabilityImpact = "LOW_RELIABILITY";

  const result = calculateFinalDecision(input);

  assert(
    result.decision === "HOLD",
    "HIGH Direction-Momentum conflict should produce HOLD"
  );

  assert(
    result.decisionStrength === "WEAK",
    "HIGH conflict should produce WEAK decision strength"
  );

  assert(
    result.decisionQuality === "LOW",
    "HIGH conflict should produce LOW decision quality"
  );

  assert(
    result.reliability === "LOW_RELIABILITY",
    "HIGH conflict should preserve LOW_RELIABILITY"
  );
}

// ==================================================
// 6. Neutral market → HOLD
// ==================================================

{
  const input = baseInput();

  input.direction = "NEUTRAL";
  input.momentumDirection = "NEUTRAL";
  input.momentumStrength = "WEAK";
  input.momentumAgreement = "PARTIAL";

  input.overallEvidence = "NEUTRAL_EVIDENCE";
  input.evidenceStrength = "WEAK";
  input.evidenceAlignment = "NO_ALIGNMENT";

  const result = calculateFinalDecision(input);

  assert(
    result.decision === "HOLD",
    "Neutral market should produce HOLD"
  );

  assert(
    result.decisionStrength === "WEAK",
    "Neutral market should have WEAK strength"
  );

  assert(
    result.decisionQuality === "LOW",
    "Neutral market should have LOW quality"
  );
}

// ==================================================
// 7. Mixed evidence → HOLD
// ==================================================

{
  const input = baseInput();

  input.direction = "BULLISH";
  input.momentumDirection = "NEUTRAL";
  input.momentumStrength = "WEAK";
  input.momentumAgreement = "PARTIAL";

  input.overallEvidence = "MIXED_EVIDENCE";
  input.evidenceStrength = "WEAK";
  input.evidenceAlignment = "MIXED";

  const result = calculateFinalDecision(input);

  assert(
    result.decision === "HOLD",
    "Mixed evidence should produce HOLD"
  );

  assert(
    result.decisionQuality === "LOW",
    "Mixed evidence should have LOW quality"
  );
}

// ==================================================
// 8. Bullish at resistance → HOLD
// ==================================================

{
  const input = baseInput();

  input.direction = "BULLISH";
  input.momentumDirection = "BULLISH";

  input.location = "AT_RESISTANCE";
  input.locationQuality = "UNFAVORABLE";

  input.conflictStatus = "CONFLICT";
  input.conflictCount = 1;
  input.conflictSeverity = "LOW";
  input.reliabilityImpact = "MODERATE_RELIABILITY";

  const result = calculateFinalDecision(input);

  assert(
    result.decision === "HOLD",
    "Bullish evidence at resistance should produce HOLD"
  );

  assert(
    result.decisionQuality === "LOW",
    "Resistance conflict should produce LOW quality"
  );
}

// ==================================================
// 9. Bearish at support → HOLD
// ==================================================

{
  const input = baseInput();

  input.direction = "BEARISH";
  input.momentumDirection = "BEARISH";

  input.overallEvidence = "BEARISH_EVIDENCE";

  input.location = "AT_SUPPORT";
  input.locationQuality = "FAVORABLE";

  input.conflictStatus = "CONFLICT";
  input.conflictCount = 1;
  input.conflictSeverity = "LOW";
  input.reliabilityImpact = "MODERATE_RELIABILITY";

  const result = calculateFinalDecision(input);

  assert(
    result.decision === "HOLD",
    "Bearish evidence at support should produce HOLD"
  );

  assert(
    result.decisionQuality === "LOW",
    "Support conflict should produce LOW quality"
  );
}

// ==================================================
// 10. ABOVE_RESISTANCE ≠ automatic BUY
// ==================================================

{
  const input = baseInput();

  input.direction = "BULLISH";
  input.momentumDirection = "NEUTRAL";
  input.momentumStrength = "WEAK";

  input.location = "ABOVE_RESISTANCE";
  input.locationQuality = "FAVORABLE";

  input.overallEvidence = "BULLISH_EVIDENCE";

  const result = calculateFinalDecision(input);

  assert(
    result.decision === "HOLD",
    "Above resistance should NOT automatically produce BUY"
  );
}

// ==================================================
// 11. BELOW_SUPPORT ≠ automatic SELL
// ==================================================

{
  const input = baseInput();

  input.direction = "BEARISH";
  input.momentumDirection = "NEUTRAL";
  input.momentumStrength = "WEAK";

  input.location = "BELOW_SUPPORT";
  input.locationQuality = "UNFAVORABLE";

  input.overallEvidence = "BEARISH_EVIDENCE";

  const result = calculateFinalDecision(input);

  assert(
    result.decision === "HOLD",
    "Below support should NOT automatically produce SELL"
  );
}

// ==================================================
// 12. HIGH conflict → LOW quality + LOW reliability
// ==================================================

{
  const input = baseInput();

  input.conflictStatus = "CONFLICT";
  input.conflictCount = 2;
  input.conflictSeverity = "HIGH";
  input.reliabilityImpact = "LOW_RELIABILITY";

  const result = calculateFinalDecision(input);

  assert(
    result.decision === "HOLD",
    "HIGH conflict should force HOLD"
  );

  assert(
    result.decisionQuality === "LOW",
    "HIGH conflict should reduce quality to LOW"
  );

  assert(
    result.reliability === "LOW_RELIABILITY",
    "HIGH conflict should produce LOW_RELIABILITY"
  );
}

// ==================================================
// 13. No conflict → preserve reliability
// ==================================================

{
  const input = baseInput();

  input.conflictStatus = "NO_CONFLICT";
  input.conflictCount = 0;
  input.conflictSeverity = "NONE";
  input.reliabilityImpact = "HIGH_RELIABILITY";

  const result = calculateFinalDecision(input);

  assert(
    result.decision === "BUY",
    "Aligned bullish evidence with no conflict should produce BUY"
  );

  assert(
    result.conflict === "NONE",
    "No conflict should remain NONE"
  );

  assert(
    result.reliability === "HIGH_RELIABILITY",
    "No conflict should preserve HIGH_RELIABILITY"
  );
}

// ==================================================
// 14. Weak evidence → HOLD
// ==================================================

{
  const input = baseInput();

  input.direction = "BULLISH";
  input.momentumDirection = "NEUTRAL";
  input.momentumStrength = "WEAK";

  input.overallEvidence = "BULLISH_EVIDENCE";
  input.evidenceStrength = "WEAK";
  input.evidenceAlignment = "PARTIAL_ALIGNMENT";

  const result = calculateFinalDecision(input);

  assert(
    result.decision === "HOLD",
    "Weak evidence should produce HOLD"
  );

  assert(
    result.decisionStrength === "WEAK",
    "Weak evidence should have WEAK strength"
  );

  assert(
    result.decisionQuality === "LOW",
    "Weak evidence should have LOW quality"
  );
}

// ==================================================
// FINAL RESULT
// ==================================================

console.log("");
console.log("========================================");
console.log("FINAL DECISION v1 TEST RESULT");
console.log("========================================");
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total : ${passed + failed}`);
console.log("========================================");

if (failed > 0) {
  console.log("❌ FINAL DECISION INTELLIGENCE TEST FAILED");
  process.exit(1);
}

console.log("🎯 ALL FINAL DECISION INTELLIGENCE TESTS PASSED");
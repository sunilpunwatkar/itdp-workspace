import {
  calculateEntryContext,
} from "../app/services/entryContextService";

console.log("=== ENTRY CONTEXT ENGINE V1 TEST ===");

const tests = [
  {
    name: "TEST 1: BUY + BREAKOUT",
    decision: "BUY" as const,
    structure: "BREAKOUT" as const,
    expected: "FAVORABLE",
  },
  {
    name: "TEST 2: BUY + NEAR_SUPPORT",
    decision: "BUY" as const,
    structure: "NEAR_SUPPORT" as const,
    expected: "FAVORABLE",
  },
  {
    name: "TEST 3: BUY + NEAR_RESISTANCE",
    decision: "BUY" as const,
    structure: "NEAR_RESISTANCE" as const,
    expected: "CAUTION",
  },
  {
    name: "TEST 4: SELL + BREAKDOWN",
    decision: "SELL" as const,
    structure: "BREAKDOWN" as const,
    expected: "FAVORABLE",
  },
  {
    name: "TEST 5: SELL + NEAR_RESISTANCE",
    decision: "SELL" as const,
    structure: "NEAR_RESISTANCE" as const,
    expected: "FAVORABLE",
  },
  {
    name: "TEST 6: SELL + NEAR_SUPPORT",
    decision: "SELL" as const,
    structure: "NEAR_SUPPORT" as const,
    expected: "CAUTION",
  },
  {
    name: "TEST 7: BUY + RANGE",
    decision: "BUY" as const,
    structure: "RANGE" as const,
    expected: "CAUTION",
  },
  {
    name: "TEST 8: SELL + RANGE",
    decision: "SELL" as const,
    structure: "RANGE" as const,
    expected: "CAUTION",
  },
  {
    name: "TEST 9: BUY + BREAKDOWN",
    decision: "BUY" as const,
    structure: "BREAKDOWN" as const,
    expected: "UNFAVORABLE",
  },
  {
    name: "TEST 10: SELL + BREAKOUT",
    decision: "SELL" as const,
    structure: "BREAKOUT" as const,
    expected: "UNFAVORABLE",
  },
  {
    name: "TEST 11: HOLD",
    decision: "HOLD" as const,
    structure: "RANGE" as const,
    expected: "UNFAVORABLE",
  },
];

let passed = 0;

for (const test of tests) {
  const result = calculateEntryContext(
    test.decision,
    test.structure
  );

  const success = result === test.expected;

  console.log(
    `${test.name}:`,
    result,
    success ? "PASS" : "FAIL"
  );

  if (success) {
    passed++;
  }
}

console.log("=== FINAL CHECK ===");

console.log({
  totalTests: tests.length,
  passed,
  failed: tests.length - passed,
  allPassed: passed === tests.length,
});
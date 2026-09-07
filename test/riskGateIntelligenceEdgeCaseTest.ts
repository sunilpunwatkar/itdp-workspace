import {
  calculateRiskGateIntelligence,
} from "../app/services/riskGateIntelligenceService";

type TestCase = {
  name: string;
  input: Parameters<typeof calculateRiskGateIntelligence>[0];
  expected: "PASS" | "CAUTION" | "BLOCK";
};

const baseInput = {
  decision: "BUY" as const,
  entryContext: "FAVORABLE" as const,
  conflictSeverity: "NONE" as const,
  reliability: "HIGH_RELIABILITY" as const,
  decisionQuality: "HIGH" as const,
  entry: 100,
  stopLoss: 95,
  target1: 110,
  riskReward: 2,
  quantity: 10,
};

const testCases: TestCase[] = [
  // --------------------------------------------------
  // NUMERIC EDGE CASES
  // --------------------------------------------------

  {
    name: "1. NaN entry",
    input: {
      ...baseInput,
      entry: Number.NaN,
    },
    expected: "BLOCK",
  },

  {
    name: "2. Infinity entry",
    input: {
      ...baseInput,
      entry: Number.POSITIVE_INFINITY,
    },
    expected: "BLOCK",
  },

  {
    name: "3. Negative entry",
    input: {
      ...baseInput,
      entry: -100,
    },
    expected: "BLOCK",
  },

  {
    name: "4. NaN stop loss",
    input: {
      ...baseInput,
      stopLoss: Number.NaN,
    },
    expected: "BLOCK",
  },

  {
    name: "5. Infinity stop loss",
    input: {
      ...baseInput,
      stopLoss: Number.POSITIVE_INFINITY,
    },
    expected: "BLOCK",
  },

  {
    name: "6. Negative stop loss",
    input: {
      ...baseInput,
      stopLoss: -95,
    },
    expected: "BLOCK",
  },

  {
    name: "7. NaN target",
    input: {
      ...baseInput,
      target1: Number.NaN,
    },
    expected: "BLOCK",
  },

  {
    name: "8. Infinity target",
    input: {
      ...baseInput,
      target1: Number.POSITIVE_INFINITY,
    },
    expected: "BLOCK",
  },

  {
    name: "9. Negative target",
    input: {
      ...baseInput,
      target1: -110,
    },
    expected: "BLOCK",
  },

  {
    name: "10. NaN quantity",
    input: {
      ...baseInput,
      quantity: Number.NaN,
    },
    expected: "BLOCK",
  },

  {
    name: "11. Infinity quantity",
    input: {
      ...baseInput,
      quantity: Number.POSITIVE_INFINITY,
    },
    expected: "BLOCK",
  },

  {
    name: "12. Negative quantity",
    input: {
      ...baseInput,
      quantity: -10,
    },
    expected: "BLOCK",
  },

  // --------------------------------------------------
  // RISK / REWARD BOUNDARIES
  // --------------------------------------------------

  {
    name: "13. Risk reward exactly 1",
    input: {
      ...baseInput,
      riskReward: 1,
    },
    expected: "BLOCK",
  },

  {
    name: "14. Risk reward just above 1",
    input: {
      ...baseInput,
      riskReward: 1.000001,
    },
    expected: "CAUTION",
  },

  {
    name: "15. Risk reward just below 1.5",
    input: {
      ...baseInput,
      riskReward: 1.499999,
    },
    expected: "CAUTION",
  },

  {
    name: "16. Risk reward exactly 1.5",
    input: {
      ...baseInput,
      riskReward: 1.5,
    },
    expected: "PASS",
  },

  {
    name: "17. Risk reward NaN",
    input: {
      ...baseInput,
      riskReward: Number.NaN,
    },
    expected: "BLOCK",
  },

  {
    name: "18. Risk reward Infinity",
    input: {
      ...baseInput,
      riskReward: Number.POSITIVE_INFINITY,
    },
    expected: "BLOCK",
  },

  {
    name: "19. Risk reward negative",
    input: {
      ...baseInput,
      riskReward: -2,
    },
    expected: "BLOCK",
  },

  // --------------------------------------------------
  // MULTIPLE FAILURE PRIORITY
  // --------------------------------------------------

  {
    name: "20. Multiple critical failures",
    input: {
      ...baseInput,
      decision: "HOLD",
      entryContext: "UNFAVORABLE",
      conflictSeverity: "HIGH",
      reliability: "LOW_RELIABILITY",
      stopLoss: 0,
      quantity: 0,
      riskReward: 1,
    },
    expected: "BLOCK",
  },

  {
    name: "21. Critical failure + multiple warnings",
    input: {
      ...baseInput,
      entryContext: "UNFAVORABLE",
      conflictSeverity: "MODERATE",
      reliability: "REDUCED_RELIABILITY",
      decisionQuality: "LOW",
      riskReward: 1.2,
    },
    expected: "BLOCK",
  },

  // --------------------------------------------------
  // BUY / SELL SYMMETRY
  // --------------------------------------------------

  {
    name: "22. BUY favorable high reliability",
    input: {
      ...baseInput,
      decision: "BUY",
    },
    expected: "PASS",
  },

  {
    name: "23. SELL favorable high reliability",
    input: {
      ...baseInput,
      decision: "SELL",
    },
    expected: "PASS",
  },

  {
    name: "24. BUY caution entry",
    input: {
      ...baseInput,
      decision: "BUY",
      entryContext: "CAUTION",
    },
    expected: "CAUTION",
  },

  {
    name: "25. SELL caution entry",
    input: {
      ...baseInput,
      decision: "SELL",
      entryContext: "CAUTION",
    },
    expected: "CAUTION",
  },

  {
    name: "26. BUY high conflict",
    input: {
      ...baseInput,
      decision: "BUY",
      conflictSeverity: "HIGH",
    },
    expected: "BLOCK",
  },

  {
    name: "27. SELL high conflict",
    input: {
      ...baseInput,
      decision: "SELL",
      conflictSeverity: "HIGH",
    },
    expected: "BLOCK",
  },

  // --------------------------------------------------
  // COMBINED WARNING CASES
  // --------------------------------------------------

  {
    name: "28. Reduced reliability + weak RR",
    input: {
      ...baseInput,
      reliability: "REDUCED_RELIABILITY",
      riskReward: 1.2,
    },
    expected: "CAUTION",
  },

  {
    name: "29. Low quality + low conflict",
    input: {
      ...baseInput,
      decisionQuality: "LOW",
      conflictSeverity: "LOW",
    },
    expected: "CAUTION",
  },

  {
    name: "30. All warnings without critical failure",
    input: {
      ...baseInput,
      entryContext: "CAUTION",
      conflictSeverity: "MODERATE",
      reliability: "REDUCED_RELIABILITY",
      decisionQuality: "LOW",
      riskReward: 1.2,
    },
    expected: "CAUTION",
  },
];

let passed = 0;
let failed = 0;

console.log(
  "\n===== RISK GATE INTELLIGENCE EDGE CASE TEST =====\n"
);

for (const testCase of testCases) {
  try {
    const result = calculateRiskGateIntelligence(testCase.input);

    if (result.status === testCase.expected) {
      console.log(`PASS: ${testCase.name}`);
      passed++;
    } else {
      console.log(
        `FAIL: ${testCase.name} | Expected: ${testCase.expected} | Got: ${result.status}`
      );

      console.log("Reason:", result.reason);
      console.log("Failures:", result.failures);
      console.log("Warnings:", result.warnings);

      failed++;
    }
  } catch (error) {
    console.log(
      `ERROR: ${testCase.name}`,
      error
    );

    failed++;
  }
}

console.log("\n===== EDGE CASE TEST SUMMARY =====");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed === 0) {
  console.log(
    "\nALL RISK GATE INTELLIGENCE EDGE CASE TESTS PASSED"
  );
} else {
  console.log(
    "\nRISK GATE INTELLIGENCE EDGE CASE TESTS FAILED"
  );

  process.exit(1);
}
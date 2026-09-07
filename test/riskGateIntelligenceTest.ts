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
  {
    name: "1. Perfect BUY setup",
    input: { ...baseInput },
    expected: "PASS",
  },

  {
    name: "2. Perfect SELL setup",
    input: {
      ...baseInput,
      decision: "SELL",
    },
    expected: "PASS",
  },

  {
    name: "3. HOLD decision",
    input: {
      ...baseInput,
      decision: "HOLD",
    },
    expected: "BLOCK",
  },

  {
    name: "4. Unfavorable entry",
    input: {
      ...baseInput,
      entryContext: "UNFAVORABLE",
    },
    expected: "BLOCK",
  },

  {
    name: "5. High conflict",
    input: {
      ...baseInput,
      conflictSeverity: "HIGH",
    },
    expected: "BLOCK",
  },

  {
    name: "6. Low reliability",
    input: {
      ...baseInput,
      reliability: "LOW_RELIABILITY",
    },
    expected: "BLOCK",
  },

  {
    name: "7. Invalid entry",
    input: {
      ...baseInput,
      entry: 0,
    },
    expected: "BLOCK",
  },

  {
    name: "8. Invalid stop loss",
    input: {
      ...baseInput,
      stopLoss: 0,
    },
    expected: "BLOCK",
  },

  {
    name: "9. Invalid target",
    input: {
      ...baseInput,
      target1: 0,
    },
    expected: "BLOCK",
  },

  {
    name: "10. Zero quantity",
    input: {
      ...baseInput,
      quantity: 0,
    },
    expected: "BLOCK",
  },

  {
    name: "11. Risk reward <= 1",
    input: {
      ...baseInput,
      riskReward: 1,
    },
    expected: "BLOCK",
  },

  {
    name: "12. Caution entry",
    input: {
      ...baseInput,
      entryContext: "CAUTION",
    },
    expected: "CAUTION",
  },

  {
    name: "13. Low conflict",
    input: {
      ...baseInput,
      conflictSeverity: "LOW",
    },
    expected: "CAUTION",
  },

  {
    name: "14. Moderate conflict",
    input: {
      ...baseInput,
      conflictSeverity: "MODERATE",
    },
    expected: "CAUTION",
  },

  {
    name: "15. Reduced reliability",
    input: {
      ...baseInput,
      reliability: "REDUCED_RELIABILITY",
    },
    expected: "CAUTION",
  },

  {
    name: "16. Low decision quality",
    input: {
      ...baseInput,
      decisionQuality: "LOW",
    },
    expected: "CAUTION",
  },

  {
    name: "17. Weak risk reward",
    input: {
      ...baseInput,
      riskReward: 1.2,
    },
    expected: "CAUTION",
  },

  {
    name: "18. Multiple warnings",
    input: {
      ...baseInput,
      entryContext: "CAUTION",
      conflictSeverity: "LOW",
      decisionQuality: "LOW",
    },
    expected: "CAUTION",
  },

  {
    name: "19. Caution entry + invalid stop loss",
    input: {
      ...baseInput,
      entryContext: "CAUTION",
      stopLoss: 0,
    },
    expected: "BLOCK",
  },

  {
    name: "20. Perfect setup + HIGH conflict",
    input: {
      ...baseInput,
      conflictSeverity: "HIGH",
    },
    expected: "BLOCK",
  },

  {
    name: "21. Favorable entry + LOW reliability",
    input: {
      ...baseInput,
      reliability: "LOW_RELIABILITY",
    },
    expected: "BLOCK",
  },

  {
    name: "22. Favorable + MODERATE conflict",
    input: {
      ...baseInput,
      conflictSeverity: "MODERATE",
    },
    expected: "CAUTION",
  },
];

let passed = 0;
let failed = 0;

console.log("\n===== RISK GATE INTELLIGENCE v1 TEST =====\n");

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

console.log("\n===== TEST SUMMARY =====");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed === 0) {
  console.log("\nALL RISK GATE INTELLIGENCE TESTS PASSED");
} else {
  console.log("\nRISK GATE INTELLIGENCE TESTS FAILED");
  process.exit(1);
}
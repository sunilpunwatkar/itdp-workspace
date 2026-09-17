import { spawnSync } from "node:child_process";

type RegressionTest = {
  name: string;
  file: string;
};

const tests: RegressionTest[] = [
  {
    name: "Golden BUY Production",
    file: "test/itdpValidationHarnessTest.ts",
  },
  {
    name: "Golden SELL Production",
    file: "test/goldenSellProductionTest.ts",
  },
  {
    name: "Risk Gate BUY End-to-End",
    file: "test/riskGateBuyEndToEndTest.ts",
  },
  {
    name: "Risk Gate SELL End-to-End",
    file: "test/sellRiskGateEndToEndTest.ts",
  },
  {
    name: "Directional Entry Location",
    file: "test/directionalEntryLocationContractTest.ts",
  },
  {
    name: "Chart Historical Snapshot",
    file: "test/chartHistoricalSnapshotContractTest.ts",
  },
  {
    name: "Chart Snapshot Storage",
    file: "test/chartHistoricalSnapshotStorageContractTest.ts",
  },
  {
    name: "Chart Historical Resilience",
    file: "test/chartHistoricalResilienceContractTest.ts",
  },
  {
    name: "Chart Historical Runtime",
    file: "test/chartHistoricalRuntimeContractTest.ts",
  },
  {
    name: "Opportunity Discovery",
    file: "test/opportunityDiscoveryContractTest.ts",
  },
  {
    name: "Opportunity Ranking",
    file: "test/opportunityRankingContractTest.ts",
  },
  {
    name: "Opportunity Scanner",
    file: "test/opportunityScannerContractTest.ts",
  },
  {
    name: "Opportunity Scanner Batching",
    file: "test/opportunityScannerBatchingContractTest.ts",
  },
  {
    name: "Opportunity Scanner Concurrency",
    file: "test/opportunityScannerConcurrencyContractTest.ts",
  },
  {
    name: "Opportunity Scanner Scaling",
    file: "test/opportunityScannerScalingContractTest.ts",
  },
  {
    name: "Yahoo Quote Retry Integration",
    file: "test/yahooQuoteRetryIntegrationContractTest.ts",
  },
  {
    name: "Provider Retry Policy",
    file: "test/providerRetryPolicyContractTest.ts",
  },
  {
    name: "Provider Retry Executor",
    file: "test/providerRetryExecutorContractTest.ts",
  },
  {
    name: "Scan In-Flight Coordinator",
    file: "test/scanInFlightCoordinatorContractTest.ts",
  },
  {
    name: "Opportunity Experience State",
    file: "test/opportunityExperienceStateContractTest.ts",
  },
  {
    name: "Opportunity Experience",
    file: "test/opportunityExperienceContractTest.ts",
  },
  {
    name: "Opportunity Experience Response",
    file: "test/opportunityExperienceResponseContractTest.ts",
  },
  {
    name: "Opportunity Experience API Handler",
    file: "test/opportunityExperienceApiHandlerContractTest.ts",
  },
  {
    name: "Opportunity Signal Levels",
    file: "test/opportunitySignalLevelsContractTest.ts",
  },
  {
    name: "Opportunity Pipeline Integration",
    file: "test/opportunityPipelineIntegrationTest.ts",
  },
];

const passed: string[] = [];
const failed: string[] = [];

console.log("");
console.log("========================================");
console.log(" ITDP PRODUCTION REGRESSION");
console.log(" DETERMINISTIC CRITICAL SUITE");
console.log("========================================");
console.log(`Tests: ${tests.length}`);
console.log("");

for (const test of tests) {
  console.log("----------------------------------------");
  console.log(`RUN  | ${test.name}`);
  console.log(`FILE | ${test.file}`);
  console.log("----------------------------------------");

  const result = spawnSync(
    process.execPath,
    [
      "--import",
      "tsx",
      test.file,
    ],
    {
      stdio: "inherit",
      cwd: process.cwd(),
    }
  );

  if (result.error) {
    console.error(
      `FAIL | ${test.name} | ${result.error.message}`
    );

    failed.push(test.name);
    continue;
  }

  if (result.status === 0) {
    console.log(`PASS | ${test.name}`);
    passed.push(test.name);
  } else {
    console.error(
      `FAIL | ${test.name} | Exit Code: ${String(
        result.status
      )}`
    );

    failed.push(test.name);
  }

  console.log("");
}

console.log("");
console.log("========================================");
console.log(" ITDP PRODUCTION REGRESSION SUMMARY");
console.log("========================================");
console.log(`TOTAL  : ${tests.length}`);
console.log(`PASSED : ${passed.length}`);
console.log(`FAILED : ${failed.length}`);

if (failed.length > 0) {
  console.log("");
  console.log("FAILED TESTS:");

  for (const name of failed) {
    console.log(`- ${name}`);
  }

  console.log("");
  console.log("PRODUCTION REGRESSION: RED");
  process.exit(1);
}

console.log("");
console.log("PRODUCTION REGRESSION: GREEN");
console.log("ALL CRITICAL DETERMINISTIC CONTRACTS PASSED");
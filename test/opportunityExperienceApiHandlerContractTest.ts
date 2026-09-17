import {
  handleOpportunityExperienceApiRequest,
} from "../app/services/opportunityExperienceApiHandlerService";

import type {
  OpportunityScanAccessInput,
} from "../app/services/opportunityScanAccessService";

import type {
  OpportunityScannerResult,
} from "../app/services/opportunityScannerService";

import type {
  OrchestratedScanResult,
} from "../app/services/scanOrchestratorService";

function assertEqual<T>(
  label: string,
  actual: T,
  expected: T
) {
  if (actual !== expected) {
    throw new Error(
      `${label} FAILED | Expected=${expected} | Actual=${actual}`
    );
  }

  console.log(
    `PASS | ${label} | ${String(actual)}`
  );
}

function buildControlledScanResult(
  source:
    | "LIVE"
    | "CACHE",
  scanId: string
): OrchestratedScanResult<
  OpportunityScannerResult
> {
  return {
    source,

    metadata: {
      scanId,

      universe:
        "ITDP_REAL_100|NIFTY_500|SHORT|BALANCED|75000|10",

      startedAt:
        1000,

      completedAt:
        2000,

      durationMs:
        1000,

      scannedCount:
        100,

      analyzedCount:
        100,

      failedCount:
        0,
    },

    result: {
      scannedCount:
        100,

      analyzedCount:
        100,

      failedCount:
        0,

      candidateCount:
        2,

      failures:
        [],

      discovery: {
        universe:
          "NIFTY_500",

        horizon:
          "SHORT",

        scannedCount:
          100,

        analyzedCount:
          100,

        eligibleCount:
          2,

        opportunities: [
          {
            symbol:
              "BUY.TEST",

            decision:
              "BUY",

            entry:
              100,

            stopLoss:
              95,

            target1:
              110,

            target2:
              115,

            riskRewardRatio:
              2,

            quantity:
              20,

            maxRisk:
              100,

            riskGateStatus:
              "PASS",

            opportunityScore:
              96,

            classification:
              "PRIME",
          },

          {
            symbol:
              "WATCH.TEST",

            decision:
              "BUY",

            entry:
              200,

            stopLoss:
              190,

            target1:
              220,

            target2:
              230,

            riskRewardRatio:
              2,

            quantity:
              10,

            maxRisk:
              100,

            riskGateStatus:
              "CAUTION",

            opportunityScore:
              82,

            classification:
              "STRONG",
          },
        ],
      },
    },
  };
}

async function run() {
  console.log(
    "=== OPPORTUNITY EXPERIENCE API HANDLER CONTRACT ==="
  );

  // ==========================================
  // CASE 1
  // VALID LIVE REQUEST
  // ==========================================

  let receivedStockUniverse =
    "";

  let receivedCapital =
    0;
    let receivedConcurrency:
  number | undefined;

let receivedBatchSize:
  number | undefined;

let receivedBatchDelayMs:
  number | undefined;

let receivedAnalysisTimeoutMs:
  number | undefined;

  const liveResponse =
    await handleOpportunityExperienceApiRequest({
      readBody:
        async () => ({
          stockUniverse:
            "ITDP_REAL_100",

          capital:
            75_000,

          horizon:
            "SHORT",

          riskProfile:
            "BALANCED",

          maxResults:
            10,

          freshnessTtlMs:
            60_000,
        }),

      scan:
        async (
          input:
            OpportunityScanAccessInput
        ) => {
          receivedStockUniverse =
            input.stockUniverse;

          receivedCapital =
            input.discovery.capital;

            receivedConcurrency =
  input.scannerOptions?.concurrency;

receivedBatchSize =
  input.scannerOptions?.batchSize;

receivedBatchDelayMs =
  input.scannerOptions?.batchDelayMs;

receivedAnalysisTimeoutMs =
  input.scannerOptions?.analysisTimeoutMs;

          return buildControlledScanResult(
            "LIVE",
            "EXPERIENCE-API-LIVE-1"
          );
        },
    });

  assertEqual(
    "LIVE Status",
    liveResponse.status,
    200
  );

  assertEqual(
    "Parsed Stock Universe",
    receivedStockUniverse,
    "ITDP_REAL_100"
  );

  assertEqual(
    "Parsed Capital",
    receivedCapital,
    75_000
  );
  assertEqual(
  "Production Scanner Concurrency",
  receivedConcurrency,
  2
);

assertEqual(
  "Production Scanner Batch Size",
  receivedBatchSize,
  10
);

assertEqual(
  "Production Scanner Batch Delay",
  receivedBatchDelayMs,
  500
);



  const liveBody =
    liveResponse.body as {
      source: string;
      scanId: string;

      experience: {
        totalOpportunities: number;
        tradeCount: number;
        watchCount: number;

        opportunities: Array<{
          symbol: string;
          action: string;
          target1: number;
          target2: number;
        }>;
      };
    };

  assertEqual(
    "LIVE Source",
    liveBody.source,
    "LIVE"
  );

  assertEqual(
    "LIVE Scan ID",
    liveBody.scanId,
    "EXPERIENCE-API-LIVE-1"
  );

  assertEqual(
    "LIVE Total Opportunities",
    liveBody.experience.totalOpportunities,
    2
  );

  assertEqual(
    "LIVE Trade Count",
    liveBody.experience.tradeCount,
    1
  );

  assertEqual(
    "LIVE Watch Count",
    liveBody.experience.watchCount,
    1
  );

  assertEqual(
    "LIVE First Action",
    liveBody.experience.opportunities[0]
      .action,
    "TRADE"
  );

  assertEqual(
    "LIVE Second Action",
    liveBody.experience.opportunities[1]
      .action,
    "WATCH"
  );

  assertEqual(
    "LIVE Target 1",
    liveBody.experience.opportunities[0]
      .target1,
    110
  );

  assertEqual(
    "LIVE Target 2",
    liveBody.experience.opportunities[0]
      .target2,
    115
  );

  // ==========================================
  // CASE 2
  // CACHE RESPONSE
  // ==========================================

  const cacheResponse =
    await handleOpportunityExperienceApiRequest({
      readBody:
        async () => ({
          stockUniverse:
            "ITDP_REAL_100",

          capital:
            75_000,

          horizon:
            "SHORT",

          riskProfile:
            "BALANCED",

          maxResults:
            10,

          freshnessTtlMs:
            60_000,
        }),

      scan:
        async () =>
          buildControlledScanResult(
            "CACHE",
            "EXPERIENCE-API-CACHE-1"
          ),
    });

  assertEqual(
    "CACHE Status",
    cacheResponse.status,
    200
  );

  const cacheBody =
    cacheResponse.body as {
      source: string;
      scanId: string;

      experience: {
        totalOpportunities: number;
      };
    };

  assertEqual(
    "CACHE Source",
    cacheBody.source,
    "CACHE"
  );

  assertEqual(
    "CACHE Scan ID",
    cacheBody.scanId,
    "EXPERIENCE-API-CACHE-1"
  );

  assertEqual(
    "CACHE Total Opportunities",
    cacheBody.experience.totalOpportunities,
    2
  );

  // ==========================================
  // CASE 3
  // MALFORMED JSON
  // ==========================================

  const malformedJson =
    await handleOpportunityExperienceApiRequest({
      readBody:
        async () => {
          throw new Error(
            "CONTROLLED_JSON_FAILURE"
          );
        },

      scan:
        async () => {
          throw new Error(
            "SHOULD_NOT_RUN"
          );
        },
    });

  assertEqual(
    "Malformed JSON Status",
    malformedJson.status,
    400
  );

  assertEqual(
    "Malformed JSON Error",
    (
      malformedJson.body as {
        error: string;
      }
    ).error,
    "INVALID_JSON"
  );

  // ==========================================
  // CASE 4
  // INVALID CAPITAL
  // ==========================================

  const invalidCapital =
    await handleOpportunityExperienceApiRequest({
      readBody:
        async () => ({
          stockUniverse:
            "ITDP_REAL_100",

          capital:
            0,

          horizon:
            "SHORT",

          riskProfile:
            "BALANCED",

          maxResults:
            10,

          freshnessTtlMs:
            60_000,
        }),

      scan:
        async () => {
          throw new Error(
            "SHOULD_NOT_RUN"
          );
        },
    });

  assertEqual(
    "Invalid Capital Status",
    invalidCapital.status,
    400
  );

  assertEqual(
    "Invalid Capital Error",
    (
      invalidCapital.body as {
        error: string;
      }
    ).error,
    "INVALID_CAPITAL"
  );

  // ==========================================
  // CASE 5
  // INTERNAL SCAN FAILURE
  // ==========================================

  const internalFailure =
    await handleOpportunityExperienceApiRequest({
      readBody:
        async () => ({
          stockUniverse:
            "ITDP_REAL_5",

          capital:
            75_000,

          horizon:
            "SHORT",

          riskProfile:
            "BALANCED",

          maxResults:
            5,

          freshnessTtlMs:
            60_000,
        }),

      scan:
        async () => {
          throw new Error(
            "CONTROLLED_SCAN_FAILURE"
          );
        },
    });

  assertEqual(
    "Internal Failure Status",
    internalFailure.status,
    500
  );

  assertEqual(
    "Internal Failure Error",
    (
      internalFailure.body as {
        error: string;
      }
    ).error,
    "INTERNAL_SERVER_ERROR"
  );

  console.log("");

  console.log(
    "ALL OPPORTUNITY EXPERIENCE API HANDLER CONTRACT CASES PASS"
  );
}

run().catch((error) => {
  console.error("");

  console.error(
    "OPPORTUNITY EXPERIENCE API HANDLER CONTRACT: FAILED"
  );

  console.error(
    error
  );

  process.exit(1);
});
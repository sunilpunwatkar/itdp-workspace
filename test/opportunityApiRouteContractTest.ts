import {
  handleOpportunityApiRequest,
} from "../app/services/opportunityApiHandlerService";

import type {
  OpportunityScanAccessInput,
} from "../app/services/opportunityScanAccessService";

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

async function run() {
  console.log(
    "=== OPPORTUNITY API ROUTE CONTRACT ==="
  );

  // ==========================================
  // CASE 1
  // VALID REQUEST
  // ==========================================

  let receivedStockUniverse =
    "";

  let receivedCapital =
    0;

  let receivedHorizon =
    "";

  let receivedRiskProfile =
    "";

  const liveResponse =
    await handleOpportunityApiRequest({
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

          receivedHorizon =
            input.discovery.horizon;

          receivedRiskProfile =
            input.discovery.riskProfile;

          return {
            source:
              "LIVE",

            metadata: {
              scanId:
                "API-SCAN-1",

              universe:
                "TEST-CACHE-KEY",

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
              candidateCount:
                5,

              discovery: {
                eligibleCount:
                  3,

                opportunities:
                  [],
              },
            },
          };
        },
    });

  assertEqual(
    "Valid Request Status",
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
    "Parsed Horizon",
    receivedHorizon,
    "SHORT"
  );

  assertEqual(
    "Parsed Risk Profile",
    receivedRiskProfile,
    "BALANCED"
  );

  // ==========================================
  // CASE 2
  // MALFORMED JSON
  // ==========================================

  const malformedJson =
    await handleOpportunityApiRequest({
      readBody:
        async () => {
          throw new Error(
            "CONTROLLED_JSON_PARSE_ERROR"
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
  // CASE 3
  // INVALID CAPITAL
  // ==========================================

  const invalidCapital =
    await handleOpportunityApiRequest({
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
  // CASE 4
  // INVALID STOCK UNIVERSE
  // ==========================================

  const invalidUniverse =
    await handleOpportunityApiRequest({
      readBody:
        async () => ({
          stockUniverse:
            "INVALID",

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
        async () => {
          throw new Error(
            "SHOULD_NOT_RUN"
          );
        },
    });

  assertEqual(
    "Invalid Universe Status",
    invalidUniverse.status,
    400
  );

  assertEqual(
    "Invalid Universe Error",
    (
      invalidUniverse.body as {
        error: string;
      }
    ).error,
    "INVALID_STOCK_UNIVERSE"
  );

  // ==========================================
  // CASE 5
  // INTERNAL SCAN FAILURE
  // ==========================================

  const internalFailure =
    await handleOpportunityApiRequest({
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
            "CONTROLLED_INTERNAL_FAILURE"
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

  // ==========================================
  // CASE 6
  // CACHE RESULT PASSTHROUGH
  // ==========================================

  const cacheResponse =
    await handleOpportunityApiRequest({
      readBody:
        async () => ({
          stockUniverse:
            "ITDP_REAL_20",

          capital:
            100_000,

          horizon:
            "MEDIUM",

          riskProfile:
            "CONSERVATIVE",

          maxResults:
            5,

          freshnessTtlMs:
            60_000,
        }),

      scan:
        async () => ({
          source:
            "CACHE",

          metadata: {
            scanId:
              "API-CACHE-1",
          },

          result: {
            candidateCount:
              2,
          },
        }),
    });

  assertEqual(
    "Cache Response Status",
    cacheResponse.status,
    200
  );

  assertEqual(
    "Cache Source Passthrough",
    (
      cacheResponse.body as {
        source: string;
      }
    ).source,
    "CACHE"
  );

  console.log("");

  console.log(
    "ALL OPPORTUNITY API ROUTE CONTRACT CASES PASS"
  );
}

run().catch((error) => {
  console.error("");

  console.error(
    "OPPORTUNITY API ROUTE CONTRACT: FAILED"
  );

  console.error(
    error
  );

  process.exit(1);
});
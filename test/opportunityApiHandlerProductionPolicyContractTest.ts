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
    "=== OPPORTUNITY API PRODUCTION SCANNER POLICY CONTRACT ==="
  );

  let capturedInput:
    OpportunityScanAccessInput | null =
      null;

  const response =
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
        async (input) => {
          capturedInput =
            input;

          return {
            source:
              "LIVE",

            result: {
              scannedCount:
                100,

              analyzedCount:
                100,

              failedCount:
                0,

              candidateCount:
                0,

              failures:
                [],

              discovery: {
                universe:
                  "NIFTY_500",

                horizon:
                  "SHORT",

                riskProfile:
                  "BALANCED",

                capital:
                  75_000,

                eligibleCount:
                  0,

                opportunities:
                  [],
              },
            },

            metadata: {
              scanId:
                "POLICY-CONTRACT",

              scannedAt:
                10_000,

              scannedCount:
                100,

              analyzedCount:
                100,

              failedCount:
                0,
            },
          };
        },
    });

  assertEqual(
    "Status",
    response.status,
    200
  );

  if (!capturedInput) {
    throw new Error(
      "Scanner input was not captured."
    );
  }

  const scannerInput =
    capturedInput as OpportunityScanAccessInput;

  assertEqual(
    "Production Scanner Concurrency",
    scannerInput.scannerOptions?.concurrency,
    2
  );

  assertEqual(
    "Production Scanner Batch Size",
    scannerInput.scannerOptions?.batchSize,
    10
  );

  assertEqual(
    "Production Scanner Batch Delay",
    scannerInput.scannerOptions?.batchDelayMs,
    500
  );

  assertEqual(
    "Production Analysis Timeout Disabled",
    scannerInput.scannerOptions?.analysisTimeoutMs,
    undefined
  );

  console.log("");

  console.log(
    "OPPORTUNITY API PRODUCTION SCANNER POLICY CONTRACT: GREEN"
  );
}

run().catch((error) => {
  console.error("");

  console.error(
    "OPPORTUNITY API PRODUCTION SCANNER POLICY CONTRACT: FAILED"
  );

  console.error(
    error
  );

  process.exit(1);
});
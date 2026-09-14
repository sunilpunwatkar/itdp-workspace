import {
  getChartHistoricalWithResilience,
} from "../app/services/chartHistoricalResilienceService";

import type {
  HistoricalOHLC,
} from "../app/providers/historicalProvider";

function assertEqual<T>(
  label: string,
  actual: T,
  expected: T
) {
  if (
    actual !==
      expected
  ) {
    throw new Error(
      `${label} FAILED | Expected=${expected} | Actual=${actual}`
    );
  }

  console.log(
    `PASS | ${label} | ${String(actual)}`
  );
}

async function captureAsyncError(
  operation:
    () => Promise<unknown>
): Promise<string | null> {
  try {
    await operation();

    return null;
  } catch (
    error
  ) {
    return error instanceof Error
      ? error.message
      : String(error);
  }
}

async function run() {
  console.log(
    "=== CHART HISTORICAL RESILIENCE CONTRACT ==="
  );

  const validData:
    HistoricalOHLC = {
      timestamps: [
        1000,
        2000,
        3000,
      ],

      open: [
        100,
        101,
        102,
      ],

      high: [
        102,
        103,
        104,
      ],

      low: [
        99,
        100,
        101,
      ],

      close: [
        101,
        102,
        103,
      ],

      volume: [
        1000,
        1100,
        1200,
      ],
    };

  // ==========================================
  // CASE 1
  // PRIMARY SUCCESS
  // ==========================================

  let saveCalled =
    false;

  const primarySuccess =
    await getChartHistoricalWithResilience(
      "RELIANCE.NS",
      {
        fetchPrimary:
          async () =>
            validData,

        loadPersisted:
          async () =>
            null,

        savePersisted:
          async (
            snapshot
          ) => {
            saveCalled =
              true;

            assertEqual(
              "Saved Symbol",
              snapshot.symbol,
              "RELIANCE.NS"
            );

            assertEqual(
              "Saved Timestamp",
              snapshot.savedAt,
              10_000
            );
          },

        now:
          () =>
            10_000,

        maxFallbackAgeMs:
          60_000,
      }
    );

  assertEqual(
    "Primary Source",
    primarySuccess.source,
    "PRIMARY"
  );

  assertEqual(
    "Primary Last Close",
    primarySuccess.data.close[2],
    103
  );

  assertEqual(
    "Primary Snapshot Save Called",
    saveCalled,
    true
  );

  // ==========================================
  // CASE 2
  // PERSISTENCE FAILURE MUST NOT BREAK PRIMARY
  // ==========================================

  const persistenceFailure =
    await getChartHistoricalWithResilience(
      "RELIANCE.NS",
      {
        fetchPrimary:
          async () =>
            validData,

        loadPersisted:
          async () =>
            null,

        savePersisted:
          async () => {
            throw new Error(
              "CONTROLLED_PERSISTENCE_FAILURE"
            );
          },

        now:
          () =>
            10_000,

        maxFallbackAgeMs:
          60_000,
      }
    );

  assertEqual(
    "Persistence Failure Primary Source",
    persistenceFailure.source,
    "PRIMARY"
  );

  // ==========================================
  // CASE 3
  // PRIMARY FAILURE + VALID FALLBACK
  // ==========================================

  const validFallback =
    await getChartHistoricalWithResilience(
      "RELIANCE.NS",
      {
        fetchPrimary:
          async () => {
            throw new Error(
              "PRIMARY_FAILED"
            );
          },

        loadPersisted:
          async () => ({
            symbol:
              "RELIANCE.NS",

            savedAt:
              10_000,

            data:
              validData,
          }),

        now:
          () =>
            20_000,

        maxFallbackAgeMs:
          60_000,
      }
    );

  assertEqual(
    "Fallback Source",
    validFallback.source,
    "PERSISTED_FALLBACK"
  );

  assertEqual(
    "Fallback Last Close",
    validFallback.data.close[2],
    103
  );

  // ==========================================
  // CASE 4
  // PRIMARY FAILURE + MISSING FALLBACK
  // ==========================================

  assertEqual(
    "Missing Fallback Original Error",
    await captureAsyncError(
      () =>
        getChartHistoricalWithResilience(
          "RELIANCE.NS",
          {
            fetchPrimary:
              async () => {
                throw new Error(
                  "PRIMARY_FAILED"
                );
              },

            loadPersisted:
              async () =>
                null,

            now:
              () =>
                20_000,

            maxFallbackAgeMs:
              60_000,
          }
        )
    ),
    "PRIMARY_FAILED"
  );

  // ==========================================
  // CASE 5
  // PRIMARY FAILURE + TOO OLD FALLBACK
  // ==========================================

  assertEqual(
    "Too Old Fallback Original Error",
    await captureAsyncError(
      () =>
        getChartHistoricalWithResilience(
          "RELIANCE.NS",
          {
            fetchPrimary:
              async () => {
                throw new Error(
                  "PRIMARY_FAILED"
                );
              },

            loadPersisted:
              async () => ({
                symbol:
                  "RELIANCE.NS",

                savedAt:
                  10_000,

                data:
                  validData,
              }),

            now:
              () =>
                70_001,

            maxFallbackAgeMs:
              60_000,
          }
        )
    ),
    "PRIMARY_FAILED"
  );

  // ==========================================
  // CASE 6
  // PRIMARY FAILURE + FUTURE FALLBACK
  // ==========================================

  assertEqual(
    "Future Fallback Original Error",
    await captureAsyncError(
      () =>
        getChartHistoricalWithResilience(
          "RELIANCE.NS",
          {
            fetchPrimary:
              async () => {
                throw new Error(
                  "PRIMARY_FAILED"
                );
              },

            loadPersisted:
              async () => ({
                symbol:
                  "RELIANCE.NS",

                savedAt:
                  30_000,

                data:
                  validData,
              }),

            now:
              () =>
                20_000,

            maxFallbackAgeMs:
              60_000,
          }
        )
    ),
    "PRIMARY_FAILED"
  );

  // ==========================================
  // CASE 7
  // PRIMARY FAILURE + SYMBOL MISMATCH
  // ==========================================

  assertEqual(
    "Symbol Mismatch Original Error",
    await captureAsyncError(
      () =>
        getChartHistoricalWithResilience(
          "RELIANCE.NS",
          {
            fetchPrimary:
              async () => {
                throw new Error(
                  "PRIMARY_FAILED"
                );
              },

            loadPersisted:
              async () => ({
                symbol:
                  "TCS.NS",

                savedAt:
                  10_000,

                data:
                  validData,
              }),

            now:
              () =>
                20_000,

            maxFallbackAgeMs:
              60_000,
          }
        )
    ),
    "PRIMARY_FAILED"
  );

  // ==========================================
  // CASE 8
  // STORAGE LOAD FAILURE
  // ==========================================

  assertEqual(
    "Storage Load Failure Original Error",
    await captureAsyncError(
      () =>
        getChartHistoricalWithResilience(
          "RELIANCE.NS",
          {
            fetchPrimary:
              async () => {
                throw new Error(
                  "PRIMARY_FAILED"
                );
              },

            loadPersisted:
              async () => {
                throw new Error(
                  "CORRUPTED_STORAGE"
                );
              },

            now:
              () =>
                20_000,

            maxFallbackAgeMs:
              60_000,
          }
        )
    ),
    "PRIMARY_FAILED"
  );

  // ==========================================
  // CASE 9
  // INVALID SYMBOL
  // ==========================================

  assertEqual(
    "Invalid Symbol Error",
    await captureAsyncError(
      () =>
        getChartHistoricalWithResilience(
          "",
          {
            fetchPrimary:
              async () =>
                validData,

            loadPersisted:
              async () =>
                null,

            now:
              () =>
                20_000,

            maxFallbackAgeMs:
              60_000,
          }
        )
    ),
    "INVALID_CHART_RESILIENCE_SYMBOL"
  );

  // ==========================================
  // CASE 10
  // INVALID MAX FALLBACK AGE
  // ==========================================

  assertEqual(
    "Invalid Max Age Error",
    await captureAsyncError(
      () =>
        getChartHistoricalWithResilience(
          "RELIANCE.NS",
          {
            fetchPrimary:
              async () =>
                validData,

            loadPersisted:
              async () =>
                null,

            now:
              () =>
                20_000,

            maxFallbackAgeMs:
              -1,
          }
        )
    ),
    "INVALID_CHART_FALLBACK_MAX_AGE"
  );

  console.log("");

  console.log(
    "ALL CHART HISTORICAL RESILIENCE CONTRACT CASES PASS"
  );
}

run().catch(
  (error) => {
    console.error("");

    console.error(
      "CHART HISTORICAL RESILIENCE CONTRACT: FAILED"
    );

    console.error(
      error
    );

    process.exit(1);
  }
);
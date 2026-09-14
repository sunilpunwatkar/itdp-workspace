import {
  getChartHistoricalRuntime,
} from "../app/services/chartHistoricalRuntimeService";

import type {
  HistoricalOHLC,
} from "../app/providers/historicalProvider";

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

async function captureAsyncError(
  operation: () => Promise<unknown>
): Promise<string | null> {
  try {
    await operation();
    return null;
  } catch (error) {
    return error instanceof Error
      ? error.message
      : String(error);
  }
}

async function run() {
  console.log(
    "=== CHART HISTORICAL RUNTIME CONTRACT ==="
  );

  const baseData: HistoricalOHLC = {
    timestamps: [1000, 2000, 3000],
    open: [100, 101, 102],
    high: [102, 103, 104],
    low: [99, 100, 101],
    close: [101, 102, 103],
    volume: [1000, 1100, 1200],
  };

  // ==========================================
  // CASE 1
  // PRIMARY SUCCESS + NO EXISTING SNAPSHOT
  // MUST SAVE
  // ==========================================

  let saveCount = 0;

  let savedTimestamp =
    0;

  const first =
    await getChartHistoricalRuntime(
      "RELIANCE.NS",
      {
        fetchPrimary:
          async () =>
            baseData,

        loadPersisted:
          async () =>
            null,

        savePersisted:
          async (
            snapshot
          ) => {
            saveCount += 1;

            savedTimestamp =
              snapshot.savedAt;
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
    first.source,
    "PRIMARY"
  );

  assertEqual(
    "Initial Save Count",
    saveCount,
    1
  );

  assertEqual(
    "Initial Saved Timestamp",
    savedTimestamp,
    10_000
  );

  // ==========================================
  // CASE 2
  // SAME MARKET DATA
  // MUST NOT REFRESH savedAt
  // ==========================================

  saveCount = 0;

  const sameData =
    await getChartHistoricalRuntime(
      "RELIANCE.NS",
      {
        fetchPrimary:
          async () =>
            baseData,

        loadPersisted:
          async () => ({
            symbol:
              "RELIANCE.NS",

            savedAt:
              5_000,

            data:
              baseData,
          }),

        savePersisted:
          async () => {
            saveCount += 1;
          },

        now:
          () =>
            20_000,

        maxFallbackAgeMs:
          60_000,
      }
    );

  assertEqual(
    "Same Data Source",
    sameData.source,
    "PRIMARY"
  );

  assertEqual(
    "Same Data Save Count",
    saveCount,
    0
  );

  // ==========================================
  // CASE 3
  // SAME LAST TIMESTAMP BUT CANDLE CHANGED
  // MUST SAVE
  // ==========================================

  const changedData:
    HistoricalOHLC = {
      ...baseData,

      close: [
        101,
        102,
        104,
      ],

      volume: [
        1000,
        1100,
        1500,
      ],
    };

  saveCount = 0;

  const changed =
    await getChartHistoricalRuntime(
      "RELIANCE.NS",
      {
        fetchPrimary:
          async () =>
            changedData,

        loadPersisted:
          async () => ({
            symbol:
              "RELIANCE.NS",

            savedAt:
              5_000,

            data:
              baseData,
          }),

        savePersisted:
          async () => {
            saveCount += 1;
          },

        now:
          () =>
            20_000,

        maxFallbackAgeMs:
          60_000,
      }
    );

  assertEqual(
    "Changed Data Source",
    changed.source,
    "PRIMARY"
  );

  assertEqual(
    "Changed Data Save Count",
    saveCount,
    1
  );

  // ==========================================
  // CASE 4
  // NEW CANDLE
  // MUST SAVE
  // ==========================================

  const newerData:
    HistoricalOHLC = {
      timestamps: [
        1000,
        2000,
        3000,
        4000,
      ],

      open: [
        100,
        101,
        102,
        103,
      ],

      high: [
        102,
        103,
        104,
        105,
      ],

      low: [
        99,
        100,
        101,
        102,
      ],

      close: [
        101,
        102,
        103,
        104,
      ],

      volume: [
        1000,
        1100,
        1200,
        1300,
      ],
    };

  saveCount = 0;

  await getChartHistoricalRuntime(
    "RELIANCE.NS",
    {
      fetchPrimary:
        async () =>
          newerData,

      loadPersisted:
        async () => ({
          symbol:
            "RELIANCE.NS",

          savedAt:
            5_000,

          data:
            baseData,
        }),

      savePersisted:
        async () => {
          saveCount += 1;
        },

      now:
        () =>
          20_000,

      maxFallbackAgeMs:
        60_000,
    }
  );

  assertEqual(
    "New Candle Save Count",
    saveCount,
    1
  );

  // ==========================================
  // CASE 5
  // PRIMARY FAILURE + VALID FALLBACK
  // ==========================================

  const fallback =
    await getChartHistoricalRuntime(
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
              baseData,
          }),

        savePersisted:
          async () => {
            throw new Error(
              "SHOULD_NOT_SAVE"
            );
          },

        now:
          () =>
            20_000,

        maxFallbackAgeMs:
          60_000,
      }
    );

  assertEqual(
    "Fallback Source",
    fallback.source,
    "PERSISTED_FALLBACK"
  );

  assertEqual(
    "Fallback Last Close",
    fallback.data.close[2],
    103
  );

  // ==========================================
  // CASE 6
  // TOO OLD FALLBACK
  // ORIGINAL PRIMARY ERROR
  // ==========================================

  assertEqual(
    "Too Old Fallback Error",
    await captureAsyncError(
      () =>
        getChartHistoricalRuntime(
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
                  baseData,
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
  // CASE 7
  // STORAGE LOAD FAILURE
  // PRIMARY SUCCESS MUST STILL WORK
  // ==========================================

  saveCount = 0;

  const corruptExisting =
    await getChartHistoricalRuntime(
      "RELIANCE.NS",
      {
        fetchPrimary:
          async () =>
            baseData,

        loadPersisted:
          async () => {
            throw new Error(
              "CORRUPTED_STORAGE"
            );
          },

        savePersisted:
          async () => {
            saveCount += 1;
          },

        now:
          () =>
            30_000,

        maxFallbackAgeMs:
          60_000,
      }
    );

  assertEqual(
    "Corrupt Existing Primary Source",
    corruptExisting.source,
    "PRIMARY"
  );

  assertEqual(
    "Corrupt Existing Replacement Save",
    saveCount,
    1
  );

  // ==========================================
  // CASE 8
  // SAVE FAILURE
  // PRIMARY MUST STILL WORK
  // ==========================================

  const saveFailure =
    await getChartHistoricalRuntime(
      "RELIANCE.NS",
      {
        fetchPrimary:
          async () =>
            newerData,

        loadPersisted:
          async () =>
            null,

        savePersisted:
          async () => {
            throw new Error(
              "DISK_WRITE_FAILED"
            );
          },

        now:
          () =>
            40_000,

        maxFallbackAgeMs:
          60_000,
      }
    );

  assertEqual(
    "Save Failure Primary Source",
    saveFailure.source,
    "PRIMARY"
  );

  console.log("");

  console.log(
    "ALL CHART HISTORICAL RUNTIME CONTRACT CASES PASS"
  );
}

run().catch(
  (error) => {
    console.error("");

    console.error(
      "CHART HISTORICAL RUNTIME CONTRACT: FAILED"
    );

    console.error(
      error
    );

    process.exit(1);
  }
);
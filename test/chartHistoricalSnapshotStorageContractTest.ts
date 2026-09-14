import {
  mkdtemp,
  rm,
  writeFile,
} from "node:fs/promises";

import {
  join,
} from "node:path";

import {
  tmpdir,
} from "node:os";

import {
  loadPersistedChartHistoricalSnapshot,
  savePersistedChartHistoricalSnapshot,
} from "../app/services/chartHistoricalSnapshotStorageService";

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
    "=== CHART HISTORICAL SNAPSHOT STORAGE CONTRACT ==="
  );

  const directory =
    await mkdtemp(
      join(
        tmpdir(),
        "itdp-chart-snapshot-"
      )
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

  try {
    // ==========================================
    // CASE 1
    // MISSING FILE
    // ==========================================

    const missing =
      await loadPersistedChartHistoricalSnapshot(
        "RELIANCE.NS",
        {
          directory,
        }
      );

    assertEqual(
      "Missing Snapshot",
      missing,
      null
    );

    // ==========================================
    // CASE 2
    // SAVE + LOAD
    // ==========================================

    await savePersistedChartHistoricalSnapshot(
      {
        symbol:
          "RELIANCE.NS",

        savedAt:
          10_000,

        data:
          validData,
      },
      {
        directory,
      }
    );

    const loaded =
      await loadPersistedChartHistoricalSnapshot(
        "RELIANCE.NS",
        {
          directory,
        }
      );

    assertEqual(
      "Loaded Snapshot Exists",
      loaded !== null,
      true
    );

    assertEqual(
      "Loaded Symbol",
      loaded?.symbol,
      "RELIANCE.NS"
    );

    assertEqual(
      "Loaded Timestamp",
      loaded?.savedAt,
      10_000
    );

    assertEqual(
      "Loaded Candle Count",
      loaded?.data.timestamps.length,
      3
    );

    assertEqual(
      "Loaded Last Close",
      loaded?.data.close[2],
      103
    );

    // ==========================================
    // CASE 3
    // SECOND SYMBOL IS INDEPENDENT
    // ==========================================

    await savePersistedChartHistoricalSnapshot(
      {
        symbol:
          "TCS.NS",

        savedAt:
          20_000,

        data:
          validData,
      },
      {
        directory,
      }
    );

    const tcs =
      await loadPersistedChartHistoricalSnapshot(
        "TCS.NS",
        {
          directory,
        }
      );

    assertEqual(
      "Second Symbol",
      tcs?.symbol,
      "TCS.NS"
    );

    // ==========================================
    // CASE 4
    // INVALID SAVE SYMBOL
    // ==========================================

    assertEqual(
      "Invalid Save Symbol Error",
      await captureAsyncError(
        () =>
          savePersistedChartHistoricalSnapshot(
            {
              symbol:
                "",

              savedAt:
                10_000,

              data:
                validData,
            },
            {
              directory,
            }
          )
      ),
      "INVALID_PERSISTED_SNAPSHOT"
    );

    // ==========================================
    // CASE 5
    // INVALID OHLC SHAPE
    // ==========================================

    const invalidData:
      HistoricalOHLC = {
        timestamps: [
          1000,
          2000,
        ],

        open: [
          100,
          101,
        ],

        high: [
          102,
          103,
        ],

        low: [
          99,
          100,
        ],

        close: [
          101,
        ],

        volume: [
          1000,
          1100,
        ],
      };

    assertEqual(
      "Invalid Data Error",
      await captureAsyncError(
        () =>
          savePersistedChartHistoricalSnapshot(
            {
              symbol:
                "BAD.NS",

              savedAt:
                10_000,

              data:
                invalidData,
            },
            {
              directory,
            }
          )
      ),
      "INVALID_PERSISTED_SNAPSHOT"
    );

    // ==========================================
    // CASE 6
    // CORRUPTED JSON FILE
    // ==========================================

    await writeFile(
      join(
        directory,
        `${encodeURIComponent(
          "CORRUPT.NS"
        )}.json`
      ),
      "{not-valid-json",
      "utf8"
    );

    assertEqual(
      "Corrupted JSON Error",
      await captureAsyncError(
        () =>
          loadPersistedChartHistoricalSnapshot(
            "CORRUPT.NS",
            {
              directory,
            }
          )
      ),
      "INVALID_PERSISTED_SNAPSHOT"
    );

    // ==========================================
    // CASE 7
    // SYMBOL MISMATCH
    // ==========================================

    await writeFile(
      join(
        directory,
        `${encodeURIComponent(
          "EXPECTED.NS"
        )}.json`
      ),
      JSON.stringify({
        symbol:
          "WRONG.NS",

        savedAt:
          10_000,

        data:
          validData,
      }),
      "utf8"
    );

    assertEqual(
      "Symbol Mismatch Error",
      await captureAsyncError(
        () =>
          loadPersistedChartHistoricalSnapshot(
            "EXPECTED.NS",
            {
              directory,
            }
          )
      ),
      "PERSISTED_SNAPSHOT_SYMBOL_MISMATCH"
    );

    console.log("");

    console.log(
      "ALL CHART HISTORICAL SNAPSHOT STORAGE CONTRACT CASES PASS"
    );
  } finally {
    await rm(
      directory,
      {
        recursive:
          true,

        force:
          true,
      }
    );
  }
}

run().catch(
  (error) => {
    console.error("");

    console.error(
      "CHART HISTORICAL SNAPSHOT STORAGE CONTRACT: FAILED"
    );

    console.error(
      error
    );

    process.exit(1);
  }
);
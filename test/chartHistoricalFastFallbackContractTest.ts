import {
  getChartHistoricalRuntime,
} from "../app/services/chartHistoricalRuntimeService";

import type {
  HistoricalOHLC,
} from "../app/providers/historicalProvider";

async function run() {
  console.log(
    "=== CHART FAST FALLBACK CONTRACT ==="
  );

  const fallbackData: HistoricalOHLC = {
    timestamps: [1000, 2000, 3000],
    open: [100, 101, 102],
    high: [102, 103, 104],
    low: [99, 100, 101],
    close: [101, 102, 103],
    volume: [1000, 1100, 1200],
  };

  const startedAt = Date.now();

  const result =
    await getChartHistoricalRuntime(
      "RELIANCE.NS",
      {
        fetchPrimary:
          () =>
            new Promise<HistoricalOHLC>(
              () => {}
            ),

        loadPersisted:
          async () => ({
            symbol: "RELIANCE.NS",
            savedAt: 10_000,
            data: fallbackData,
          }),

        now:
          () => 20_000,

        maxFallbackAgeMs:
          60_000,

        primaryTimeoutMs:
          50,
      }
    );

  const elapsedMs =
    Date.now() - startedAt;

  if (
    result.source !==
    "PERSISTED_FALLBACK"
  ) {
    throw new Error(
      `Expected PERSISTED_FALLBACK, received ${result.source}`
    );
  }

  if (elapsedMs > 500) {
    throw new Error(
      `Chart fallback was not bounded: ${elapsedMs} ms`
    );
  }

  if (
    result.data.close[2] !== 103
  ) {
    throw new Error(
      "Unexpected fallback data"
    );
  }

  console.log(
    "PASS: Slow primary uses bounded persisted chart fallback"
  );
}

run().catch((error) => {
  console.error(
    "CHART FAST FALLBACK CONTRACT: FAIL"
  );

  console.error(error);

  process.exit(1);
});

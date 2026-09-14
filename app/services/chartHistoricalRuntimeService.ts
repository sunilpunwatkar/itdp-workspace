import type {
  HistoricalOHLC,
} from "../providers/historicalProvider";

import {
  getCachedHistoricalOHLC,
} from "./historicalDataCache";

import {
  getChartHistoricalWithResilience,
  ChartHistoricalResilienceResult,
} from "./chartHistoricalResilienceService";

import {
  loadPersistedChartHistoricalSnapshot,
  savePersistedChartHistoricalSnapshot,
  PersistedChartHistoricalSnapshot,
} from "./chartHistoricalSnapshotStorageService";

// ==========================================
// FALLBACK AGE POLICY
// Chart only — never Analysis / Decision
// ==========================================

export const DEFAULT_CHART_FALLBACK_MAX_AGE_MS =
  7 * 24 * 60 * 60 * 1000;

export interface ChartHistoricalRuntimeDependencies {
  fetchPrimary?:
    () => Promise<HistoricalOHLC>;

  loadPersisted?:
    () => Promise<
      PersistedChartHistoricalSnapshot | null
    >;

  savePersisted?:
    (
      snapshot:
        PersistedChartHistoricalSnapshot
    ) => Promise<void>;

  now?:
    () => number;

  maxFallbackAgeMs?:
    number;
}

// ==========================================
// COMPARE LAST-GOOD MARKET DATA
// ==========================================

function hasSnapshotDataChanged(
  current:
    HistoricalOHLC,

  persisted:
    HistoricalOHLC
): boolean {
  if (
    current.timestamps.length !==
      persisted.timestamps.length
  ) {
    return true;
  }

  if (
    current.timestamps.length === 0
  ) {
    return false;
  }

  const currentIndex =
    current.timestamps.length - 1;

  const persistedIndex =
    persisted.timestamps.length - 1;

  return (
    current.timestamps[currentIndex] !==
      persisted.timestamps[persistedIndex] ||

    current.open[currentIndex] !==
      persisted.open[persistedIndex] ||

    current.high[currentIndex] !==
      persisted.high[persistedIndex] ||

    current.low[currentIndex] !==
      persisted.low[persistedIndex] ||

    current.close[currentIndex] !==
      persisted.close[persistedIndex] ||

    current.volume[currentIndex] !==
      persisted.volume[persistedIndex]
  );
}

// ==========================================
// MAIN CHART HISTORICAL RUNTIME
// ==========================================

export async function getChartHistoricalRuntime(
  symbol:
    string,

  dependencies:
    ChartHistoricalRuntimeDependencies = {}
): Promise<
  ChartHistoricalResilienceResult
> {
  const fetchPrimary =
    dependencies.fetchPrimary ??
    (() =>
      getCachedHistoricalOHLC(
        symbol
      ));

  const loadPersisted =
    dependencies.loadPersisted ??
    (() =>
      loadPersistedChartHistoricalSnapshot(
        symbol
      ));

  const savePersisted =
    dependencies.savePersisted ??
    ((
      snapshot:
        PersistedChartHistoricalSnapshot
    ) =>
      savePersistedChartHistoricalSnapshot(
        snapshot
      ));

  const now =
    dependencies.now ??
    (() =>
      Date.now());

  const maxFallbackAgeMs =
    dependencies.maxFallbackAgeMs ??
    DEFAULT_CHART_FALLBACK_MAX_AGE_MS;

  return getChartHistoricalWithResilience(
    symbol,
    {
      fetchPrimary,

      loadPersisted,

      now,

      maxFallbackAgeMs,

      savePersisted:
        async (
          snapshot
        ) => {
          let existing:
            PersistedChartHistoricalSnapshot | null =
              null;

          try {
            existing =
              await loadPersisted();
          } catch {
            // Corrupted/unreadable persisted
            // snapshot may be replaced by a
            // successful primary response.
            existing =
              null;
          }

          if (
            existing &&
            !hasSnapshotDataChanged(
              snapshot.data,
              existing.data
            )
          ) {
            // Same market snapshot.
            // Preserve original savedAt so
            // stale data cannot become
            // artificially fresh.
            return;
          }

          await savePersisted(
            snapshot
          );
        },
    }
  );
}
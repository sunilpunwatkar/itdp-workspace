import type {
  HistoricalOHLC,
} from "../providers/historicalProvider";

export type ChartHistoricalResilienceSource =
  | "PRIMARY"
  | "PERSISTED_FALLBACK";

export interface ChartHistoricalResilienceResult {
  source:
    ChartHistoricalResilienceSource;

  data:
    HistoricalOHLC;
}

export interface PersistedHistoricalSnapshot {
  symbol: string;

  savedAt:
    number;

  data:
    HistoricalOHLC;
}

export interface ChartHistoricalResilienceDependencies {
  fetchPrimary:
    () => Promise<HistoricalOHLC>;

  loadPersisted:
    () => Promise<
      PersistedHistoricalSnapshot | null
    >;

  savePersisted?:
    (
      snapshot:
        PersistedHistoricalSnapshot
    ) => Promise<void>;

  now:
    () => number;

  maxFallbackAgeMs:
    number;
}

function isValidSnapshotAge(
  savedAt: number,
  now: number,
  maxAgeMs: number
): boolean {
  if (
    !Number.isFinite(
      savedAt
    ) ||
    savedAt < 0
  ) {
    return false;
  }

  if (
    !Number.isFinite(
      now
    ) ||
    now < 0
  ) {
    return false;
  }

  if (
    !Number.isFinite(
      maxAgeMs
    ) ||
    maxAgeMs < 0
  ) {
    return false;
  }

  const age =
    now -
    savedAt;

  if (
    age < 0
  ) {
    return false;
  }

  return (
    age <=
    maxAgeMs
  );
}

export async function getChartHistoricalWithResilience(
  symbol: string,
  dependencies:
    ChartHistoricalResilienceDependencies
): Promise<
  ChartHistoricalResilienceResult
> {
  if (
    typeof symbol !==
      "string" ||
    symbol.trim() ===
      ""
  ) {
    throw new Error(
      "INVALID_CHART_RESILIENCE_SYMBOL"
    );
  }

  if (
    !Number.isFinite(
      dependencies.maxFallbackAgeMs
    ) ||
    dependencies.maxFallbackAgeMs <
      0
  ) {
    throw new Error(
      "INVALID_CHART_FALLBACK_MAX_AGE"
    );
  }

  let primaryError:
    unknown;

  try {
    const data =
      await dependencies.fetchPrimary();

    if (
      dependencies.savePersisted
    ) {
      try {
        await dependencies.savePersisted(
          {
            symbol,

            savedAt:
              dependencies.now(),

            data,
          }
        );
      } catch {
        // Persistence is a resilience aid.
        // It must never break a successful
        // primary historical response.
      }
    }

    return {
      source:
        "PRIMARY",

      data,
    };
  } catch (
    error
  ) {
    primaryError =
      error;
  }

  let persisted:
    PersistedHistoricalSnapshot | null =
      null;

  try {
    persisted =
      await dependencies.loadPersisted();
  } catch {
    persisted =
      null;
  }

  if (
    persisted &&
    persisted.symbol ===
      symbol
  ) {
    const now =
      dependencies.now();

    if (
      isValidSnapshotAge(
        persisted.savedAt,
        now,
        dependencies.maxFallbackAgeMs
      )
    ) {
      return {
        source:
          "PERSISTED_FALLBACK",

        data:
          persisted.data,
      };
    }
  }

  throw primaryError;
}
import type {
  HistoricalOHLC,
} from "../providers/historicalProvider";

export interface ChartHistoricalSnapshot {
  symbol: string;

  savedAt:
    number;

  data:
    HistoricalOHLC;
}

export interface LoadChartHistoricalSnapshotInput {
  symbol: string;

  now:
    number;

  maxAgeMs:
    number;
}

const snapshots =
  new Map<
    string,
    ChartHistoricalSnapshot
  >();

function validateHistoricalOHLC(
  data:
    HistoricalOHLC
): true {
  const lengths = [
    data.timestamps.length,
    data.open.length,
    data.high.length,
    data.low.length,
    data.close.length,
    data.volume.length,
  ];

  if (
    lengths.some(
      (length) =>
        length <= 0
    )
  ) {
    throw new Error(
      "INVALID_HISTORICAL_SNAPSHOT_DATA"
    );
  }

  const firstLength =
    lengths[0];

  if (
    lengths.some(
      (length) =>
        length !==
        firstLength
    )
  ) {
    throw new Error(
      "INVALID_HISTORICAL_SNAPSHOT_DATA"
    );
  }

  return true;
}

export function saveChartHistoricalSnapshot(
  symbol: string,
  savedAt: number,
  data: HistoricalOHLC
): void {
  if (
    typeof symbol !==
      "string" ||
    symbol.trim() ===
      ""
  ) {
    throw new Error(
      "INVALID_SNAPSHOT_SYMBOL"
    );
  }

  if (
    !Number.isFinite(
      savedAt
    ) ||
    savedAt < 0
  ) {
    throw new Error(
      "INVALID_SNAPSHOT_TIMESTAMP"
    );
  }

  validateHistoricalOHLC(
    data
  );

  snapshots.set(
    symbol,
    {
      symbol,
      savedAt,
      data,
    }
  );
}

export function loadChartHistoricalSnapshot(
  input:
    LoadChartHistoricalSnapshotInput
): ChartHistoricalSnapshot | null {
  if (
    typeof input.symbol !==
      "string" ||
    input.symbol.trim() ===
      ""
  ) {
    throw new Error(
      "INVALID_SNAPSHOT_SYMBOL"
    );
  }

  if (
    !Number.isFinite(
      input.now
    ) ||
    input.now < 0
  ) {
    throw new Error(
      "INVALID_SNAPSHOT_NOW"
    );
  }

  if (
    !Number.isFinite(
      input.maxAgeMs
    ) ||
    input.maxAgeMs < 0
  ) {
    throw new Error(
      "INVALID_SNAPSHOT_MAX_AGE"
    );
  }

  const snapshot =
    snapshots.get(
      input.symbol
    );

  if (!snapshot) {
    return null;
  }

  const age =
    input.now -
    snapshot.savedAt;

  if (
    age < 0 ||
    age >
      input.maxAgeMs
  ) {
    return null;
  }

  validateHistoricalOHLC(
    snapshot.data
  );

  return snapshot;
}

// ==========================================
// TEST SUPPORT
// ==========================================

export function clearChartHistoricalSnapshotsForTest(
  symbol?: string
): void {
  if (symbol) {
    snapshots.delete(
      symbol
    );

    return;
  }

  snapshots.clear();
}
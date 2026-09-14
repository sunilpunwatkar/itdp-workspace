import {
  mkdir,
  readFile,
  writeFile,
} from "node:fs/promises";

import {
  join,
} from "node:path";

import type {
  HistoricalOHLC,
} from "../providers/historicalProvider";

export interface PersistedChartHistoricalSnapshot {
  symbol: string;

  savedAt:
    number;

  data:
    HistoricalOHLC;
}

export interface ChartHistoricalSnapshotStorageOptions {
  directory?:
    string;
}

const DEFAULT_DIRECTORY =
  join(
    process.cwd(),
    "runtime-data",
    "chart-historical-snapshots"
  );

function resolveDirectory(
  options:
    ChartHistoricalSnapshotStorageOptions = {}
): string {
  return (
    options.directory ??
    DEFAULT_DIRECTORY
  );
}

function buildSnapshotFileName(
  symbol: string
): string {
  if (
    typeof symbol !== "string" ||
    symbol.trim() === ""
  ) {
    throw new Error(
      "INVALID_SNAPSHOT_STORAGE_SYMBOL"
    );
  }

  return `${encodeURIComponent(
    symbol
  )}.json`;
}

function validatePersistedSnapshot(
  value:
    unknown
): PersistedChartHistoricalSnapshot {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    throw new Error(
      "INVALID_PERSISTED_SNAPSHOT"
    );
  }

  const snapshot =
    value as Partial<
      PersistedChartHistoricalSnapshot
    >;

  if (
    typeof snapshot.symbol !==
      "string" ||
    snapshot.symbol.trim() ===
      ""
  ) {
    throw new Error(
      "INVALID_PERSISTED_SNAPSHOT"
    );
  }

  if (
    typeof snapshot.savedAt !==
      "number" ||
    !Number.isFinite(
      snapshot.savedAt
    ) ||
    snapshot.savedAt < 0
  ) {
    throw new Error(
      "INVALID_PERSISTED_SNAPSHOT"
    );
  }

  const data =
    snapshot.data;

  if (
    typeof data !== "object" ||
    data === null
  ) {
    throw new Error(
      "INVALID_PERSISTED_SNAPSHOT"
    );
  }

  const arrays = [
    data.timestamps,
    data.open,
    data.high,
    data.low,
    data.close,
    data.volume,
  ];

  if (
    arrays.some(
      (array) =>
        !Array.isArray(array)
    )
  ) {
    throw new Error(
      "INVALID_PERSISTED_SNAPSHOT"
    );
  }

  const lengths =
    arrays.map(
      (array) =>
        array.length
    );

  if (
    lengths.some(
      (length) =>
        length <= 0
    )
  ) {
    throw new Error(
      "INVALID_PERSISTED_SNAPSHOT"
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
      "INVALID_PERSISTED_SNAPSHOT"
    );
  }

  return snapshot as PersistedChartHistoricalSnapshot;
}

export async function savePersistedChartHistoricalSnapshot(
  snapshot:
    PersistedChartHistoricalSnapshot,

  options:
    ChartHistoricalSnapshotStorageOptions = {}
): Promise<void> {
  const validated =
    validatePersistedSnapshot(
      snapshot
    );

  const directory =
    resolveDirectory(
      options
    );

  await mkdir(
    directory,
    {
      recursive:
        true,
    }
  );

  const filePath =
    join(
      directory,
      buildSnapshotFileName(
        validated.symbol
      )
    );

  const serialized =
    JSON.stringify(
      validated
    );

  await writeFile(
    filePath,
    serialized,
    "utf8"
  );
}

export async function loadPersistedChartHistoricalSnapshot(
  symbol:
    string,

  options:
    ChartHistoricalSnapshotStorageOptions = {}
): Promise<
  PersistedChartHistoricalSnapshot | null
> {
  const directory =
    resolveDirectory(
      options
    );

  const filePath =
    join(
      directory,
      buildSnapshotFileName(
        symbol
      )
    );

  let raw:
    string;

  try {
    raw =
      await readFile(
        filePath,
        "utf8"
      );
  } catch (
    error
  ) {
    if (
      error instanceof Error &&
      "code" in error &&
      (
        error as NodeJS.ErrnoException
      ).code === "ENOENT"
    ) {
      return null;
    }

    throw error;
  }

  let parsed:
    unknown;

  try {
    parsed =
      JSON.parse(
        raw
      );
  } catch {
    throw new Error(
      "INVALID_PERSISTED_SNAPSHOT"
    );
  }

  const validated =
    validatePersistedSnapshot(
      parsed
    );

  if (
    validated.symbol !==
      symbol
  ) {
    throw new Error(
      "PERSISTED_SNAPSHOT_SYMBOL_MISMATCH"
    );
  }

  return validated;
}
import {
  buildScanMetadata,
  ScanMetadata,
} from "./scanMetadataService";

import {
  runSharedScan,
} from "./scanInFlightCoordinatorService";

import {
  getFreshScan,
  saveSuccessfulScan,
} from "./scanFreshnessService";

export interface OrchestratedScanResult<T> {
  source:
    | "LIVE"
    | "CACHE";

  metadata:
    ScanMetadata;

  result:
    T;
}

export interface ScanOrchestratorOptions<T> {
  universe:
    string;

  freshnessTtlMs:
    number;

  now:
    () => number;

  createScanId:
    () => string;

  scan:
    () => Promise<T>;

  getCounts:
    (
      result: T
    ) => {
      scannedCount:
        number;

      analyzedCount:
        number;

      failedCount:
        number;
    };
}

interface StoredScan<T> {
  metadata:
    ScanMetadata;

  result:
    T;
}

export async function orchestrateScan<T>(
  options:
    ScanOrchestratorOptions<T>
): Promise<
  OrchestratedScanResult<T>
> {
  const now =
    options.now();

  const fresh =
    getFreshScan<
      StoredScan<T>
    >(
      options.universe,
      now,
      options.freshnessTtlMs
    );

  if (fresh) {
    return {
      source:
        "CACHE",

      metadata:
        fresh.result.metadata,

      result:
        fresh.result.result,
    };
  }

  return runSharedScan(
    options.universe,
    async () => {
      const startedAt =
        options.now();

      const scanId =
        options.createScanId();

      const result =
        await options.scan();

      const completedAt =
        options.now();

      const counts =
        options.getCounts(
          result
        );

      const metadata =
        buildScanMetadata({
          scanId,

          universe:
            options.universe,

          startedAt,

          completedAt,

          scannedCount:
            counts.scannedCount,

          analyzedCount:
            counts.analyzedCount,

          failedCount:
            counts.failedCount,
        });

      const stored:
        StoredScan<T> = {
          metadata,

          result,
        };

      saveSuccessfulScan(
        options.universe,
        completedAt,
        stored
      );

      return {
        source:
          "LIVE",

        metadata,

        result,
      };
    }
  );
}
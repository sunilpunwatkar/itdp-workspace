export interface ScanMetadata {
  scanId: string;
  universe: string;

  startedAt: number;
  completedAt: number;
  durationMs: number;

  scannedCount: number;
  analyzedCount: number;
  failedCount: number;
}

export interface BuildScanMetadataInput {
  scanId: string;
  universe: string;

  startedAt: number;
  completedAt: number;

  scannedCount: number;
  analyzedCount: number;
  failedCount: number;
}

export function buildScanMetadata(
  input: BuildScanMetadataInput
): ScanMetadata {
  if (
    input.completedAt <
    input.startedAt
  ) {
    throw new Error(
      "Scan completedAt cannot be earlier than startedAt."
    );
  }

  return {
    scanId:
      input.scanId,

    universe:
      input.universe,

    startedAt:
      input.startedAt,

    completedAt:
      input.completedAt,

    durationMs:
      input.completedAt -
      input.startedAt,

    scannedCount:
      input.scannedCount,

    analyzedCount:
      input.analyzedCount,

    failedCount:
      input.failedCount,
  };
}
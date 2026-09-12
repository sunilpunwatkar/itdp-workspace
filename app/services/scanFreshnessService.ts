export interface ScanSnapshot<T> {
  universe: string;
  completedAt: number;
  result: T;
}

const snapshots =
  new Map<
    string,
    ScanSnapshot<unknown>
  >();

export function saveSuccessfulScan<T>(
  universe: string,
  completedAt: number,
  result: T
): void {
  snapshots.set(
    universe,
    {
      universe,
      completedAt,
      result,
    }
  );
}

export function getFreshScan<T>(
  universe: string,
  now: number,
  ttlMs: number
): ScanSnapshot<T> | null {
  if (
    !Number.isFinite(ttlMs) ||
    ttlMs < 0
  ) {
    throw new Error(
      "Scan freshness TTL must be a non-negative number."
    );
  }

  const snapshot =
    snapshots.get(
      universe
    );

  if (!snapshot) {
    return null;
  }

  const age =
    now -
    snapshot.completedAt;

  if (
    age < 0 ||
    age >= ttlMs
  ) {
    return null;
  }

  return snapshot as ScanSnapshot<T>;
}

// ==========================================
// TEST SUPPORT
// ==========================================

export function clearScanFreshnessForTest(
  universe?: string
): void {
  if (universe) {
    snapshots.delete(
      universe
    );

    return;
  }

  snapshots.clear();
}
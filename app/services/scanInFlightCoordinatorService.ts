type ScanOperation<T> =
  () => Promise<T>;

const inFlightScans =
  new Map<string, Promise<unknown>>();

export async function runSharedScan<T>(
  universe: string,
  operation: ScanOperation<T>
): Promise<T> {
  const existing =
    inFlightScans.get(
      universe
    );

  if (existing) {
    return existing as Promise<T>;
  }

  const scanPromise =
    operation();

  inFlightScans.set(
    universe,
    scanPromise
  );

  try {
    return await scanPromise;
  } finally {
    if (
      inFlightScans.get(
        universe
      ) === scanPromise
    ) {
      inFlightScans.delete(
        universe
      );
    }
  }
}
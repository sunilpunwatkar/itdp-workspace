
import {
  HistoricalProvider,
} from "../app/providers/historicalProvider";

function assertEqual<T>(
  label: string,
  actual: T,
  expected: T
) {
  if (actual !== expected) {
    throw new Error(
      `${label} FAILED | Expected=${expected} | Actual=${actual}`
    );
  }

  console.log(
    `PASS | ${label} | ${String(actual)}`
  );
}

async function run() {
  console.log(
    "=== HISTORICAL PROVIDER HARD DEADLINE CONTRACT ==="
  );

  const originalFetch = globalThis.fetch;
  const originalSetTimeout = globalThis.setTimeout;

  let fetchCount = 0;
  let abortCount = 0;

  const backoffDelays: number[] = [];

  try {
    globalThis.setTimeout = ((
      callback: (...args: unknown[]) => void,
      delay?: number,
      ...args: unknown[]
    ) => {
      if (delay === 12_000) {
        return originalSetTimeout(
          callback,
          0,
          ...args
        );
      }

      return originalSetTimeout(
        callback,
        delay,
        ...args
      );
    }) as typeof setTimeout;

    globalThis.fetch = async (
      _input,
      init
    ) => {
      fetchCount += 1;

      const signal = init?.signal;

      if (!signal) {
        throw new Error(
          "Fetch did not receive an abort signal"
        );
      }

      return new Promise<Response>(() => {
        signal.addEventListener(
          "abort",
          () => {
            abortCount += 1;

            // Deliberately ignore cancellation.
            // Fetch remains pending.
          },
          { once: true }
        );
      });
    };

    const provider = new HistoricalProvider(
      async (delayMs: number) => {
        backoffDelays.push(delayMs);
      }
    );

    const watchdog = new Promise<never>(
      (_resolve, reject) => {
        originalSetTimeout(
          () => {
            reject(
              new Error(
                "WATCHDOG: Provider did not settle"
              )
            );
          },
          1000
        );
      }
    );

    let finalError = "";

    try {
      await Promise.race([
        provider.getHistoricalOHLC(
          "TEST.HANGING.FETCH.NS"
        ),
        watchdog,
      ]);
    } catch (error) {
      finalError =
        error instanceof Error
          ? error.message
          : String(error);
    }

    assertEqual(
      "Fetch Attempts",
      fetchCount,
      3
    );

    assertEqual(
      "Abort Events",
      abortCount,
      3
    );

    assertEqual(
      "First Backoff",
      backoffDelays[0],
      500
    );

    assertEqual(
      "Second Backoff",
      backoffDelays[1],
      1000
    );

    assertEqual(
      "Final Timeout Error",
      finalError,
      "Yahoo OHLC request timed out after 12s for TEST.HANGING.FETCH.NS"
    );

    console.log(
      "HISTORICAL PROVIDER HARD DEADLINE CONTRACT: GREEN"
    );
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.setTimeout = originalSetTimeout;
  }
}

run().catch((error) => {
  console.error(
    "HISTORICAL PROVIDER HARD DEADLINE CONTRACT: FAILED",
    error
  );

  process.exitCode = 1;
});

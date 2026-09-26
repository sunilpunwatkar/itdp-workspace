
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
    "=== HISTORICAL PROVIDER HANGING JSON CONTRACT ==="
  );

  const originalFetch = globalThis.fetch;
  const originalSetTimeout = globalThis.setTimeout;

  let fetchCount = 0;
  let jsonCount = 0;
  let abortCount = 0;
  let timeoutTimerCount = 0;

  const backoffDelays: number[] = [];

  let watchdogTimer:
    ReturnType<typeof setTimeout> | undefined;

  try {
    globalThis.setTimeout = ((
      callback: (...args: unknown[]) => void,
      delay?: number,
      ...args: unknown[]
    ) => {
      if (delay === 12_000) {
        timeoutTimerCount += 1;

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

      signal.addEventListener(
        "abort",
        () => {
          abortCount += 1;
        },
        { once: true }
      );

      // Fetch succeeds, but JSON parsing never settles.
      return {
        ok: true,
        status: 200,
        json: () => {
          jsonCount += 1;

          return new Promise<never>(
            () => {}
          );
        },
      } as unknown as Response;
    };

    const provider = new HistoricalProvider(
      async (delayMs: number) => {
        backoffDelays.push(delayMs);
      }
    );

    const watchdog = new Promise<never>(
      (_resolve, reject) => {
        watchdogTimer = originalSetTimeout(
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
          "TEST.HANGING.JSON.NS"
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
      "JSON Calls",
      jsonCount,
      3
    );

    assertEqual(
      "Abort Events",
      abortCount,
      3
    );

    assertEqual(
      "Timeout Timer Count",
      timeoutTimerCount,
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
      "Yahoo OHLC request timed out after 12s for TEST.HANGING.JSON.NS"
    );

    console.log(
      "HISTORICAL PROVIDER HANGING JSON CONTRACT: GREEN"
    );
  } finally {
    if (watchdogTimer !== undefined) {
      clearTimeout(watchdogTimer);
    }

    globalThis.fetch = originalFetch;
    globalThis.setTimeout = originalSetTimeout;
  }
}

run().catch((error) => {
  console.error(
    "HISTORICAL PROVIDER HANGING JSON CONTRACT: FAILED",
    error
  );

  process.exitCode = 1;
});

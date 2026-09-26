
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
    "=== HISTORICAL PROVIDER ABORT TIMEOUT CONTRACT ==="
  );

  const originalFetch = globalThis.fetch;
  const originalSetTimeout = globalThis.setTimeout;

  let fetchCount = 0;
  let abortCount = 0;

  const timeoutDelays: number[] = [];
  const backoffDelays: number[] = [];

  try {
    // Fire only the provider's 12-second abort timer
    // immediately. The injected sleep remains independent.
    globalThis.setTimeout = ((
      callback: (...args: unknown[]) => void,
      delay?: number,
      ...args: unknown[]
    ) => {
      if (delay === 12_000) {
        timeoutDelays.push(delay);

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

      return new Promise<Response>(
        (_resolve, reject) => {
          const rejectOnAbort = () => {
            abortCount += 1;

            reject(
              new DOMException(
                "The operation was aborted.",
                "AbortError"
              )
            );
          };

          if (signal.aborted) {
            rejectOnAbort();
            return;
          }

          signal.addEventListener(
            "abort",
            rejectOnAbort,
            { once: true }
          );
        }
      );
    };

    const provider = new HistoricalProvider(
      async (delayMs: number) => {
        backoffDelays.push(delayMs);
      }
    );

    let finalError = "";

    try {
      await provider.getHistoricalOHLC(
        "TEST.ABORT.TIMEOUT.NS"
      );
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
      "Timeout Timer Count",
      timeoutDelays.length,
      3
    );

    assertEqual(
      "Timeout Timer Value",
      timeoutDelays[0],
      12_000
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
      "Backoff Count",
      backoffDelays.length,
      2
    );

    assertEqual(
      "Final Timeout Error",
      finalError,
      "Yahoo OHLC request timed out after 12s for TEST.ABORT.TIMEOUT.NS"
    );

    console.log(
      "HISTORICAL PROVIDER ABORT TIMEOUT CONTRACT: GREEN"
    );
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.setTimeout = originalSetTimeout;
  }
}

run().catch((error) => {
  console.error(
    "HISTORICAL PROVIDER ABORT TIMEOUT CONTRACT: FAILED",
    error
  );

  process.exitCode = 1;
});

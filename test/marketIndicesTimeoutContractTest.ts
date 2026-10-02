import {
  fetchMarketIndex,
} from "../app/services/marketIndicesService";

async function run() {
  console.log(
    "=== MARKET INDICES TIMEOUT CONTRACT TEST ==="
  );

  const definition = {
    name: "NIFTY 50",
    symbol: "^NSEI",
  };

  const neverResolvingFetch =
    (_input: RequestInfo | URL, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener(
          "abort",
          () => {
            reject(
              new DOMException(
                "Aborted",
                "AbortError"
              )
            );
          },
          { once: true }
        );
      });

  const startedAt = Date.now();

  let error: unknown;

  try {
    await fetchMarketIndex(
      definition,
      {
        fetchImpl: neverResolvingFetch,
        timeoutMs: 50,
      }
    );
  } catch (caught) {
    error = caught;
  }

  const elapsedMs =
    Date.now() - startedAt;

  if (!(error instanceof Error)) {
    throw new Error(
      "Hanging Yahoo request must fail with a bounded timeout"
    );
  }

  if (
    !error.message.includes(
      "timed out"
    )
  ) {
    throw new Error(
      `Expected timeout error, received: ${error.message}`
    );
  }

  if (elapsedMs > 500) {
    throw new Error(
      `Timeout was not bounded: ${elapsedMs} ms`
    );
  }

  console.log(
    "PASS: Market index request has bounded timeout"
  );
}

run().catch((error) => {
  console.error(
    "MARKET INDICES TIMEOUT CONTRACT: FAIL"
  );

  console.error(error);

  process.exit(1);
});

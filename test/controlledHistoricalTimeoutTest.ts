import {
  HistoricalProvider,
} from "../app/providers/historicalProvider";

const provider = new HistoricalProvider();

async function runTest() {
  console.log(
    "=== CONTROLLED HISTORICAL TIMEOUT TEST ==="
  );

  console.log(
    "TEST 1: HistoricalProvider import: PASS"
  );

  // Use an intentionally invalid/unreachable
  // Yahoo symbol to verify failure handling.
  const symbol =
    "INVALID_TIMEOUT_TEST_SYMBOL_123456.NS";

  const start = Date.now();

  try {
    await provider.getHistoricalOHLC(symbol);

    console.log(
      "TEST 2: Timeout/Error handling: FAIL"
    );

    console.log(
      "Unexpected successful response."
    );

  } catch (error) {

    const elapsed =
      Date.now() - start;

    const message =
      error instanceof Error
        ? error.message
        : String(error);

    console.log(
      "TEST 2: Historical failure handling: PASS"
    );

    console.log(
      "Elapsed:",
      `${elapsed}ms`
    );

    console.log(
      "Error:",
      message
    );
  }

  console.log(
    "=== FINAL CHECK ==="
  );
}

runTest().catch((error) => {
  console.error(
    "TEST RUNNER ERROR:",
    error
  );

  process.exit(1);
});
import {
  handleChartApiRequest,
} from "../app/services/chartApiHandlerService";

function assertEqual(
  label: string,
  actual: unknown,
  expected: unknown
): void {
  if (actual !== expected) {
    throw new Error(
      `${label}: expected ${String(
        expected
      )}, received ${String(actual)}`
    );
  }

  console.log(
    `PASS | ${label} | ${String(actual)}`
  );
}

async function run(): Promise<void> {
  console.log(
    "=== CHART API HANDLER CONTRACT ==="
  );

  // ======================================
  // TEST 1
  // VALID SYMBOL IS TRIMMED
  // ======================================

  let analyzedSymbol:
    | string
    | null = null;

  const success =
    await handleChartApiRequest({
      symbol: "  RELIANCE  ",

      getChartData:
        async (symbol) => {
          analyzedSymbol =
            symbol;

          return [
            {
              time: "2026-09-18",
              open: 100,
              high: 105,
              low: 99,
              close: 104,
              volume: 1000,
            },
          ];
        },
    });

  assertEqual(
    "Success Status",
    success.status,
    200
  );

  assertEqual(
    "Trimmed Symbol",
    analyzedSymbol,
    "RELIANCE"
  );

  const successBody =
    success.body as Array<{
      close: number;
    }>;

  assertEqual(
    "Success Candle Close",
    successBody[0]?.close,
    104
  );

  // ======================================
  // TEST 2
  // MISSING SYMBOL
  // ======================================

  let missingCalled =
    false;

  const missing =
    await handleChartApiRequest({
      symbol: null,

      getChartData:
        async () => {
          missingCalled =
            true;

          return [];
        },
    });

  assertEqual(
    "Missing Symbol Status",
    missing.status,
    400
  );

  assertEqual(
    "Missing Symbol Error",
    (
      missing.body as {
        error: string;
      }
    ).error,
    "INVALID_SYMBOL"
  );

  assertEqual(
    "Missing Symbol Does Not Fetch",
    missingCalled,
    false
  );

  // ======================================
  // TEST 3
  // WHITESPACE-ONLY SYMBOL
  // ======================================

  let blankCalled =
    false;

  const blank =
    await handleChartApiRequest({
      symbol: "     ",

      getChartData:
        async () => {
          blankCalled =
            true;

          return [];
        },
    });

  assertEqual(
    "Blank Symbol Status",
    blank.status,
    400
  );

  assertEqual(
    "Blank Symbol Error",
    (
      blank.body as {
        error: string;
      }
    ).error,
    "INVALID_SYMBOL"
  );

  assertEqual(
    "Blank Symbol Does Not Fetch",
    blankCalled,
    false
  );

  // ======================================
  // TEST 4
  // INTERNAL ERROR MUST NOT LEAK
  // ======================================

  const internal =
    await handleChartApiRequest({
      symbol: "RELIANCE",

      getChartData:
        async () => {
          throw new Error(
            "Yahoo historical HTTP 503 for RELIANCE.NS"
          );
        },
    });

  assertEqual(
    "Internal Failure Status",
    internal.status,
    500
  );

  assertEqual(
    "Internal Failure Public Error",
    (
      internal.body as {
        error: string;
      }
    ).error,
    "INTERNAL_SERVER_ERROR"
  );

  const serializedBody =
    JSON.stringify(
      internal.body
    );

  assertEqual(
    "Internal Error Not Leaked",
    serializedBody.includes(
      "Yahoo historical HTTP"
    ),
    false
  );

  console.log("");
  console.log(
    "CHART API HANDLER CONTRACT: GREEN"
  );
}

run().catch((error) => {
  console.error(
    "CHART API HANDLER CONTRACT: RED",
    error
  );

  process.exit(1);
});
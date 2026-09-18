import {
  handleHistoryApiRequest,
} from "../app/services/historyApiHandlerService";

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
    "=== HISTORY API HANDLER CONTRACT ==="
  );

  // ======================================
  // TEST 1
  // VALID SYMBOL IS TRIMMED
  // ======================================

  let analyzedSymbol:
    | string
    | null = null;

  const success =
    await handleHistoryApiRequest({
      symbol: "  RELIANCE  ",

      analyze:
        async (symbol) => {
          analyzedSymbol =
            symbol;

          return {
            symbol:
              "RELIANCE.NS",
            decision:
              "HOLD",
          };
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

  assertEqual(
    "Success Symbol",
    (
      success.body as {
        symbol: string;
      }
    ).symbol,
    "RELIANCE.NS"
  );

  // ======================================
  // TEST 2
  // MISSING SYMBOL
  // ======================================

  let missingCalled =
    false;

  const missing =
    await handleHistoryApiRequest({
      symbol: null,

      analyze:
        async () => {
          missingCalled =
            true;

          return {};
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
    "Missing Symbol Does Not Analyze",
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
    await handleHistoryApiRequest({
      symbol: "     ",

      analyze:
        async () => {
          blankCalled =
            true;

          return {};
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
    "Blank Symbol Does Not Analyze",
    blankCalled,
    false
  );

  // ======================================
  // TEST 4
  // INTERNAL ERROR MUST NOT LEAK
  // ======================================

  const internal =
    await handleHistoryApiRequest({
      symbol: "RELIANCE",

      analyze:
        async () => {
          throw new Error(
            "Yahoo request timeout after 12s for RELIANCE.NS"
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
      "Yahoo request timeout"
    ),
    false
  );

  console.log("");
  console.log(
    "HISTORY API HANDLER CONTRACT: GREEN"
  );
}

run().catch((error) => {
  console.error(
    "HISTORY API HANDLER CONTRACT: RED",
    error
  );

  process.exit(1);
});
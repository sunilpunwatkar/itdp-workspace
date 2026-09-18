import {
  handleAnalysisApiRequest,
} from "../app/services/analysisApiHandlerService";

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
    "=== ANALYSIS API HANDLER CONTRACT ==="
  );

  // ==========================================
  // CASE 1
  // VALID SYMBOL
  // ==========================================

  let receivedSymbol = "";

  const success =
    await handleAnalysisApiRequest({
      symbol: "  RELIANCE  ",

      analyze:
        async (symbol) => {
          receivedSymbol = symbol;

          return {
            symbol: "RELIANCE.NS",
            decision: "HOLD",
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
    receivedSymbol,
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

  // ==========================================
  // CASE 2
  // MISSING SYMBOL
  // ==========================================

  let missingAnalyzeCalled = false;

  const missing =
    await handleAnalysisApiRequest({
      symbol: null,

      analyze:
        async () => {
          missingAnalyzeCalled = true;

          throw new Error(
            "SHOULD_NOT_RUN"
          );
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
    missingAnalyzeCalled,
    false
  );

  // ==========================================
  // CASE 3
  // WHITESPACE-ONLY SYMBOL
  // ==========================================

  let blankAnalyzeCalled = false;

  const blank =
    await handleAnalysisApiRequest({
      symbol: "   ",

      analyze:
        async () => {
          blankAnalyzeCalled = true;

          throw new Error(
            "SHOULD_NOT_RUN"
          );
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
    blankAnalyzeCalled,
    false
  );

  // ==========================================
  // CASE 4
  // INTERNAL FAILURE MUST NOT LEAK
  // ==========================================

  const internalFailure =
    await handleAnalysisApiRequest({
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
    internalFailure.status,
    500
  );

  assertEqual(
    "Internal Failure Public Error",
    (
      internalFailure.body as {
        error: string;
      }
    ).error,
    "INTERNAL_SERVER_ERROR"
  );

  const leaked =
    JSON.stringify(
      internalFailure.body
    ).includes(
      "Yahoo request timeout"
    );

  assertEqual(
    "Internal Error Not Leaked",
    leaked,
    false
  );

  console.log("");

  console.log(
    "ANALYSIS API HANDLER CONTRACT: GREEN"
  );
}

run().catch((error) => {
  console.error("");

  console.error(
    "ANALYSIS API HANDLER CONTRACT: FAILED"
  );

  console.error(error);

  process.exit(1);
});
import {
  buildOpportunityScannerSources,
} from "../app/services/opportunityScannerSourceFactory";

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

function captureError(
  operation: () => unknown
): string | null {
  try {
    operation();

    return null;
  } catch (error) {
    return error instanceof Error
      ? error.message
      : String(error);
  }
}

console.log(
  "=== OPPORTUNITY SCANNER SOURCE FACTORY VALIDATION CONTRACT ==="
);

// ==========================================
// CASE 1
// NORMALIZATION
// ==========================================

const normalizedSources =
  buildOpportunityScannerSources([
    " reliance.ns ",
    "tcs.ns",
  ]);

assertEqual(
  "Normalized Source Count",
  normalizedSources.length,
  2
);

assertEqual(
  "Normalized First Symbol",
  normalizedSources[0].symbol,
  "RELIANCE.NS"
);

assertEqual(
  "Normalized Second Symbol",
  normalizedSources[1].symbol,
  "TCS.NS"
);

// ==========================================
// CASE 2
// BLANK SYMBOL REJECTED
// ==========================================

const blankError =
  captureError(() =>
    buildOpportunityScannerSources([
      "RELIANCE.NS",
      "   ",
    ])
  );

assertEqual(
  "Blank Symbol Error",
  blankError,
  "Stock universe contains a blank symbol."
);

// ==========================================
// CASE 3
// EXACT DUPLICATE REJECTED
// ==========================================

const duplicateError =
  captureError(() =>
    buildOpportunityScannerSources([
      "RELIANCE.NS",
      "RELIANCE.NS",
    ])
  );

assertEqual(
  "Duplicate Symbol Error",
  duplicateError,
  "Stock universe contains duplicate symbol: RELIANCE.NS"
);

// ==========================================
// CASE 4
// NORMALIZED DUPLICATE REJECTED
// ==========================================

const normalizedDuplicateError =
  captureError(() =>
    buildOpportunityScannerSources([
      " reliance.ns ",
      "RELIANCE.NS",
    ])
  );

assertEqual(
  "Normalized Duplicate Error",
  normalizedDuplicateError,
  "Stock universe contains duplicate symbol: RELIANCE.NS"
);

// ==========================================
// CASE 5
// EMPTY UNIVERSE
// ==========================================

const emptySources =
  buildOpportunityScannerSources(
    []
  );

assertEqual(
  "Empty Source Count",
  emptySources.length,
  0
);

console.log("");

console.log(
  "ALL SOURCE FACTORY VALIDATION CONTRACT CASES PASS"
);
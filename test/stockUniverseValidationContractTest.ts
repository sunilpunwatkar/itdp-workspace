import {
  validateStockUniverse,
} from "../app/services/stockUniverseValidationService";

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

console.log(
  "=== STOCK UNIVERSE VALIDATION CONTRACT ==="
);

// ==========================================
// CASE 1
// NORMALIZATION
// ==========================================

const normalized =
  validateStockUniverse([
    " reliance.ns ",
    "tcs.ns",
  ]);

assertEqual(
  "Normalized Valid",
  normalized.valid,
  true
);

assertEqual(
  "Normalized First Symbol",
  normalized.symbols[0],
  "RELIANCE.NS"
);

assertEqual(
  "Normalized Second Symbol",
  normalized.symbols[1],
  "TCS.NS"
);

// ==========================================
// CASE 2
// BLANK SYMBOL
// ==========================================

const blank =
  validateStockUniverse([
    "RELIANCE.NS",
    "   ",
  ]);

assertEqual(
  "Blank Symbol Rejected",
  blank.valid,
  false
);

assertEqual(
  "Blank Symbol Error",
  blank.error,
  "Stock universe contains a blank symbol."
);

// ==========================================
// CASE 3
// DUPLICATE EXACT
// ==========================================

const duplicate =
  validateStockUniverse([
    "RELIANCE.NS",
    "RELIANCE.NS",
  ]);

assertEqual(
  "Duplicate Symbol Rejected",
  duplicate.valid,
  false
);

assertEqual(
  "Duplicate Symbol Error",
  duplicate.error,
  "Stock universe contains duplicate symbol: RELIANCE.NS"
);

// ==========================================
// CASE 4
// DUPLICATE AFTER NORMALIZATION
// ==========================================

const normalizedDuplicate =
  validateStockUniverse([
    " reliance.ns ",
    "RELIANCE.NS",
  ]);

assertEqual(
  "Normalized Duplicate Rejected",
  normalizedDuplicate.valid,
  false
);

// ==========================================
// CASE 5
// EMPTY UNIVERSE
// ==========================================

const empty =
  validateStockUniverse([]);

assertEqual(
  "Empty Universe Valid",
  empty.valid,
  true
);

assertEqual(
  "Empty Universe Size",
  empty.symbols.length,
  0
);

console.log("");

console.log(
  "ALL STOCK UNIVERSE VALIDATION CONTRACT CASES PASS"
);
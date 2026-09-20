import assert from "node:assert/strict";

import {
  extractSparkline,
} from "../app/services/marketIndicesService";

console.log(
  "=== MARKET INDICES SPARKLINE EXTRACTION CONTRACT ==="
);

// Valid Yahoo-style close values mixed with invalid values.
const rawValues: unknown[] = [
  23323.95,
  null,
  23328.1,
  undefined,
  NaN,
  23301.05,
  Infinity,
  "23317.9",
  23346.4,
];

const result =
  extractSparkline(rawValues);

assert.deepEqual(
  result,
  [
    23323.95,
    23328.1,
    23301.05,
    23346.4,
  ],
  "Sparkline extraction must keep only finite numeric values"
);

assert.deepEqual(
  extractSparkline(undefined),
  [],
  "Missing Yahoo close array must return an empty sparkline"
);

assert.deepEqual(
  extractSparkline(null),
  [],
  "Null Yahoo close array must return an empty sparkline"
);

assert.deepEqual(
  extractSparkline([]),
  [],
  "Empty Yahoo close array must remain empty"
);

console.log(
  "PASS: Market index sparkline extraction contract"
);
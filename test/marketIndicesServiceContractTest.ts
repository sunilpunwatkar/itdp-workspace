import assert from "node:assert/strict";

import {
  MARKET_INDEX_DEFINITIONS,
  buildMarketIndex,
} from "../app/services/marketIndicesService";

// =====================================================
// 1. CANONICAL INDEX MAPPINGS
// =====================================================

assert.deepEqual(
  MARKET_INDEX_DEFINITIONS,
  [
    {
      name: "NIFTY 50",
      symbol: "^NSEI",
    },
    {
      name: "SENSEX",
      symbol: "^BSESN",
    },
    {
      name: "BANK NIFTY",
      symbol: "^NSEBANK",
    },
  ],
  "Canonical market index mappings changed"
);

// =====================================================
// 2. POSITIVE CHANGE
// =====================================================

const positive = buildMarketIndex(
  {
    name: "NIFTY 50",
    symbol: "^NSEI",
  },
  23346.4,
  23270.6
);

assert.equal(positive.price, 23346.4);
assert.equal(positive.previousClose, 23270.6);

assert.ok(
  Math.abs(positive.change - 75.8) < 0.0001,
  "Positive change calculation is incorrect"
);

assert.ok(
  Math.abs(
    positive.changePercent -
      ((23346.4 - 23270.6) / 23270.6) * 100
  ) < 0.0001,
  "Positive changePercent calculation is incorrect"
);

// =====================================================
// 3. NEGATIVE CHANGE
// =====================================================

const negative = buildMarketIndex(
  {
    name: "SENSEX",
    symbol: "^BSESN",
  },
  74294.96,
  74336.5
);

assert.ok(
  negative.change < 0,
  "Negative market move must produce negative change"
);

assert.ok(
  negative.changePercent < 0,
  "Negative market move must produce negative changePercent"
);

// =====================================================
// 4. ZERO PREVIOUS CLOSE SAFETY
// =====================================================

const zeroPreviousClose = buildMarketIndex(
  {
    name: "BANK NIFTY",
    symbol: "^NSEBANK",
  },
  56358.7,
  0
);

assert.equal(
  zeroPreviousClose.changePercent,
  0,
  "Zero previousClose must not produce Infinity or NaN"
);

assert.ok(
  Number.isFinite(zeroPreviousClose.changePercent),
  "changePercent must always remain finite"
);

console.log(
  "MARKET INDICES SERVICE CONTRACT: PASS"
);
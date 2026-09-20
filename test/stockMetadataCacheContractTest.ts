import assert from "node:assert/strict";

import {
  clearStockMetadataCacheForTest,
  getCachedStockMetadata,
  saveStockMetadata,
} from "../app/services/stockMetadataService";

console.log(
  "=== STOCK METADATA CACHE CONTRACT ==="
);

clearStockMetadataCacheForTest();

const metadata = {
  symbol: "RELIANCE.NS",
  companyName:
    "Reliance Industries Limited",
  exchange: "NSE",
  instrumentType: "EQUITY",
  currency: "INR",
};

// =====================================================
// CACHE MISS
// =====================================================

assert.equal(
  getCachedStockMetadata(
    "RELIANCE.NS"
  ),
  null,
  "Unknown symbol must return null"
);

console.log(
  "PASS: metadata cache miss"
);

// =====================================================
// SAVE + READ
// =====================================================

saveStockMetadata(metadata);

assert.deepEqual(
  getCachedStockMetadata(
    "RELIANCE.NS"
  ),
  metadata,
  "Saved metadata must be retrievable"
);

console.log(
  "PASS: metadata cache save/read"
);

// =====================================================
// SYMBOL ISOLATION
// =====================================================

assert.equal(
  getCachedStockMetadata(
    "TCS.NS"
  ),
  null,
  "Metadata cache must be isolated by symbol"
);

console.log(
  "PASS: metadata cache symbol isolation"
);

// =====================================================
// CLEAR ONE SYMBOL
// =====================================================

clearStockMetadataCacheForTest(
  "RELIANCE.NS"
);

assert.equal(
  getCachedStockMetadata(
    "RELIANCE.NS"
  ),
  null,
  "Symbol-specific clear must remove metadata"
);

console.log(
  "PASS: metadata cache symbol clear"
);

console.log("");
console.log(
  "STOCK METADATA CACHE CONTRACT: PASS"
);
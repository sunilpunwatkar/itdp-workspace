import assert from "node:assert/strict";

import {
  extractStockMetadata,
} from "../app/services/stockMetadataService";

console.log(
  "=== STOCK METADATA EXTRACTION CONTRACT ==="
);

const result =
  extractStockMetadata({
    symbol: "RELIANCE.NS",
    longName:
      "Reliance Industries Limited",
    shortName:
      "RELIANCE INDUSTRIES LTD",
    fullExchangeName: "NSE",
    exchangeName: "NSI",
    instrumentType: "EQUITY",
    currency: "INR",
  });

assert.deepEqual(
  result,
  {
    symbol: "RELIANCE.NS",
    companyName:
      "Reliance Industries Limited",
    exchange: "NSE",
    instrumentType: "EQUITY",
    currency: "INR",
  },
  "Yahoo metadata must map to ITDP stock metadata"
);

console.log(
  "PASS: Yahoo metadata extraction"
);

// =====================================================
// LONG NAME FALLBACK
// =====================================================

const shortNameFallback =
  extractStockMetadata({
    symbol: "TEST.NS",
    shortName: "TEST COMPANY LTD",
    fullExchangeName: "NSE",
    instrumentType: "EQUITY",
    currency: "INR",
  });

assert.equal(
  shortNameFallback.companyName,
  "TEST COMPANY LTD",
  "shortName must be used when longName is unavailable"
);

console.log(
  "PASS: shortName fallback"
);

// =====================================================
// EXCHANGE FALLBACK
// =====================================================

const exchangeFallback =
  extractStockMetadata({
    symbol: "TEST.NS",
    longName: "Test Company Limited",
    exchangeName: "NSI",
    instrumentType: "EQUITY",
    currency: "INR",
  });

assert.equal(
  exchangeFallback.exchange,
  "NSI",
  "exchangeName must be used when fullExchangeName is unavailable"
);

console.log(
  "PASS: exchange fallback"
);

console.log("");
console.log(
  "STOCK METADATA EXTRACTION CONTRACT: PASS"
);
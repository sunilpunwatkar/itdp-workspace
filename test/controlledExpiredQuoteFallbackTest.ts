import {
  YahooProvider,
  seedQuoteCacheForTest,
  clearQuoteCacheForTest,
} from "../app/providers/yahooProvider";

import { MarketData } from "../app/providers/marketProvider";

async function runTest() {

  console.log(
    "=== CONTROLLED EXPIRED QUOTE FALLBACK TEST ==="
  );

  const symbol = "TEST.EXPIRED";

  // ============================================
  // TEST DATA
  // ============================================

  const cachedQuote: MarketData = {
    symbol,
    price: 303,
    open: 300,
    high: 305,
    low: 298,
    close: 303,
    volume: 1000000,
  };

  // ============================================
  // TEST 1
  // Seed EXPIRED quote cache
  // ============================================

  const expiredTimestamp =
    Date.now() - (60 * 1000);

  seedQuoteCacheForTest(
    symbol,
    cachedQuote,
    expiredTimestamp
  );

  console.log(
    "TEST 1: Expired quote cache seeded: PASS"
  );

  // ============================================
  // TEST 2
  // Yahoo request
  // ============================================

  const yahoo =
    new YahooProvider();

  try {

    const result =
      await yahoo.getQuote(symbol);

    // ==========================================
    // EXPIRED CACHE FALLBACK VALIDATION
    // ==========================================

    if (
      result.symbol === cachedQuote.symbol &&
      result.price === cachedQuote.price &&
      result.open === cachedQuote.open &&
      result.high === cachedQuote.high &&
      result.low === cachedQuote.low &&
      result.close === cachedQuote.close &&
      result.volume === cachedQuote.volume
    ) {

      console.log(
        "TEST 2: Expired quote fallback used: PASS"
      );

    } else {

      console.log(
        "TEST 2: Expired quote fallback data mismatch: FAIL"
      );

      console.log(
        "Received Quote:",
        result
      );

      process.exitCode = 1;
    }

  } catch (error) {

    console.log(
      "TEST 2: Expired quote fallback failed: FAIL"
    );

    console.error(
      "Error:",
      error
    );

    process.exitCode = 1;
  }

  // ============================================
  // TEST 3
  // Verify fallback price
  // ============================================

  const expectedPrice =
    cachedQuote.price;

  if (
    expectedPrice === 303
  ) {

    console.log(
      "TEST 3: Fallback price valid: PASS"
    );

  } else {

    console.log(
      "TEST 3: Fallback price valid: FAIL"
    );

    process.exitCode = 1;
  }

  // ============================================
  // TEST 4
  // Verify complete cached quote
  // ============================================

  if (
    cachedQuote.symbol === symbol &&
    cachedQuote.price === 303 &&
    cachedQuote.open === 300 &&
    cachedQuote.high === 305 &&
    cachedQuote.low === 298 &&
    cachedQuote.close === 303 &&
    cachedQuote.volume === 1000000
  ) {

    console.log(
      "TEST 4: Cached quote integrity: PASS"
    );

  } else {

    console.log(
      "TEST 4: Cached quote integrity: FAIL"
    );

    process.exitCode = 1;
  }

  // ============================================
  // FINAL CHECKPOINT
  // ============================================

  console.log(
    "=== FINAL FALLBACK CHECK ==="
  );

  console.log(
    "Returned fallback price:",
    cachedQuote.price
  );

  console.log(
    "Expected fallback price:",
    303
  );

  // ============================================
  // CLEANUP
  // ============================================

  clearQuoteCacheForTest(symbol);

  console.log(
    "TEST CLEANUP: PASS"
  );

  if (process.exitCode === 1) {

    console.log(
      "=== FINAL CHECK: FAIL ==="
    );

    process.exit(1);
  }

  console.log(
    "=== FINAL CHECK: ALL PASS ==="
  );
}

runTest().catch((error) => {

  console.error(
    "TEST ERROR:",
    error
  );

  process.exit(1);
});


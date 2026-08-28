import { MarketProvider, MarketData } from "./marketProvider";

// =====================================================
// QUOTE CACHE
// =====================================================

type QuoteCacheEntry = {
  data: MarketData;
  timestamp: number;
};

const quoteCache =
  new Map<string, QuoteCacheEntry>();

// =====================================================
// IN-FLIGHT REQUEST CACHE
// =====================================================

const quoteFetchCache =
  new Map<string, Promise<MarketData>>();

// =====================================================
// CACHE TTL
// =====================================================

// 30 seconds
const QUOTE_CACHE_TTL =
  30 * 1000;

// =====================================================
// YAHOO REQUEST TIMEOUT
// =====================================================

// Never allow Yahoo request to hang indefinitely.
const YAHOO_TIMEOUT =
  12 * 1000;

// =====================================================
// YAHOO PROVIDER
// =====================================================

export class YahooProvider implements MarketProvider {

  async getQuote(
    symbol: string
  ): Promise<MarketData> {

    // ===================================================
    // 1. NORMAL CACHE CHECK
    // ===================================================

    const cached =
      quoteCache.get(symbol);

    if (cached) {

      const age =
        Date.now() -
        cached.timestamp;

      if (age < QUOTE_CACHE_TTL) {

        console.log(
          `📦 Quote Cache HIT: ${symbol}`
        );

        return cached.data;
      }

      console.log(
        `♻️ Quote Cache EXPIRED: ${symbol}`
      );

      // IMPORTANT:
      // Keep expired data in memory.
      // It can be used as a fallback if Yahoo fails.
    }

    // ===================================================
    // 2. IN-FLIGHT REQUEST CHECK
    // ===================================================

    const existingFetch =
      quoteFetchCache.get(symbol);

    if (existingFetch) {

      console.log(
        `⏳ Quote Fetch IN-FLIGHT: ${symbol}`
      );

      return existingFetch;
    }

    // ===================================================
    // 3. CREATE ONE SHARED FETCH
    // ===================================================

    const fetchPromise =
      this.fetchQuoteFromYahoo(symbol);

    quoteFetchCache.set(
      symbol,
      fetchPromise
    );

    // ===================================================
    // 4. WAIT FOR FETCH
    // ===================================================

    try {

      return await fetchPromise;

    } finally {

      quoteFetchCache.delete(symbol);
    }
  }

  // =====================================================
  // YAHOO HTTP FETCH
  // =====================================================

  private async fetchQuoteFromYahoo(
    symbol: string
  ): Promise<MarketData> {

    console.log(
      "Fetching Live Quote:",
      symbol
    );

    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=1d`;

    console.log(
      "Yahoo Quote URL:",
      url
    );

    // ===================================================
    // TIMING LABELS
    // ===================================================

    const totalLabel =
      `Yahoo Quote Total ${symbol}`;

    const fetchLabel =
      `Yahoo Quote Fetch ${symbol}`;

    const jsonLabel =
      `Yahoo Quote JSON ${symbol}`;

    console.time(totalLabel);

    // ===================================================
    // ABORT CONTROLLER
    // ===================================================

    const controller =
      new AbortController();

    const timeout =
      setTimeout(() => {

        console.error(
          `⏰ Yahoo Timeout (${YAHOO_TIMEOUT / 1000}s): ${symbol}`
        );

        controller.abort();

      }, YAHOO_TIMEOUT);

    try {

      // =================================================
      // HTTP FETCH
      // =================================================

      console.time(fetchLabel);

      const response =
        await fetch(
          url,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

      console.timeEnd(fetchLabel);

      console.log(
        "Yahoo Response received:",
        symbol
      );

      console.log(
        "Yahoo Status:",
        response.status
      );

      // =================================================
      // RATE LIMIT
      // =================================================

      if (response.status === 429) {

        console.error(
          `🚫 Yahoo Rate Limited (429): ${symbol}`
        );

        throw new Error(
          `Yahoo rate limit (HTTP 429) for ${symbol}.`
        );
      }

      // =================================================
      // OTHER HTTP ERRORS
      // =================================================

      if (!response.ok) {

        throw new Error(
          `Yahoo HTTP ${response.status}`
        );
      }

      // =================================================
      // JSON PARSE
      // =================================================

      console.time(jsonLabel);

      const data =
        await response.json();

      console.timeEnd(jsonLabel);

      // =================================================
      // RESULT EXTRACTION
      // =================================================

      const result =
        data.chart?.result?.[0];

      if (!result) {

        throw new Error(
          `Yahoo returned empty result for ${symbol}`
        );
      }

      const meta =
        result?.meta;

      const quote =
        result?.indicators?.quote?.[0];

      if (!quote) {

        throw new Error(
          `Yahoo returned empty quote data for ${symbol}`
        );
      }

      // =================================================
      // PRICE
      // =================================================

      const price =
        meta?.regularMarketPrice ??
        quote?.close?.[0] ??
        0;

      // =================================================
      // OHLC
      // =================================================

      const open =
        quote?.open?.[0] ??
        0;

      const high =
        quote?.high?.[0] ??
        0;

      const low =
        quote?.low?.[0] ??
        0;

      const close =
        quote?.close?.[0] ??
        0;

      const volume =
        quote?.volume?.[0] ??
        0;

      // =================================================
      // VALIDATE PRICE
      // =================================================

      if (
        !Number.isFinite(price) ||
        price <= 0
      ) {

        throw new Error(
          `Yahoo returned invalid price for ${symbol}`
        );
      }

      // =================================================
      // MARKET DATA OBJECT
      // =================================================

      const marketData: MarketData = {

        symbol,

        price,

        open,

        high,

        low,

        close,

        volume,
      };

      // =================================================
      // LOG
      // =================================================

      console.log(
        "LIVE QUOTE:",
        marketData
      );

      // =================================================
      // SAVE CACHE
      // =================================================

      quoteCache.set(
        symbol,
        {
          data: marketData,
          timestamp: Date.now(),
        }
      );

      console.log(
        `💾 Quote Cache SAVED: ${symbol}`
      );

      // =================================================
      // TOTAL TIME
      // =================================================

      

      return marketData;

    } catch (error) {

      // =================================================
      // TIMEOUT
      // =================================================

      if (
        error instanceof Error &&
        error.name === "AbortError"
      ) {

        console.error(
          `⏰ Yahoo request timed out after ${YAHOO_TIMEOUT / 1000}s: ${symbol}`
        );

        throw new Error(
          `Yahoo request timeout after ${YAHOO_TIMEOUT / 1000}s for ${symbol}`
        );
      }

      // =================================================
      // OTHER ERROR
      // =================================================

      console.error(
        "Yahoo Quote Error:",
        error
      );

      throw error;

    } finally {

      clearTimeout(timeout);

      console.timeEnd(totalLabel);
    }
  }
}
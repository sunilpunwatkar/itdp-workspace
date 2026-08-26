import { MarketProvider, MarketData } from "./marketProvider";

// =====================================================
// QUOTE CACHE
// =====================================================

type QuoteCacheEntry = {
  data: MarketData;
  timestamp: number;
};

// Live quote cache.
// Short TTL keeps the quote reasonably fresh while
// preventing repeated Yahoo requests during analysis.
const quoteCache =
  new Map<string, QuoteCacheEntry>();

// =====================================================
// IN-FLIGHT REQUEST CACHE
// =====================================================

// If multiple requests ask for the same symbol at the
// same time, they share ONE Yahoo request.
const quoteFetchCache =
  new Map<string, Promise<MarketData>>();

// =====================================================
// CACHE TTL
// =====================================================

// 30 seconds
const QUOTE_CACHE_TTL =
  30 * 1000;


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

      quoteCache.delete(symbol);
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


    // Store the Promise immediately so concurrent
    // requests share the same Yahoo request.
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

      // Always remove in-flight entry after completion.
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
          `Yahoo rate limit (HTTP 429) for ${symbol}. Please wait before retrying.`
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

      console.timeEnd(totalLabel);


      return marketData;


    } catch (error) {

      // =================================================
      // ERROR
      // =================================================

      console.error(
        "Yahoo Quote Error:",
        error
      );


      console.timeEnd(totalLabel);


      throw error;
    }
  }
}
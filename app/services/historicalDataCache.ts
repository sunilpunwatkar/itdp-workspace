import {
  HistoricalProvider,
  HistoricalOHLC,
} from "../providers/historicalProvider";

const historical =
  new HistoricalProvider();

type HistoricalCacheEntry = {
  data: HistoricalOHLC;
  timestamp: number;
};

const historicalCache =
  new Map<string, HistoricalCacheEntry>();

const historicalFetchCache =
  new Map<string, Promise<HistoricalOHLC>>();

const CACHE_TTL =
  15 * 60 * 1000;

// =====================================
// TEST SUPPORT
// =====================================

export function seedHistoricalCacheForTest(
  symbol: string,
  data: HistoricalOHLC,
  timestamp: number = Date.now()
): void {
  historicalCache.set(
    symbol,
    {
      data,
      timestamp,
    }
  );
}

export function clearHistoricalCacheForTest(
  symbol?: string
): void {
  if (symbol) {
    historicalCache.delete(symbol);
    return;
  }

  historicalCache.clear();
}

// =====================================
// MAIN CACHE FUNCTION
// =====================================

export async function getCachedHistoricalOHLC(
  symbol: string
): Promise<HistoricalOHLC> {
  // =====================================
  // 1. NORMAL CACHE
  // =====================================

  const cached =
    historicalCache.get(symbol);

  if (cached) {
    const age =
      Date.now() -
      cached.timestamp;

    if (age < CACHE_TTL) {
      console.log(
        `📦 Historical Cache HIT: ${symbol}`
      );

      return cached.data;
    }

    console.log(
      `♻️ Historical Cache EXPIRED: ${symbol}`
    );
  }

  // =====================================
  // 2. IN-FLIGHT REQUEST
  // =====================================

  const existingFetch =
    historicalFetchCache.get(symbol);

  if (existingFetch) {
    console.log(
      `⏳ Historical Fetch IN-FLIGHT: ${symbol}`
    );

    return existingFetch;
  }

  // =====================================
  // 3. CREATE ONE SHARED FETCH
  // =====================================

  const fetchPromise =
    (async (): Promise<HistoricalOHLC> => {
      const fetchTimerLabel =
        `Historical Fetch ${symbol}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`;

      try {
        console.log(
          `🔄 Historical Yahoo FETCH: ${symbol}`
        );

        console.time(
          fetchTimerLabel
        );

        const data =
          await historical.getHistoricalOHLC(
            symbol
          );

        console.timeEnd(
          fetchTimerLabel
        );

        historicalCache.set(
          symbol,
          {
            data,
            timestamp: Date.now(),
          }
        );

        console.log(
          `💾 Historical Cache SAVED: ${symbol}`
        );

        return data;
      } catch (error) {
        console.error(
          `❌ Historical Yahoo FETCH FAILED: ${symbol}`,
          error
        );

        // =================================
        // STALE CACHE FALLBACK
        // =================================

        if (cached) {
          console.log(
            `♻️ Historical STALE CACHE FALLBACK: ${symbol}`
          );

          return cached.data;
        }

        throw error;
      }
    })();

  historicalFetchCache.set(
    symbol,
    fetchPromise
  );

  try {
    return await fetchPromise;
  } finally {
    historicalFetchCache.delete(
      symbol
    );
  }
}
import {
  HistoricalProvider,
  HistoricalOHLC,
} from "../providers/historicalProvider";

const historical = new HistoricalProvider();

type HistoricalCacheEntry = {
  data: HistoricalOHLC;
  timestamp: number;
};

const historicalCache =
  new Map<string, HistoricalCacheEntry>();

const historicalFetchCache =
  new Map<string, Promise<HistoricalOHLC>>();

const CACHE_TTL =
  60 * 1000;

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
        `?? Historical Cache HIT: ${symbol}`
      );

      return cached.data;
    }

    console.log(
      `?? Historical Cache EXPIRED: ${symbol}`
    );

    historicalCache.delete(symbol);
  }

  // =====================================
  // 2. IN-FLIGHT REQUEST
  // =====================================

  const existingFetch =
    historicalFetchCache.get(symbol);

  if (existingFetch) {

    console.log(
      `? Historical Fetch IN-FLIGHT: ${symbol}`
    );

    return existingFetch;
  }

  // =====================================
  // 3. CREATE ONE SHARED FETCH
  // =====================================

  const fetchPromise =
    (async (): Promise<HistoricalOHLC> => {

      console.log(
        `?? Historical Yahoo FETCH: ${symbol}`
      );

      console.time(
        `Historical Fetch ${symbol}`
      );

      const data =
        await historical.getHistoricalOHLC(
          symbol
        );

      console.timeEnd(
        `Historical Fetch ${symbol}`
      );

      historicalCache.set(
        symbol,
        {
          data,
          timestamp: Date.now(),
        }
      );

      console.log(
        `?? Historical Cache SAVED: ${symbol}`
      );

      return data;

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

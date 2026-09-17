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
// MAXIMUM STALE FALLBACK AGE
// =====================================
//
// Historical data uses 1-day candles.
// During a temporary provider outage,
// stale in-memory data may be used only
// within this bounded safety window.
//
// This matches the existing chart
// historical fallback maximum age.
//
// =====================================

export const HISTORICAL_STALE_FALLBACK_MAX_AGE_MS =
  7 * 24 * 60 * 60 * 1000;

// =====================================
// CACHE AGE VALIDATION
// =====================================

function getCacheAge(
  timestamp: number
): number | null {
  if (
    !Number.isFinite(timestamp) ||
    timestamp < 0
  ) {
    return null;
  }

  const age =
    Date.now() -
    timestamp;

  // Future-dated cache entries are
  // invalid and must never be treated
  // as fresh or stale fallback data.
  if (
    age < 0
  ) {
    return null;
  }

  return age;
}

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

  const cachedAge =
    cached
      ? getCacheAge(
          cached.timestamp
        )
      : null;

  if (
    cached &&
    cachedAge !== null
  ) {
    if (
      cachedAge <
      CACHE_TTL
    ) {
      console.log(
        `📦 Historical Cache HIT: ${symbol}`
      );

      return cached.data;
    }

    console.log(
      `♻️ Historical Cache EXPIRED: ${symbol}`
    );
  } else if (cached) {
    console.log(
      `⚠️ Historical Cache INVALID AGE: ${symbol}`
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
            timestamp:
              Date.now(),
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
        // BOUNDED STALE CACHE FALLBACK
        // =================================

        if (
          cached &&
          cachedAge !== null &&
          cachedAge <=
            HISTORICAL_STALE_FALLBACK_MAX_AGE_MS
        ) {
          console.log(
            `♻️ Historical STALE CACHE FALLBACK: ${symbol}`
          );

          return cached.data;
        }

        if (
          cached &&
          cachedAge !== null &&
          cachedAge >
            HISTORICAL_STALE_FALLBACK_MAX_AGE_MS
        ) {
          console.warn(
            `⚠️ Historical STALE CACHE TOO OLD: ${symbol}`
          );
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
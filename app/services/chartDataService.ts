import { CandleData } from "../types/chart";

import {
  HistoricalProvider,
} from "../providers/historicalProvider";

import { resolveUniversalSymbol } from "./universalSymbolEngine";

import { calculateEMAArray } from "../indicators/ema";
import { calculateRSIArray } from "../indicators/rsi";

const historical = new HistoricalProvider();

// =====================================
// Chart Data Cache
// =====================================

type ChartCacheEntry = {
  data: CandleData[];
  timestamp: number;
};

const chartCache =
  new Map<string, ChartCacheEntry>();

const chartFetchCache =
  new Map<
    string,
    Promise<CandleData[]>
  >();

const CACHE_TTL =
  60 * 1000;


export function buildChartData(
  timestamps: number[],
  open: number[],
  high: number[],
  low: number[],
  close: number[],
  volume: number[]
): CandleData[] {

  const chartData: CandleData[] = [];

  for (
    let i = 0;
    i < timestamps.length;
    i++
  ) {

    if (
      open[i] == null ||
      high[i] == null ||
      low[i] == null ||
      close[i] == null
    ) {
      continue;
    }

    chartData.push({

      time: new Date(
        timestamps[i] * 1000
      )
        .toISOString()
        .split("T")[0],

      open: open[i],
      high: high[i],
      low: low[i],
      close: close[i],

      volume: volume[i],
    });
  }

  return chartData;
}


export async function getChartData(
  symbol: string
): Promise<CandleData[]> {

  const resolvedSymbol =
    resolveUniversalSymbol(symbol);

  console.log(
    `Chart Symbol : ${symbol} -> ${resolvedSymbol}`
  );

  // =====================================
  // 1. NORMAL CACHE CHECK
  // =====================================

  const cached =
    chartCache.get(resolvedSymbol);

  if (cached) {

    const age =
      Date.now() -
      cached.timestamp;

    if (age < CACHE_TTL) {

      console.log(
        `📦 Chart Cache HIT: ${resolvedSymbol}`
      );

      return cached.data;
    }

    console.log(
      `♻️ Chart Cache EXPIRED: ${resolvedSymbol}`
    );

    chartCache.delete(
      resolvedSymbol
    );
  }

  // =====================================
  // 2. CHECK IN-FLIGHT REQUEST
  // =====================================

  const existingFetch =
    chartFetchCache.get(
      resolvedSymbol
    );

  if (existingFetch) {

    console.log(
      `⏳ Chart Fetch IN-FLIGHT: ${resolvedSymbol}`
    );

    return existingFetch;
  }

  // =====================================
  // 3. CREATE ONE SHARED FETCH
  // =====================================

  const fetchPromise =
    (async (): Promise<CandleData[]> => {

      const historicalLabel =
        `Chart Historical Fetch ${resolvedSymbol}`;

      console.time(
        historicalLabel
      );

      const ohlc =
        await historical.getHistoricalOHLC(
          resolvedSymbol
        );

      console.timeEnd(
        historicalLabel
      );

      // =================================
      // Chart Build
      // =================================

      console.time(
        "⏱ Chart Build"
      );

      const chartData =
        buildChartData(
          ohlc.timestamps,
          ohlc.open,
          ohlc.high,
          ohlc.low,
          ohlc.close,
          ohlc.volume
        );

      console.timeEnd(
        "⏱ Chart Build"
      );

      // =================================
      // EMA
      // =================================

      console.time(
        "⏱ Chart EMA"
      );

      const ema20 =
        calculateEMAArray(
          ohlc.close,
          20
        );

      const ema50 =
        calculateEMAArray(
          ohlc.close,
          50
        );

      const ema200 =
        calculateEMAArray(
          ohlc.close,
          200
        );

      console.timeEnd(
        "⏱ Chart EMA"
      );

      // =================================
      // RSI
      // =================================

      console.time(
        "⏱ Chart RSI"
      );

      const rsi =
        calculateRSIArray(
          ohlc.close,
          14
        );

      console.timeEnd(
        "⏱ Chart RSI"
      );

      // =================================
      // Indicator Merge
      // =================================

      console.time(
        "⏱ Chart Indicator Merge"
      );

      for (
        let i = 0;
        i < chartData.length;
        i++
      ) {

        chartData[i].ema20 =
          ema20[i];

        chartData[i].ema50 =
          ema50[i];

        chartData[i].ema200 =
          ema200[i];

        chartData[i].rsi =
          rsi[i];
      }

      console.timeEnd(
        "⏱ Chart Indicator Merge"
      );

      // =================================
      // SAVE CACHE
      // =================================

      chartCache.set(
        resolvedSymbol,
        {
          data: chartData,
          timestamp: Date.now(),
        }
      );

      console.log(
        `💾 Chart Cache SAVED: ${resolvedSymbol}`
      );

      return chartData;

    })();

  // =====================================
  // 4. STORE IN-FLIGHT PROMISE
  // =================================

  chartFetchCache.set(
    resolvedSymbol,
    fetchPromise
  );

  try {

    return await fetchPromise;

  } finally {

    // ===================================
    // 5. REMOVE IN-FLIGHT ENTRY
    // ===================================

    chartFetchCache.delete(
      resolvedSymbol
    );
  }
}
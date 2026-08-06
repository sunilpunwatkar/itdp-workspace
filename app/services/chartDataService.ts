import { CandleData } from "../types/chart";

import {
  HistoricalProvider,
} from "../providers/historicalProvider";

import { resolveUniversalSymbol } from "./universalSymbolEngine";

import { calculateEMAArray } from "../indicators/ema";
import { calculateRSIArray } from "../indicators/rsi";

const historical = new HistoricalProvider();

export function buildChartData(
  timestamps: number[],
  open: number[],
  high: number[],
  low: number[],
  close: number[],
  volume: number[]
): CandleData[] {

  const chartData: CandleData[] = [];

  for (let i = 0; i < timestamps.length; i++) {

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

  const ohlc =
    await historical.getHistoricalOHLC(
      resolvedSymbol
    );

  const chartData = buildChartData(
  ohlc.timestamps,
  ohlc.open,
  ohlc.high,
  ohlc.low,
  ohlc.close,
  ohlc.volume
);

  const ema = {
    ema20: calculateEMAArray(ohlc.close, 20),
    ema50: calculateEMAArray(ohlc.close, 50),
    ema200: calculateEMAArray(ohlc.close, 200),
  };
  const rsi =
  calculateRSIArray(
    ohlc.close,
    14
  );

  for (let i = 0; i < chartData.length; i++) {

    chartData[i].ema20 = ema.ema20[i];

    chartData[i].ema50 = ema.ema50[i];

    chartData[i].ema200 = ema.ema200[i];

    chartData[i].rsi = rsi[i];

  }
  

  return chartData;

}
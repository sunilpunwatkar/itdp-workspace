import { CandleData } from "../types/chart";
import {
  HistoricalProvider,
} from "../providers/historicalProvider";
import { resolveUniversalSymbol } from "./universalSymbolEngine";

const historical = new HistoricalProvider();

export function buildChartData(
  timestamps: number[],
  open: number[],
  high: number[],
  low: number[],
  close: number[]
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

      volume: 0,
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

  return buildChartData(
    ohlc.timestamps,
    ohlc.open,
    ohlc.high,
    ohlc.low,
    ohlc.close
  );
}
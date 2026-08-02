import { calculateEMAValues } from "./emaService";
import { calculateRSIValues } from "./rsiService";
import { calculateATRValues } from "./atrService";
import { calculateMACDValues } from "./macdService";
import { MarketSignal } from "../types/marketSignal";
import { detectTrend } from "./trendService";

export function buildMarketSignal(
  prices: number[]
): MarketSignal {

  const ema = calculateEMAValues(prices);
  const rsi = calculateRSIValues(prices);
  const atr = calculateATRValues(prices);
  const trend = detectTrend(
  ema.ema20,
  ema.ema50,
  ema.ema200
);

console.log("Trend:", trend);
  const macd = calculateMACDValues(prices);

  console.log("MACD:", macd);

  return {
    ema20: ema.ema20,
    ema50: ema.ema50,
    ema200: ema.ema200,

    emaSignal:
      ema.ema20 > ema.ema50
        ? "BUY"
        : "SELL",

    rsi: rsi.rsi,
    rsiSignal: rsi.signal,

    atr: atr.atr,

macd: macd.macd,
signal: macd.signal,
histogram: macd.histogram,
macdSignal: macd.macdSignal,

trend: trend.trend,
  };
}
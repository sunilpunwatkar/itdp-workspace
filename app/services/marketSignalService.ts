import { calculateEMAValues } from "./emaService";
import { calculateRSIValues } from "./rsiService";
import { MarketSignal } from "../types/marketSignal";

export function buildMarketSignal(
  prices: number[]
): MarketSignal {

  const ema = calculateEMAValues(prices);
  const rsi = calculateRSIValues(prices);

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
  };
}
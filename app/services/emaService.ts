import { calculateEMA } from "../indicators/ema";

export interface EMAResult {
  ema20: number;
  ema50: number;
  ema200: number;
}

export function calculateEMAValues(
  prices: number[]
): EMAResult {

  return {
    ema20: calculateEMA(prices, 20),
    ema50: calculateEMA(prices, 50),
    ema200: calculateEMA(prices, 200),
  };

}
import { calculateRSI } from "../indicators/rsi";

export interface RSIResult {
  rsi: number;
  signal: "BUY" | "SELL" | "HOLD";
}

export function calculateRSIValues(
  prices: number[]
): RSIResult {

  const rsi = calculateRSI(prices);

  let signal: "BUY" | "SELL" | "HOLD" = "HOLD";

  if (rsi < 30) {
    signal = "BUY";
  } else if (rsi > 70) {
    signal = "SELL";
  }

  return {
    rsi,
    signal,
  };
}
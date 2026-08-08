import { calculateEMAArray } from "../indicators/ema";

export interface MACDResult {
  macd: number;
  signal: number;
  histogram: number;
  macdSignal: "BUY" | "SELL" | "HOLD";
}

export function calculateMACDValues(
  prices: number[]
): MACDResult {

  if (prices.length < 35) {
    return {
      macd: 0,
      signal: 0,
      histogram: 0,
      macdSignal: "HOLD",
    };
  }

  const ema12 =
    calculateEMAArray(prices, 12);

  const ema26 =
    calculateEMAArray(prices, 26);

  // =====================================
  // MACD Line
  // =====================================

  const macdLine: number[] = [];

  for (let i = 0; i < prices.length; i++) {

    if (
      Number.isFinite(ema12[i]) &&
      Number.isFinite(ema26[i])
    ) {
      macdLine.push(
        Number(
          (ema12[i] - ema26[i]).toFixed(2)
        )
      );
    }
  }

  // =====================================
  // Signal Line
  // =====================================

  if (macdLine.length < 9) {
    return {
      macd: 0,
      signal: 0,
      histogram: 0,
      macdSignal: "HOLD",
    };
  }

  const signalLine =
    calculateEMAArray(
      macdLine,
      9
    );

  // =====================================
  // Latest Values
  // =====================================

  const macd =
    macdLine[macdLine.length - 1];

  const signal =
    signalLine[signalLine.length - 1];

  const histogram =
    Number(
      (macd - signal).toFixed(2)
    );

  // =====================================
  // MACD Signal
  // =====================================

  let macdSignal:
    | "BUY"
    | "SELL"
    | "HOLD" = "HOLD";

  if (macd > signal) {

    macdSignal = "BUY";

  } else if (macd < signal) {

    macdSignal = "SELL";
  }

  return {
    macd,
    signal,
    histogram,
    macdSignal,
  };
}
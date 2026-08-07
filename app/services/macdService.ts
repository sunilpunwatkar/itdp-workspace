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

  const ema12 = calculateEMAArray(prices, 12);

  const ema26 = calculateEMAArray(prices, 26);

  const macdLine = ema12.map(
    (value, index) =>
      Number((value - ema26[index]).toFixed(2))
  );

  const signalLine =
    calculateEMAArray(macdLine, 9);

  const last =
    macdLine.length - 1;

  const macd =
    macdLine[last];

  const signal =
    signalLine[last];

  const histogram =
    Number((macd - signal).toFixed(2));

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
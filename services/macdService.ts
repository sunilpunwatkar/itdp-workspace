export interface MACDResult {
  macd: number;
  signal: number;
  histogram: number;
  macdSignal: "BUY" | "SELL" | "HOLD";
}

function calculateEMA(
  prices: number[],
  period: number
): number[] {
  const multiplier = 2 / (period + 1);

  const ema: number[] = [];

  ema[0] = prices[0];

  for (let i = 1; i < prices.length; i++) {
    ema[i] =
      (prices[i] - ema[i - 1]) * multiplier +
      ema[i - 1];
  }

  return ema;
}

export function calculateMACDValues(
  prices: number[]
): MACDResult {

  const ema12 = calculateEMA(prices, 12);

  const ema26 = calculateEMA(prices, 26);

  const macdLine = ema12.map(
    (value, index) => value - ema26[index]
  );

  const signalLine = calculateEMA(macdLine, 9);

  const lastMACD =
    macdLine[macdLine.length - 1];

  const lastSignal =
    signalLine[signalLine.length - 1];

  const histogram =
    lastMACD - lastSignal;

  return {
    macd: lastMACD,
    signal: lastSignal,
    histogram,

    macdSignal:
      lastMACD > lastSignal
        ? "BUY"
        : lastMACD < lastSignal
        ? "SELL"
        : "HOLD",
  };
}
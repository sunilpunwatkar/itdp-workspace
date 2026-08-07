import { calculateEMAArray } from "./ema";

export interface MACDResult {
  macd: number[];
  signal: number[];
  histogram: number[];
}

export function calculateMACD(
  prices: number[]
): MACDResult {

  const ema12 = calculateEMAArray(prices, 12);
  const ema26 = calculateEMAArray(prices, 26);

  const macd: number[] = [];

  for (let i = 0; i < prices.length; i++) {

    if (
      ema12[i] == null ||
      ema26[i] == null
    ) {
      macd.push(NaN);
      continue;
    }

    macd.push(
      Number((ema12[i] - ema26[i]).toFixed(2))
    );
  }

  const validMACD = macd.filter(
    (value) => !Number.isNaN(value)
  );

  const signalRaw =
    calculateEMAArray(validMACD, 9);

  const signal: number[] = [];

  let signalIndex = 0;

  for (let i = 0; i < macd.length; i++) {

    if (Number.isNaN(macd[i])) {

      signal.push(NaN);

    } else {

      signal.push(signalRaw[signalIndex]);
      signalIndex++;

    }

  }

  const histogram: number[] = [];

  for (let i = 0; i < macd.length; i++) {

    if (
      Number.isNaN(macd[i]) ||
      signal[i] == null
    ) {

      histogram.push(NaN);

      continue;

    }

    histogram.push(
      Number(
        (macd[i] - signal[i]).toFixed(2)
      )
    );

  }

  return {
    macd,
    signal,
    histogram,
  };

}
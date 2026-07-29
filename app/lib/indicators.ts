export function calculateEMA(
  prices: number[],
  period: number
): number[] {

  if (prices.length < period) {
    return [];
  }

  const multiplier = 2 / (period + 1);

  const ema: number[] = [];

  let sma = 0;

  for (let i = 0; i < period; i++) {
    sma += prices[i];
  }

  sma = sma / period;

  ema.push(sma);

  for (let i = period; i < prices.length; i++) {
    const value =
      (prices[i] - ema[ema.length - 1]) * multiplier +
      ema[ema.length - 1];

    ema.push(value);
  }

  return ema;
}

export function calculateRSI(
  prices: number[],
  period: number = 14
): number {

  if (prices.length <= period) {
    return 50;
  }

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {

    const change = prices[i] - prices[i - 1];

    if (change > 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }

  const averageGain = gains / period;
  const averageLoss = losses / period;

  if (averageLoss === 0) {
    return 100;
  }

  const rs = averageGain / averageLoss;

  return 100 - (100 / (1 + rs));
}
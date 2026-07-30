export function calculateEMA(
  prices: number[],
  period: number
): number {

  if (prices.length < period) {
    throw new Error("Not enough historical data");
  }

  const multiplier = 2 / (period + 1);

  let ema =
    prices
      .slice(0, period)
      .reduce((sum, value) => sum + value, 0) / period;

  for (let i = period; i < prices.length; i++) {
    ema =
      (prices[i] - ema) * multiplier + ema;
  }

  return Number(ema.toFixed(2));
}
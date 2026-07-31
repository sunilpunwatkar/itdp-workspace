export interface ATRResult {
  atr: number;
}

export function calculateATRValues(
  prices: number[]
): ATRResult {

  if (prices.length < 15) {
    return {
      atr: 0,
    };
  }

  let total = 0;

  for (let i = prices.length - 14; i < prices.length; i++) {
    total += Math.abs(prices[i] - prices[i - 1]);
  }

  return {
    atr: total / 14,
  };
}
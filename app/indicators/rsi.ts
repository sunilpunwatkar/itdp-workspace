export function calculateRSI(
  prices: number[],
  period: number = 14
): number {

  if (prices.length < period + 1) {
    throw new Error("Not enough historical data");
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

  let averageGain = gains / period;
  let averageLoss = losses / period;

  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];

    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;

    averageGain =
      ((averageGain * (period - 1)) + gain) / period;

    averageLoss =
      ((averageLoss * (period - 1)) + loss) / period;
  }

  if (averageLoss === 0) {
    return 100;
  }

  const rs = averageGain / averageLoss;

  const rsi = 100 - (100 / (1 + rs));

  return Number(rsi.toFixed(2));
}
export function calculateRSIArray(
  prices: number[],
  period: number = 14
): number[] {

  if (prices.length < period + 1) {
    throw new Error("Not enough historical data");
  }

  const rsiArray: number[] = [];

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {

    const change =
      prices[i] - prices[i - 1];

    if (change > 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }

    rsiArray.push(NaN);
  }

  let averageGain = gains / period;
  let averageLoss = losses / period;

  let rs =
    averageLoss === 0
      ? 0
      : averageGain / averageLoss;

  rsiArray.push(
    Number(
      (
        100 -
        100 / (1 + rs)
      ).toFixed(2)
    )
  );

  for (
    let i = period + 1;
    i < prices.length;
    i++
  ) {

    const change =
      prices[i] - prices[i - 1];

    const gain =
      change > 0 ? change : 0;

    const loss =
      change < 0
        ? Math.abs(change)
        : 0;

    averageGain =
      (
        averageGain *
          (period - 1) +
        gain
      ) /
      period;

    averageLoss =
      (
        averageLoss *
          (period - 1) +
        loss
      ) /
      period;

    rs =
      averageLoss === 0
        ? 0
        : averageGain /
          averageLoss;

    const rsi =
      100 -
      100 / (1 + rs);

    rsiArray.push(
      Number(rsi.toFixed(2))
    );

  }

  return rsiArray;

}
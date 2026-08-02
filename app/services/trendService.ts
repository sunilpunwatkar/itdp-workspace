export interface TrendResult {
  trend: "UPTREND" | "DOWNTREND" | "SIDEWAYS";
}

export function detectTrend(
  ema20: number,
  ema50: number,
  ema200: number
): TrendResult {

  if (ema20 > ema50 && ema50 > ema200) {
    return {
      trend: "UPTREND",
    };
  }

  if (ema20 < ema50 && ema50 < ema200) {
    return {
      trend: "DOWNTREND",
    };
  }

  return {
    trend: "SIDEWAYS",
  };
}
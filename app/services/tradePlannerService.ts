export interface TradePlan {
  target1: number;
  target2: number;
  tradeQuality: string;
  holdingPeriod: string;
  aiSummary: string;
}

export function buildTradePlan(
  decision: string,
  entry: number,
  atr: number,
  confidence: number
): TradePlan {

  if (decision === "BUY") {
    return {
      target1: Number((entry + atr * 2).toFixed(2)),
      target2: Number((entry + atr * 4).toFixed(2)),
      tradeQuality:
        confidence >= 80 ? "A+" :
        confidence >= 60 ? "A" :
        "B",
      holdingPeriod: "5 - 15 Days",
      aiSummary:
        "Bullish trend supported by technical indicators.",
    };
  }

  if (decision === "SELL") {
    return {
      target1: Number((entry - atr * 2).toFixed(2)),
      target2: Number((entry - atr * 4).toFixed(2)),
      tradeQuality:
        confidence >= 80 ? "A+" :
        confidence >= 60 ? "A" :
        "B",
      holdingPeriod: "3 - 10 Days",
      aiSummary:
        "Bearish trend supported by technical indicators.",
    };
  }

  return {
    target1: entry,
    target2: entry,
    tradeQuality: "No Trade",
    holdingPeriod: "-",
    aiSummary:
      "Indicators are mixed. Wait for a better setup.",
  };
}
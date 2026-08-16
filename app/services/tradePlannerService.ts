export interface TradePlan {
  tradeQuality: string;
  holdingPeriod: string;
  aiSummary: string;
}

export function buildTradePlan(
  decision: string,
  confidence: number
): TradePlan {

  if (decision === "BUY") {
    return {
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
    tradeQuality: "No Trade",
    holdingPeriod: "-",
    aiSummary:
      "Indicators are mixed. Wait for a better setup.",
  };
}
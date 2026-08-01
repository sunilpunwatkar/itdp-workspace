export interface RiskResult {
  stopLoss: number;
  target1: number;
  target2: number;
  riskReward: string;
}

export function buildRiskPlan(
  entry: number,
  atr: number,
  decision: "BUY" | "SELL" | "HOLD"
): RiskResult {

  if (decision === "BUY") {

    const stopLoss = entry - (2 * atr);

    const target1 = entry + (2 * atr);

    const target2 = entry + (4 * atr);

    return {
      stopLoss,
      target1,
      target2,
      riskReward: "1 : 2",
    };
  }

  if (decision === "SELL") {

    const stopLoss = entry + (2 * atr);

    const target1 = entry - (2 * atr);

    const target2 = entry - (4 * atr);

    return {
      stopLoss,
      target1,
      target2,
      riskReward: "1 : 2",
    };
  }

  return {
    stopLoss: entry,
    target1: entry,
    target2: entry,
    riskReward: "-",
  };
}
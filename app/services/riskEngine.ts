export interface RiskResult {
  stopLoss: number | null;
  target1: number | null;
  target2: number | null;
  riskReward: string;
}

export function buildRiskPlan(
  entry: number,
  atr: number,
  decision: "BUY" | "SELL" | "HOLD"
): RiskResult {

  if (decision === "BUY") {

    const stopLoss = Number((entry - (2 * atr)).toFixed(2));

    const target1 = Number((entry + (2 * atr)).toFixed(2));

    const target2 = Number((entry + (4 * atr)).toFixed(2));

    return {
      stopLoss,
      target1,
      target2,
      riskReward: "1 : 2",
    };
  }

  if (decision === "SELL") {

    const stopLoss = Number((entry + (2 * atr)).toFixed(2));

    const target1 = Number((entry - (2 * atr)).toFixed(2));

    const target2 = Number((entry - (4 * atr)).toFixed(2));

    return {
      stopLoss,
      target1,
      target2,
      riskReward: "1 : 2",
    };
  }

  // HOLD
  return {
    stopLoss: null,
    target1: null,
    target2: null,
    riskReward: "-",
  };
}
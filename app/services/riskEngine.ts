export interface RiskResult {
  stopLoss: number | null;
  target1: number | null;
  target2: number | null;
  riskReward: string;
}

export function buildRiskPlan(
  entry: number,
  atr: number,
  decision: "BUY" | "SELL" | "HOLD",
  support1: number | null,
  support2: number | null,
  resistance1: number | null,
  resistance2: number | null
): RiskResult {
    // =====================================================
  // ATR VALIDATION
  // =====================================================

  if (atr <= 0) {
    return {
      stopLoss: null,
      target1: null,
      target2: null,
      riskReward: "INVALID ATR",
    };
  }


  // =====================================================
  // HOLD
  // =====================================================

  if (decision === "HOLD") {
    return {
      stopLoss: null,
      target1: null,
      target2: null,
      riskReward: "-",
    };
  }

  // =====================================================
  // BUY
  // =====================================================

  if (decision === "BUY") {

    // ATR based protective stop
    const atrStop =
      entry - (2 * atr);

    // Prefer Support 1 as technical stop.
    // If Support 1 is too close to entry, use ATR stop.
    let stopLoss =
      support1 !== null && support1 < entry
        ? Math.min(
            support1,
            atrStop
          )
        : atrStop;

    stopLoss = Number(
      stopLoss.toFixed(2)
    );

    // Target 1
    let target1 =
      resistance1 !== null &&
      resistance1 > entry
        ? resistance1
        : entry + (2 * atr);

    // Target 2
    let target2 =
      resistance2 !== null &&
      resistance2 > target1
        ? resistance2
        : entry + (4 * atr);

    target1 = Number(
      target1.toFixed(2)
    );

    target2 = Number(
      target2.toFixed(2)
    );

    // Risk per share
    const risk =
      entry - stopLoss;

    // Reward to Target 1
    const reward =
      target1 - entry;

    const rewardRiskRatio =
  risk > 0
    ? reward / risk
    : 0;

if (rewardRiskRatio < 1.5) {
  return {
    stopLoss: null,
    target1: null,
    target2: null,
    riskReward: "BELOW 1:1.5",
  };
}

const riskReward =
  `1 : ${rewardRiskRatio.toFixed(2)}`;

return {
  stopLoss,
  target1,
  target2,
  riskReward,
};
  }

  // =====================================================
  // SELL
  // =====================================================

  if (decision === "SELL") {

    // ATR based protective stop
    const atrStop =
      entry + (2 * atr);

    // Prefer Resistance 1 as technical stop.
    // If Resistance 1 is too close to entry,
    // use ATR based stop.
    let stopLoss =
      resistance1 !== null &&
      resistance1 > entry
        ? Math.max(
            resistance1,
            atrStop
          )
        : atrStop;

    stopLoss = Number(
      stopLoss.toFixed(2)
    );

    // Target 1
    let target1 =
      support1 !== null &&
      support1 < entry
        ? support1
        : entry - (2 * atr);

    // Target 2
    let target2 =
      support2 !== null &&
      support2 < target1
        ? support2
        : entry - (4 * atr);

    target1 = Number(
      target1.toFixed(2)
    );

    target2 = Number(
      target2.toFixed(2)
    );

    // Risk per share
    const risk =
      stopLoss - entry;

    // Reward to Target 1
    const reward =
      entry - target1;

    const rewardRiskRatio =
  risk > 0
    ? reward / risk
    : 0;

if (rewardRiskRatio < 1.5) {
  return {
    stopLoss: null,
    target1: null,
    target2: null,
    riskReward: "BELOW 1:1.5",
  };
}

const riskReward =
  `1 : ${rewardRiskRatio.toFixed(2)}`;

return {
  stopLoss,
  target1,
  target2,
  riskReward,
};
  }

  // =====================================================
  // SAFETY FALLBACK
  // =====================================================

  return {
    stopLoss: null,
    target1: null,
    target2: null,
    riskReward: "-",
  };
}
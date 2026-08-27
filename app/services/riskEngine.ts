export interface RiskResult {
  stopLoss: number | null;
  target1: number | null;
  target2: number | null;
  riskReward: string;
}

// =====================================================
// RISK ENGINE
// =====================================================

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
  // 1. BASIC VALIDATION
  // =====================================================

  if (!Number.isFinite(entry) || entry <= 0) {
    return {
      stopLoss: null,
      target1: null,
      target2: null,
      riskReward: "INVALID ENTRY",
    };
  }

  if (!Number.isFinite(atr) || atr <= 0) {
    return {
      stopLoss: null,
      target1: null,
      target2: null,
      riskReward: "INVALID ATR",
    };
  }

  // =====================================================
  // 2. HOLD = NO TRADE
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
  // 3. BUY
  // =====================================================

  if (decision === "BUY") {

    // ---------------------------------------------------
    // ATR STOP
    // ---------------------------------------------------

    const atrStop = entry - (2 * atr);

    // ---------------------------------------------------
    // Technical Stop
    // ---------------------------------------------------

    let stopLoss =
      support1 !== null &&
      Number.isFinite(support1) &&
      support1 < entry
        ? Math.min(support1, atrStop)
        : atrStop;

    stopLoss = Number(stopLoss.toFixed(2));

    // ---------------------------------------------------
    // Risk per share
    // ---------------------------------------------------

    const risk = entry - stopLoss;

    if (risk <= 0) {
      return {
        stopLoss: null,
        target1: null,
        target2: null,
        riskReward: "INVALID RISK",
      };
    }

    // ---------------------------------------------------
    // Minimum required reward
    //
    // Minimum RR = 1 : 1.5
    // ---------------------------------------------------

    const minimumTarget =
      entry + (risk * 1.5);

    // ---------------------------------------------------
    // TARGET 1
    //
    // Prefer Resistance 1 only if it satisfies
    // minimum Risk/Reward.
    // Otherwise use ATR-based target.
    // ---------------------------------------------------

    let target1: number;

    if (
      resistance1 !== null &&
      Number.isFinite(resistance1) &&
      resistance1 > entry &&
      resistance1 >= minimumTarget
    ) {
      target1 = resistance1;
    } else {
      target1 = minimumTarget;
    }

    target1 = Number(target1.toFixed(2));

    // ---------------------------------------------------
    // TARGET 2
    // ---------------------------------------------------

    let target2: number;

    if (
      resistance2 !== null &&
      Number.isFinite(resistance2) &&
      resistance2 > target1
    ) {
      target2 = resistance2;
    } else {
      target2 = entry + (risk * 2);
    }

    target2 = Number(target2.toFixed(2));

    // ---------------------------------------------------
    // FINAL RR
    // ---------------------------------------------------

    const reward =
      target1 - entry;

    const rewardRiskRatio =
      reward / risk;

    if (rewardRiskRatio < 1.5) {
      return {
        stopLoss: null,
        target1: null,
        target2: null,
        riskReward:
          `BELOW 1:1.5 (${rewardRiskRatio.toFixed(2)})`,
      };
    }

    return {
      stopLoss,
      target1,
      target2,
      riskReward:
        `1 : ${rewardRiskRatio.toFixed(2)}`,
    };
  }

  // =====================================================
  // 4. SELL
  // =====================================================

  if (decision === "SELL") {

    // ---------------------------------------------------
    // ATR STOP
    // ---------------------------------------------------

    const atrStop =
      entry + (2 * atr);

    // ---------------------------------------------------
    // Technical Stop
    // ---------------------------------------------------

    let stopLoss =
      resistance1 !== null &&
      Number.isFinite(resistance1) &&
      resistance1 > entry
        ? Math.max(resistance1, atrStop)
        : atrStop;

    stopLoss = Number(stopLoss.toFixed(2));

    // ---------------------------------------------------
    // Risk per share
    // ---------------------------------------------------

    const risk =
      stopLoss - entry;

    if (risk <= 0) {
      return {
        stopLoss: null,
        target1: null,
        target2: null,
        riskReward: "INVALID RISK",
      };
    }

    // ---------------------------------------------------
    // Minimum required reward
    //
    // Minimum RR = 1 : 1.5
    // ---------------------------------------------------

    const minimumTarget =
      entry - (risk * 1.5);

    // ---------------------------------------------------
    // TARGET 1
    //
    // Prefer Support 1 only if it satisfies
    // minimum Risk/Reward.
    // Otherwise use ATR-based target.
    // ---------------------------------------------------

    let target1: number;

    if (
      support1 !== null &&
      Number.isFinite(support1) &&
      support1 < entry &&
      support1 <= minimumTarget
    ) {
      target1 = support1;
    } else {
      target1 = minimumTarget;
    }

    target1 = Number(target1.toFixed(2));

    // ---------------------------------------------------
    // TARGET 2
    // ---------------------------------------------------

    let target2: number;

    if (
      support2 !== null &&
      Number.isFinite(support2) &&
      support2 < target1
    ) {
      target2 = support2;
    } else {
      target2 = entry - (risk * 2);
    }

    target2 = Number(target2.toFixed(2));

    // ---------------------------------------------------
    // FINAL RR
    // ---------------------------------------------------

    const reward =
  entry - target1;

const rewardRiskRatio =
  reward / risk;

const roundedRewardRiskRatio =
  Number(rewardRiskRatio.toFixed(2));

if (roundedRewardRiskRatio < 1.5) {
  return {
    stopLoss: null,
    target1: null,
    target2: null,
    riskReward:
      `BELOW 1:1.5 (${roundedRewardRiskRatio.toFixed(2)})`,
  };
}

    return {
      stopLoss,
      target1,
      target2,
      riskReward:
        `1 : ${roundedRewardRiskRatio.toFixed(2)}`,
    };
  }

  // =====================================================
  // 5. SAFETY FALLBACK
  // =====================================================

  return {
    stopLoss: null,
    target1: null,
    target2: null,
    riskReward: "-",
  };
}
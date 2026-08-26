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
  // BASIC VALIDATION
  // =====================================================

  if (
    !Number.isFinite(entry) ||
    entry <= 0
  ) {
    return {
      stopLoss: null,
      target1: null,
      target2: null,
      riskReward: "INVALID ENTRY",
    };
  }

  if (
    !Number.isFinite(atr) ||
    atr <= 0
  ) {
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

    // ---------------------------------------------------
    // ATR STOP
    // ---------------------------------------------------

    const atrStop =
      entry - (2 * atr);

    // ---------------------------------------------------
    // TECHNICAL STOP
    // ---------------------------------------------------

    let stopLoss =
      support1 !== null &&
      Number.isFinite(support1) &&
      support1 < entry
        ? Math.min(
            support1,
            atrStop
          )
        : atrStop;

    stopLoss =
      Number(stopLoss.toFixed(2));

    // ---------------------------------------------------
    // TARGET 1
    // ---------------------------------------------------

    let target1 =
      resistance1 !== null &&
      Number.isFinite(resistance1) &&
      resistance1 > entry
        ? resistance1
        : entry + (2 * atr);

    target1 =
      Number(target1.toFixed(2));

    // ---------------------------------------------------
    // TARGET 2
    // ---------------------------------------------------

    let target2 =
      resistance2 !== null &&
      Number.isFinite(resistance2) &&
      resistance2 > target1
        ? resistance2
        : entry + (4 * atr);

    target2 =
      Number(target2.toFixed(2));

    // ---------------------------------------------------
    // RISK PER SHARE
    // ---------------------------------------------------

    const risk =
      entry - stopLoss;

    // ---------------------------------------------------
    // REWARD TO TARGET 1
    // ---------------------------------------------------

    const reward =
      target1 - entry;

    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (
      risk <= 0 ||
      reward <= 0
    ) {
      return {
        stopLoss: null,
        target1: null,
        target2: null,
        riskReward: "INVALID RISK/REWARD",
      };
    }

    // ---------------------------------------------------
    // RISK / REWARD RATIO
    // ---------------------------------------------------

    const rewardRiskRatio =
      reward / risk;

    console.log(
      "BUY Risk Calculation:",
      {
        entry,
        stopLoss,
        target1,
        target2,
        risk,
        reward,
        rewardRiskRatio,
      }
    );

    // ---------------------------------------------------
    // MINIMUM REQUIRED R:R = 1:1.5
    // ---------------------------------------------------

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
  // SELL
  // =====================================================

  if (decision === "SELL") {

    // ---------------------------------------------------
    // ATR STOP
    // ---------------------------------------------------

    const atrStop =
      entry + (2 * atr);

    // ---------------------------------------------------
    // TECHNICAL STOP
    // ---------------------------------------------------

    let stopLoss =
      resistance1 !== null &&
      Number.isFinite(resistance1) &&
      resistance1 > entry
        ? Math.max(
            resistance1,
            atrStop
          )
        : atrStop;

    stopLoss =
      Number(stopLoss.toFixed(2));

    // ---------------------------------------------------
    // TARGET 1
    // ---------------------------------------------------

    let target1 =
      support1 !== null &&
      Number.isFinite(support1) &&
      support1 < entry
        ? support1
        : entry - (2 * atr);

    target1 =
      Number(target1.toFixed(2));

    // ---------------------------------------------------
    // TARGET 2
    // ---------------------------------------------------

    let target2 =
      support2 !== null &&
      Number.isFinite(support2) &&
      support2 < target1
        ? support2
        : entry - (4 * atr);

    target2 =
      Number(target2.toFixed(2));

    // ---------------------------------------------------
    // RISK PER SHARE
    // ---------------------------------------------------

    const risk =
      stopLoss - entry;

    // ---------------------------------------------------
    // REWARD TO TARGET 1
    // ---------------------------------------------------

    const reward =
      entry - target1;

    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (
      risk <= 0 ||
      reward <= 0
    ) {
      return {
        stopLoss: null,
        target1: null,
        target2: null,
        riskReward: "INVALID RISK/REWARD",
      };
    }

    // ---------------------------------------------------
    // RISK / REWARD RATIO
    // ---------------------------------------------------

    const rewardRiskRatio =
      reward / risk;

    console.log(
      "SELL Risk Calculation:",
      {
        entry,
        stopLoss,
        target1,
        target2,
        risk,
        reward,
        rewardRiskRatio,
      }
    );

    // ---------------------------------------------------
    // MINIMUM REQUIRED R:R = 1:1.5
    // ---------------------------------------------------

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
  // SAFETY FALLBACK
  // =====================================================

  return {
    stopLoss: null,
    target1: null,
    target2: null,
    riskReward: "-",
  };
}
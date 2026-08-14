import { CandleData } from "../types/chart";

export interface SupportResistanceResult {
  support1: number | null;
  support2: number | null;
  resistance1: number | null;
  resistance2: number | null;
}

export function calculateSupportResistance(
  candles: CandleData[]
): SupportResistanceResult {

  // -----------------------------------------------------
  // Minimum data check
  // -----------------------------------------------------

  if (candles.length < 20) {
    return {
      support1: null,
      support2: null,
      resistance1: null,
      resistance2: null,
    };
  }

  // -----------------------------------------------------
  // Use recent candles only
  // -----------------------------------------------------

  const recentCandles =
    candles.slice(-120);

  const swingHighs: number[] = [];
  const swingLows: number[] = [];

  // -----------------------------------------------------
  // Detect Swing High / Swing Low
  // -----------------------------------------------------

  for (
    let i = 2;
    i < recentCandles.length - 2;
    i++
  ) {

    const current =
      recentCandles[i];

    const previous1 =
      recentCandles[i - 1];

    const previous2 =
      recentCandles[i - 2];

    const next1 =
      recentCandles[i + 1];

    const next2 =
      recentCandles[i + 2];

    // Swing High
    if (
      current.high > previous1.high &&
      current.high > previous2.high &&
      current.high > next1.high &&
      current.high > next2.high
    ) {
      swingHighs.push(
        current.high
      );
    }

    // Swing Low
    if (
      current.low < previous1.low &&
      current.low < previous2.low &&
      current.low < next1.low &&
      current.low < next2.low
    ) {
      swingLows.push(
        current.low
      );
    }
  }

  // -----------------------------------------------------
  // Current Price
  // -----------------------------------------------------

  const currentPrice =
    recentCandles[
      recentCandles.length - 1
    ].close;

  // -----------------------------------------------------
  // Resistance
  // Levels ABOVE current price
  // -----------------------------------------------------

  const resistanceLevels =
    swingHighs
      .filter(
        level =>
          level > currentPrice
      )
      .sort(
        (a, b) => a - b
      );

  // -----------------------------------------------------
  // Support
  // Levels BELOW current price
  // -----------------------------------------------------

  const supportLevels =
    swingLows
      .filter(
        level =>
          level < currentPrice
      )
      .sort(
        (a, b) => b - a
      );

  // -----------------------------------------------------
  // Remove very close duplicate levels
  // -----------------------------------------------------

  const uniqueLevels = (
    levels: number[]
  ): number[] => {

    const result: number[] = [];

    for (const level of levels) {

      const tooClose =
        result.some(
          existing =>
            Math.abs(
              existing - level
            ) /
              level <
            0.005
        );

      if (!tooClose) {
        result.push(
          Number(
            level.toFixed(2)
          )
        );
      }
    }

    return result;
  };

  const uniqueResistance =
    uniqueLevels(
      resistanceLevels
    );

  const uniqueSupport =
    uniqueLevels(
      supportLevels
    );

  // -----------------------------------------------------
  // Final Levels
  // -----------------------------------------------------

  return {

    support1:
      uniqueSupport[0] ??
      null,

    support2:
      uniqueSupport[1] ??
      null,

    resistance1:
      uniqueResistance[0] ??
      null,

    resistance2:
      uniqueResistance[1] ??
      null,
  };
}
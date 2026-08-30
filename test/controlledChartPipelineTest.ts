import { getChartData } from "../app/services/chartDataService";

async function runTest() {

  console.log(
    "=== CONTROLLED CHART PIPELINE TEST ==="
  );

  try {

    const chartData =
      await getChartData("RELIANCE");

    // =====================================
    // TEST 1 — Chart Data Available
    // =====================================

    const hasChartData =
      chartData.length > 0;

    console.log(
      "TEST 1: Chart Data Available:",
      hasChartData
        ? "PASS"
        : "FAIL"
    );

    // =====================================
    // TEST 2 — OHLC Valid
    // =====================================

    const validOHLC =
      chartData.every(
        (candle) =>
          Number.isFinite(candle.open) &&
          Number.isFinite(candle.high) &&
          Number.isFinite(candle.low) &&
          Number.isFinite(candle.close)
      );

    console.log(
      "TEST 2: OHLC Data Valid:",
      validOHLC
        ? "PASS"
        : "FAIL"
    );

    // =====================================
    // TEST 3 — EMA Available
    // =====================================

    const emaAvailable =
      chartData.some(
        (candle) =>
          candle.ema20 !== undefined ||
          candle.ema50 !== undefined ||
          candle.ema200 !== undefined
      );

    console.log(
      "TEST 3: EMA Indicators Available:",
      emaAvailable
        ? "PASS"
        : "FAIL"
    );

    // =====================================
    // TEST 4 — RSI Available
    // =====================================

    const rsiAvailable =
      chartData.some(
        (candle) =>
          candle.rsi !== undefined
      );

    console.log(
      "TEST 4: RSI Indicator Available:",
      rsiAvailable
        ? "PASS"
        : "FAIL"
    );

    // =====================================
    // TEST 5 — Latest Candle
    // =====================================

    const latest =
      chartData[
        chartData.length - 1
      ];

    const latestValid =
      latest !== undefined &&
      typeof latest.time === "string" &&
      Number.isFinite(latest.close);

    console.log(
      "TEST 5: Latest Candle Valid:",
      latestValid
        ? "PASS"
        : "FAIL"
    );

    // =====================================
    // FINAL CHECK
    // =====================================

    const passed =
      [
        hasChartData,
        validOHLC,
        emaAvailable,
        rsiAvailable,
        latestValid,
      ].filter(Boolean).length;

    const failed =
      5 - passed;

    console.log(
      "=== FINAL CHECK ==="
    );

    console.log({
      totalTests: 5,
      passed,
      failed,
      allPassed: failed === 0,
      candles: chartData.length,
      latestClose: latest?.close,
    });

  } catch (error) {

    console.error(
      "TEST ERROR:",
      error
    );

  }
}

runTest();
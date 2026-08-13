"use client";

import { useEffect, useRef } from "react";

import {
  createChart,
  ColorType,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  LineStyle,
} from "lightweight-charts";

type Props = {
  symbol: string;
};

export default function LiveChart({ symbol }: Props) {
  const chartContainerRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const container = chartContainerRef.current;

    const isMobile = window.innerWidth <= 768;

    const getChartHeight = () =>
  isMobile ? 500 : 400;

    // =========================================
    // CREATE CHART
    // =========================================

    const chart = createChart(container, {
      width: container.clientWidth,
      height: getChartHeight(),

      layout: {
        background: {
          type: ColorType.Solid,
          color: "#0f172a",
        },

        textColor: "#ffffff",
      },

      grid: {
        vertLines: {
          color: "#334155",
        },

        horzLines: {
          color: "#334155",
        },
      },

      crosshair: {
        mode: 1,
      },

      rightPriceScale: {
        borderColor: "#475569",

        minimumWidth: isMobile ? 52 : 70,

        scaleMargins: {
          top: 0.05,
          bottom: 0.30,
        },
      },

      timeScale: {
        borderColor: "#475569",

        rightOffset: 0,

        barSpacing: isMobile ? 3 : 6,

        minBarSpacing: isMobile ? 1.5 : 3,

        fixLeftEdge: false,

        fixRightEdge: false,

        rightBarStaysOnScroll: true,
      },
    });

    // =========================================
    // PRICE — CANDLESTICK
    // =========================================

    const candleSeries =
      chart.addSeries(CandlestickSeries);

    // =========================================
    // EMA 20
    // =========================================

    const ema20Series =
      chart.addSeries(LineSeries, {
        color: "#FFD700",
        lineWidth: 2,
      });

    // =========================================
    // EMA 50
    // =========================================

    const ema50Series =
      chart.addSeries(LineSeries, {
        color: "#00BFFF",
        lineWidth: 2,
      });

    // =========================================
    // EMA 200
    // =========================================

    const ema200Series =
      chart.addSeries(LineSeries, {
        color: "#FF4040",
        lineWidth: 2,
      });

    // =========================================
    // VOLUME
    // =========================================

    const volumeSeries =
      chart.addSeries(HistogramSeries, {
        priceFormat: {
          type: "volume",
        },

        priceScaleId: "",

        color: "#4CAF50",
      });

    // Volume occupies the lower section
    chart
      .priceScale("")
      .applyOptions({
        scaleMargins: {
          top: 0.72,
          bottom: 0.16,
        },
      });

    // =========================================
    // RSI
    // =========================================

    const rsiSeries =
      chart.addSeries(LineSeries, {
        color: "#A855F7",
        lineWidth: 2,
        priceScaleId: "rsi",
      });

    chart
      .priceScale("rsi")
      .applyOptions({
        scaleMargins: {
          top: 0.82,
          bottom: 0.02,
        },

        minimumWidth: isMobile ? 52 : 70,
      });

    // =========================================
    // RSI 30
    // =========================================

    const rsi30Series =
      chart.addSeries(LineSeries, {
        color: "#EF4444",
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        priceScaleId: "rsi",
      });

    // =========================================
    // RSI 70
    // =========================================

    const rsi70Series =
      chart.addSeries(LineSeries, {
        color: "#22C55E",
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        priceScaleId: "rsi",
      });

    // =========================================
    // LOAD DATA
    // =========================================

    async function loadChart() {
      try {
        const response = await fetch(
          `/api/chart?symbol=${symbol}&ts=${Date.now()}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Chart API Failed");
        }

        const rawData = await response.json();

        if (!Array.isArray(rawData)) {
          throw new Error("Invalid chart data");
        }

        console.log(
          "First Candle:",
          rawData[0]
        );

        console.log(
          "Last Candle JSON:",
          JSON.stringify(
            rawData[rawData.length - 1],
            null,
            2
          )
        );

        // =====================================
        // CANDLE DATA
        // =====================================

        const chartData =
          rawData.map((candle: any) => ({
            time: candle.time as any,

            open: Number(candle.open),

            high: Number(candle.high),

            low: Number(candle.low),

            close: Number(candle.close),
          }));

        // =====================================
        // EMA 20
        // =====================================

        const ema20Data =
          rawData
            .filter(
              (candle: any) =>
                candle.ema20 != null
            )
            .map((candle: any) => ({
              time: candle.time as any,

              value: Number(candle.ema20),
            }));

        // =====================================
        // EMA 50
        // =====================================

        const ema50Data =
          rawData
            .filter(
              (candle: any) =>
                candle.ema50 != null
            )
            .map((candle: any) => ({
              time: candle.time as any,

              value: Number(candle.ema50),
            }));

        // =====================================
        // EMA 200
        // =====================================

        const ema200Data =
          rawData
            .filter(
              (candle: any) =>
                candle.ema200 != null
            )
            .map((candle: any) => ({
              time: candle.time as any,

              value: Number(candle.ema200),
            }));

        // =====================================
        // RSI
        // =====================================

        const rsiData =
          rawData
            .filter(
              (candle: any) =>
                candle.rsi != null
            )
            .map((candle: any) => ({
              time: candle.time as any,

              value: Number(candle.rsi),
            }));

        // =====================================
        // RSI 30
        // =====================================

        const rsi30Data =
          rsiData.map((point: any) => ({
            time: point.time,

            value: 30,
          }));

        // =====================================
        // RSI 70
        // =====================================

        const rsi70Data =
          rsiData.map((point: any) => ({
            time: point.time,

            value: 70,
          }));

        // =====================================
        // VOLUME
        // =====================================

        const volumeData =
          rawData.map((candle: any) => ({
            time: candle.time as any,

            value: Number(candle.volume),

            color:
              candle.close >= candle.open
                ? "#26a69a"
                : "#ef5350",
          }));

        // =====================================
        // SET DATA
        // =====================================

        candleSeries.setData(chartData);

        ema20Series.setData(ema20Data);

        ema50Series.setData(ema50Data);

        ema200Series.setData(ema200Data);

        volumeSeries.setData(volumeData);

        rsiSeries.setData(rsiData);

        rsi30Series.setData(rsi30Data);

        rsi70Series.setData(rsi70Data);

        // =====================================
        // FIT CONTENT
        // =====================================

        chart.timeScale().fitContent();

      } catch (error) {
        console.error(
          "Chart Load Error:",
          error
        );
      }
    }

    loadChart();

    // =========================================
    // RESPONSIVE RESIZE
    // =========================================

    const handleResize = () => {
      if (!chartContainerRef.current) {
        return;
      }

      const width =
        chartContainerRef.current.clientWidth;

      chart.applyOptions({
        width,

        height: getChartHeight(),
      });
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    // =========================================
    // CLEANUP
    // =========================================

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );

      chart.remove();
    };
  }, [symbol]);

  // ===========================================
  // RESPONSIVE CONTAINER
  // ===========================================

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,

        boxSizing: "border-box",

        overflow: "hidden",

        borderRadius: "12px",
      }}
    >
      <div
        ref={chartContainerRef}
        style={{
          width: "100%",

          maxWidth: "100%",

          minWidth: 0,

          height: "450px",

          boxSizing: "border-box",

          overflow: "hidden",

          borderRadius: "12px",
        }}
      />
    </div>
  );
}
"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  LineSeries,
} from "lightweight-charts";

type Props = {
  symbol: string;
};

export default function LiveChart({ symbol }: Props) {
  const chartContainerRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(
      chartContainerRef.current,
      {
        width: chartContainerRef.current.clientWidth,
        height: 500,

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
        },

        timeScale: {
          borderColor: "#475569",
        },
      }
    );

    // ===========================
    // Candlestick
    // ===========================

    const candleSeries =
      chart.addSeries(CandlestickSeries);

    // ===========================
    // EMA Lines
    // ===========================

    const ema20Series =
      chart.addSeries(LineSeries, {
        color: "#FFD700",
        lineWidth: 2,
      });

    const ema50Series =
      chart.addSeries(LineSeries, {
        color: "#00BFFF",
        lineWidth: 2,
      });

    const ema200Series =
      chart.addSeries(LineSeries, {
        color: "#FF4040",
        lineWidth: 2,
      });

    async function loadChart() {
      try {
        const response = await fetch(
          `/api/chart?symbol=${symbol}&ts=${Date.now()}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Chart API Failed"
          );
        }

        const rawData =
          await response.json();

        console.log(
          "First Candle:",
          rawData[0]
        );

        const last = rawData[rawData.length - 1];

console.log("EMA20 =", last.ema20);
console.log("EMA50 =", last.ema50);
console.log("EMA200 =", last.ema200);
console.log(last);

        const chartData = rawData.map(
          (candle: any) => ({
            time: candle.time as any,
            open: Number(candle.open),
            high: Number(candle.high),
            low: Number(candle.low),
            close: Number(candle.close),
          })
        );

        const ema20Data = rawData
          .filter(
            (candle: any) =>
              candle.ema20 != null
          )
          .map((candle: any) => ({
            time: candle.time as any,
            value: Number(
              candle.ema20
            ),
          }));

        const ema50Data = rawData
          .filter(
            (candle: any) =>
              candle.ema50 != null
          )
          .map((candle: any) => ({
            time: candle.time as any,
            value: Number(
              candle.ema50
            ),
          }));

        const ema200Data = rawData
          .filter(
            (candle: any) =>
              candle.ema200 != null
          )
          .map((candle: any) => ({
            time: candle.time as any,
            value: Number(
              candle.ema200
            ),
          }));

        candleSeries.setData(
          chartData
        );

        ema20Series.setData(
          ema20Data
        );

        ema50Series.setData(
          ema50Data
        );

        ema200Series.setData(
          ema200Data
        );
      } catch (error) {
        console.error(
          "Chart Load Error:",
          error
        );
      }
    }

    loadChart();

    const handleResize = () => {
      chart.applyOptions({
        width:
          chartContainerRef.current
            ?.clientWidth ?? 0,
      });
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );

      chart.remove();
    };
  }, [symbol]);

  return (
    <div
      ref={chartContainerRef}
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    />
  );
}
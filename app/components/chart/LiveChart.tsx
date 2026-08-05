"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
} from "lightweight-charts";

type Props = {
  symbol: string;
};

export default function LiveChart({
  symbol,
}: Props) {

  const chartContainerRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    if (!chartContainerRef.current) return;

    const chart = createChart(
      chartContainerRef.current,
      {
        width:
          chartContainerRef.current.clientWidth,

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

    const candleSeries =
      chart.addSeries(CandlestickSeries);

    async function loadChart() {

      try {

        const response =
          await fetch(
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

        const rawData = await response.json();

console.log("Chart Data:", rawData);

const chartData = rawData.map((candle: any) => ({
  time: candle.time as any,
  open: Number(candle.open),
  high: Number(candle.high),
  low: Number(candle.low),
  close: Number(candle.close),
}));

console.log("Chart Ready Data:", chartData);

candleSeries.setData(chartData);

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
          chartContainerRef.current?.clientWidth ?? 0,
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
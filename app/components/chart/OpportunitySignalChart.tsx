"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  CandlestickSeries,
  ColorType,
  LineStyle,
  createChart,
} from "lightweight-charts";
import {
  buildOpportunitySignalLevels,
} from "../../services/opportunitySignalLevelsService";

type Props = {
  symbol: string;

  decision:
    | "BUY"
    | "SELL";

  entry: number;

  stopLoss: number;

  target1: number;

  target2: number;
};

export default function OpportunitySignalChart({
  symbol,
  decision,
  entry,
  stopLoss,
  target1,
  target2,
}: Props) {
  const chartContainerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    if (
      !chartContainerRef.current
    ) {
      return;
    }
        const signalLevels =
      buildOpportunitySignalLevels(
        {
          decision,
          entry,
          stopLoss,
          target1,
          target2,
        }
      );

    const container =
      chartContainerRef.current;

    const isMobile =
      window.innerWidth <= 768;

    const chart =
      createChart(
        container,
        {
          width:
            container.clientWidth,

          height:
            isMobile
              ? 500
              : 440,

          layout: {
            background: {
              type:
                ColorType.Solid,

              color:
                "#0f172a",
            },

            textColor:
              "#f8fafc",
          },

          grid: {
            vertLines: {
              color:
                "#1e293b",
            },

            horzLines: {
              color:
                "#1e293b",
            },
          },

          crosshair: {
            mode:
              1,
          },

          rightPriceScale: {
            borderColor:
              "#475569",

            minimumWidth:
              isMobile
                ? 52
                : 70,

            scaleMargins: {
              top:
                0.08,

              bottom:
                0.08,
            },
          },

          timeScale: {
            borderColor:
              "#475569",

            barSpacing:
              isMobile
                ? 4
                : 7,

            minBarSpacing:
              isMobile
                ? 2
                : 3,

            rightOffset:
              4,

            rightBarStaysOnScroll:
              true,
          },
        }
      );

    const candleSeries =
      chart.addSeries(
        CandlestickSeries,
        {
          upColor:
            "#22c55e",

          downColor:
            "#ef4444",

          borderUpColor:
            "#22c55e",

          borderDownColor:
            "#ef4444",

          wickUpColor:
            "#22c55e",

          wickDownColor:
            "#ef4444",
        }
      );

    const createSignalPriceLine =
      (
        price: number,
        title: string,
        color: string,
        lineStyle:
          LineStyle
      ) => {
        if (
          !Number.isFinite(
            price
          ) ||
          price <= 0
        ) {
          return;
        }

        candleSeries.createPriceLine(
          {
            price,

            color,

            lineWidth:
              2,

            lineStyle,

            axisLabelVisible:
              true,

            title,
          }
        );
      };

    async function loadChart() {
      try {
        const response =
          await fetch(
            `/api/chart?symbol=${symbol}&ts=${Date.now()}`,
            {
              cache:
                "no-store",
            }
          );

        if (
          !response.ok
        ) {
          throw new Error(
            "Signal Chart API Failed"
          );
        }

        const rawData =
          await response.json();

        if (
          !Array.isArray(
            rawData
          )
        ) {
          throw new Error(
            "Invalid signal chart data"
          );
        }

        const chartData =
          rawData.map(
            (
              candle: any
            ) => ({
              time:
                candle.time as any,

              open:
                Number(
                  candle.open
                ),

              high:
                Number(
                  candle.high
                ),

              low:
                Number(
                  candle.low
                ),

              close:
                Number(
                  candle.close
                ),
            })
          );

        candleSeries.setData(
          chartData
        );

                createSignalPriceLine(
          signalLevels.entry,
          "ENTRY",
          "#38bdf8",
          LineStyle.Solid
        );

        createSignalPriceLine(
          signalLevels.stopLoss,
          "SL",
          "#ef4444",
          LineStyle.Dashed
        );

        createSignalPriceLine(
          signalLevels.target1,
          "T1",
          "#22c55e",
          LineStyle.Dashed
        );

        createSignalPriceLine(
          signalLevels.target2,
          "T2",
          "#84cc16",
          LineStyle.Dashed
        );

        chart
          .timeScale()
          .fitContent();
      } catch (
        error
      ) {
        console.error(
          "Opportunity Signal Chart Error:",
          error
        );
      }
    }

    loadChart();

    const handleResize =
      () => {
        if (
          !chartContainerRef.current
        ) {
          return;
        }

        chart.applyOptions(
          {
            width:
              chartContainerRef.current
                .clientWidth,

            height:
              window.innerWidth <=
              768
                ? 500
                : 440,
          }
        );
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
  }, [
    symbol,
    entry,
    stopLoss,
    target1,
    target2,
  ]);

  const decisionColor =
    decision === "BUY"
      ? "#22c55e"
      : "#ef4444";

  return (
    <div
      style={{
        width:
          "100%",

        maxWidth:
          "100%",

        minWidth:
          0,

        boxSizing:
          "border-box",

        background:
          "#0f172a",

        border:
          "1px solid #334155",

        borderRadius:
          "14px",

        overflow:
          "hidden",
      }}
    >
      <div
        style={{
          display:
            "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          gap:
            "12px",

          padding:
            "14px 16px",

          borderBottom:
            "1px solid #334155",
        }}
      >
        <div>
          <div
            style={{
              fontSize:
                "16px",

              fontWeight:
                700,

              color:
                "#f8fafc",
            }}
          >
            {symbol}
          </div>

          <div
            style={{
              marginTop:
                "3px",

              fontSize:
                "12px",

              color:
                "#94a3b8",
            }}
          >
            ITDP Signal Chart
          </div>
        </div>

        <div
          style={{
            fontSize:
              "14px",

            fontWeight:
              700,

            color:
              decisionColor,
          }}
        >
          {decision}
        </div>
      </div>

      <div
        ref={
          chartContainerRef
        }
        style={{
          width:
            "100%",

          height:
            "440px",

          minWidth:
            0,

          boxSizing:
            "border-box",
        }}
      />
    </div>
  );
}
import LiveChart from "./chart/LiveChart";

type ChartSectionProps = {
  symbol: string;
};

export default function ChartSection({
  symbol,
}: ChartSectionProps) {
  const displaySymbol =
    symbol.trim().toUpperCase();

  return (
    <section className="itdp-chart-card">
      <div className="itdp-chart-header">
        <div>
          <div className="itdp-chart-symbol">
            {displaySymbol}
          </div>

          <div className="itdp-chart-market">
            NSE
          </div>
        </div>

        <div className="itdp-chart-legend">
  <span className="itdp-chart-legend-item">
    <span className="itdp-ema-dot itdp-ema20-dot" />
    EMA 20
  </span>

  <span className="itdp-chart-legend-item">
    <span className="itdp-ema-dot itdp-ema50-dot" />
    EMA 50
  </span>

  <span className="itdp-chart-legend-item">
    <span className="itdp-ema-dot itdp-ema200-dot" />
    EMA 200
  </span>
</div>
      </div>

      <div className="itdp-chart-container">
        <LiveChart symbol={symbol} />
      </div>
    </section>
  );
}
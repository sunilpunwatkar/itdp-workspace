import type {
  StockMetadata,
} from "../services/stockMetadataService";

import LiveChart from "./chart/LiveChart";

type ChartSectionProps = {
  symbol: string;
  resolvedSymbol?: string;
  metadata?: StockMetadata;
};

export default function ChartSection({
  symbol,
  resolvedSymbol,
  metadata,
}: ChartSectionProps) {
  const inputSymbol =
    symbol.trim().toUpperCase();

  const displaySymbol =
    resolvedSymbol
      ?.trim()
      .toUpperCase() ||
    inputSymbol;

  const metadataMatches =
    metadata?.symbol
      .trim()
      .toUpperCase() ===
    displaySymbol;

  const marketLabel =
    metadataMatches
      ? [
          metadata.exchange,
          metadata.companyName,
        ]
          .filter(Boolean)
          .join(" · ")
      : "";

  return (
    <section className="itdp-chart-card">
      <div className="itdp-chart-header">
        <div>
          <div className="itdp-chart-symbol">
            {displaySymbol}
          </div>

          {marketLabel && (
            <div className="itdp-chart-market">
              {marketLabel}
            </div>
          )}
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
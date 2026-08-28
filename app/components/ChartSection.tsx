import LiveChart from "./chart/LiveChart";

type ChartSectionProps = {
  symbol: string;
};

export default function ChartSection({
  symbol,
}: ChartSectionProps) {
  return (
    <div className="itdp-chart-container">
      <LiveChart symbol={symbol} />
    </div>
  );
}
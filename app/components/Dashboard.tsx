import DecisionCard from "./DecisionCard";
import LiveChart from "./chart/LiveChart";

type DashboardProps = {
  analysis: {
    symbol: string;
    decision: string;
    confidence: number;
    risk: string;
    target: number;
    stopLoss: number;
    reasons: string[];
    invalidIf: string;
  };
};

export default function Dashboard({
  analysis,
}: DashboardProps) {
  const signalColor =
    analysis.decision === "BUY"
      ? "#22c55e"
      : analysis.decision === "SELL"
      ? "#ef4444"
      : "#f59e0b";

  const cards = [
    {
      id: 1,
      title: "NIFTY 50",
      value: "25,120",
      color: "#22c55e",
    },
    {
      id: 2,
      title: "SENSEX",
      value: "82,430",
      color: "#3b82f6",
    },
    {
      id: 3,
      title: "BANK NIFTY",
      value: "56,720",
      color: "#f59e0b",
    },
    {
      id: 4,
      title: "AI SIGNAL",
      value: analysis.decision,
      color: signalColor,
    },
  ];

  return (
    <main className="itdp-dashboard">

      {/* ==============================
          TITLE
      ============================== */}

      <div className="itdp-dashboard-title">
        <h1>📊 ITDP Decision Workspace</h1>

        <p>
          India's Trading Decision Platform
        </p>
      </div>

      {/* ==============================
          MARKET CARDS
      ============================== */}

      <div className="itdp-market-cards">
        {cards.map((card) => (
          <div
            key={card.id}
            className="itdp-market-card"
          >
            <div className="itdp-market-card-title">
              {card.title}
            </div>

            <div
              className="itdp-market-card-value"
              style={{
                color: card.color,
              }}
            >
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* ==============================
          LIVE CHART
      ============================== */}

      <div className="itdp-chart-container">
        <LiveChart
          symbol={analysis.symbol}
        />
      </div>

      {/* ==============================
          AI DECISION
      ============================== */}

      <div className="itdp-decision-container">
        <DecisionCard
          key={analysis.symbol}
          symbol={analysis.symbol}
          decision={analysis.decision}
          confidence={analysis.confidence}
          risk={analysis.risk}
          target={analysis.target}
          stopLoss={analysis.stopLoss}
          reasons={analysis.reasons}
          invalidIf={analysis.invalidIf}
        />
      </div>

    </main>
  );
}
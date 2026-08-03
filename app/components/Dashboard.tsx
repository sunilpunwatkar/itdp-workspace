import DecisionCard from "./DecisionCard";

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
      title: "NIFTY 50",
      value: "25,120",
      color: "#22c55e",
    },
    {
      title: "SENSEX",
      value: "82,430",
      color: "#3b82f6",
    },
    {
      title: "BANK NIFTY",
      value: "56,720",
      color: "#f59e0b",
    },
    {
      title: "AI SIGNAL",
      value: analysis.decision,
      color: signalColor,
    },
  ];

  return (
    <main style={{ color: "white" }}>

      <div
        style={{
          marginBottom: "25px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "32px",
          }}
        >
          📊 ITDP Decision Workspace
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginTop: "8px",
          }}
        >
          India's Trading Decision Platform
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "14px",
              padding: "22px",
              transition: "0.3s",
            }}
          >
            <div
              style={{
                color: "#94a3b8",
                fontSize: "14px",
              }}
            >
              {card.title}
            </div>

            <h2
              style={{
                color: card.color,
                marginTop: "12px",
                marginBottom: 0,
                fontSize: "28px",
              }}
            >
              {card.value}
            </h2>
          </div>
        ))}
      </div>

      <DecisionCard
        symbol={analysis.symbol}
        decision={analysis.decision}
        confidence={analysis.confidence}
        risk={analysis.risk}
        target={analysis.target}
        stopLoss={analysis.stopLoss}
        reasons={analysis.reasons}
        invalidIf={analysis.invalidIf}
      />

    </main>
  );
}
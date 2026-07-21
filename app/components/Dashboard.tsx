import DecisionCard from "./DecisionCard";

export default function Dashboard() {
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
      value: "BUY",
      color: "#ef4444",
    },
  ];

  return (
    <main
      style={{
        color: "white",
      }}
    >
      <h1 style={{ marginTop: 0 }}>
        📊 ITDP Decision Workspace
      </h1>

      <p style={{ color: "#94a3b8" }}>
        India's Trading Decision Platform
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "25px",
        }}
      >
        <input
          type="text"
          placeholder="Enter Stock Symbol (Example: RELIANCE)"
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #334155",
            background: "#1e293b",
            color: "white",
            fontSize: "16px",
          }}
        />

        <button
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "14px 25px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Analyze
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <div
              style={{
                color: "#94a3b8",
              }}
            >
              {card.title}
            </div>

            <h2
              style={{
                color: card.color,
                marginBottom: 0,
              }}
            >
              {card.value}
            </h2>
          </div>
        ))}
      </div>

      <DecisionCard />
    </main>
  );
}
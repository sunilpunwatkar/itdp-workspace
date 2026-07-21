export default function StockAnalysis() {
  return (
    <div
      style={{
        color: "white",
      }}
    >
      <h2>📈 Stock Analysis</h2>

      <p>Analyze any stock using the ITDP Decision Engine.</p>

      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Enter Stock Symbol (Example: RELIANCE)"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #334155",
            background: "#111827",
            color: "white",
            fontSize: "16px",
          }}
        />

        <button
          style={{
            marginTop: "20px",
            padding: "12px 25px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Analyze Stock
        </button>
      </div>
    </div>
  );
}
type AnalysisProps = {
  analysis: any;
};

export default function AnalysisCard({ analysis }: AnalysisProps) {
  return (
    <div
      style={{
        marginTop: "25px",
        padding: "24px",
        background: "#0f172a",
        borderRadius: "12px",
        border: "1px solid #334155",
      }}
    >
      <h2 style={{ marginBottom: "15px" }}>
        {analysis.symbol}
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <div style={{ color: "#94a3b8", fontSize: "14px" }}>
            Current Price
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            ₹ {analysis.entry.toFixed(2)}
          </div>
        </div>

        <div
          style={{
            background:
              analysis.decision === "BUY"
                ? "#15803d"
                : analysis.decision === "SELL"
                ? "#b91c1c"
                : "#ca8a04",

            color: "white",

            padding: "12px 20px",

            borderRadius: "10px",

            fontWeight: "bold",

            height: "fit-content",
          }}
        >
          {analysis.decision}
        </div>
      </div>

      <hr />

      <p>
        <strong>Confidence :</strong> {analysis.confidence}%
      </p>

      <p>
        <strong>Risk :</strong> {analysis.risk}
      </p>

      <div
  style={{
    display: "flex",
    gap: "20px",
    marginTop: "20px",
    marginBottom: "20px",
    flexWrap: "wrap",
  }}
>
  <div
    style={{
      flex: 1,
      background: "#1e293b",
      padding: "18px",
      borderRadius: "10px",
      textAlign: "center",
      minWidth: "180px",
    }}
  >
    <div style={{ color: "#94a3b8" }}>ENTRY</div>

    <div
      style={{
        fontSize: "24px",
        fontWeight: "bold",
        color: "#38bdf8",
      }}
    >
      ₹ {analysis.entry.toFixed(2)}
    </div>
  </div>

  <div
    style={{
      flex: 1,
      background: "#1e293b",
      padding: "18px",
      borderRadius: "10px",
      textAlign: "center",
      minWidth: "180px",
    }}
  >
    <div style={{ color: "#94a3b8" }}>TARGET</div>

    <div
      style={{
        fontSize: "24px",
        fontWeight: "bold",
        color: "#22c55e",
      }}
    >
      ₹ {analysis.target.toFixed(2)}
    </div>
  </div>

  <div
    style={{
      flex: 1,
      background: "#1e293b",
      padding: "18px",
      borderRadius: "10px",
      textAlign: "center",
      minWidth: "180px",
    }}
  >
    <div style={{ color: "#94a3b8" }}>STOP LOSS</div>

    <div
      style={{
        fontSize: "24px",
        fontWeight: "bold",
        color: "#ef4444",
      }}
    >
      ₹ {analysis.stopLoss.toFixed(2)}
    </div>
  </div>
</div>

      <h3>Reasons</h3>

      <ul>
        {analysis.reasons.map((reason: string, index: number) => (
          <li key={index}>✅ {reason}</li>
        ))}
      </ul>

      <p>
        <strong>Invalid If :</strong> {analysis.invalidIf}
      </p>
    </div>
  );
}
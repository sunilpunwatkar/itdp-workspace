type DecisionCardProps = {
  symbol: string;
  decision: string;
  confidence: number;
  risk: string;
  target: number;
  stopLoss: number;
 reasons: string[];
  invalidIf: string;
};

export default function DecisionCard({
  symbol,
  decision,
  confidence,
  risk,
  target,
  stopLoss,
  reasons,
  invalidIf,
}: DecisionCardProps) {
  return (
    <div
      style={{
        background: "#1e293b",
        border: "1px solid #334155",
        borderRadius: "12px",
        padding: "24px",
        marginTop: "25px",
        color: "white",
      }}
    >
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  }}
>
  <div>
    <h2
      style={{
        margin: 0,
        fontSize: "24px",
      }}
    >
      🤖 AI Decision Engine
    </h2>

    <p
      style={{
        color: "#94a3b8",
        marginTop: "6px",
        marginBottom: 0,
      }}
    >
      Smart Technical Analysis Report
    </p>
  </div>

  <div
    style={{
      background: "#0f172a",
      border: "1px solid #334155",
      borderRadius: "10px",
      padding: "12px 18px",
      textAlign: "center",
    }}
  >
    <div
      style={{
        fontSize: "12px",
        color: "#94a3b8",
      }}
    >
      SYMBOL
    </div>

    <div
      style={{
        fontSize: "18px",
        fontWeight: "bold",
      }}
    >
      {symbol}
    </div>
  </div>
</div>

      <table
        style={{
          width: "100%",
          borderSpacing: "0 14px",
        }}
      >
        <tbody>
          <tr>
            <td><strong>Stock</strong></td>
            <td>{symbol}</td>
          </tr>

          <tr>
  <td>
    <strong>Decision</strong>
  </td>

  <td>
    <span
      style={{
        display: "inline-block",
        padding: "8px 18px",
        borderRadius: "25px",
        fontWeight: "bold",
        fontSize: "14px",

        color: "#ffffff",

        background:
          decision === "BUY"
            ? "#16a34a"
            : decision === "SELL"
            ? "#dc2626"
            : "#d97706",
      }}
    >
      {decision}
    </span>
  </td>
</tr>

          <tr>
  <td>
    <strong>Confidence</strong>
  </td>

  <td style={{ width: "70%" }}>
    <div
      style={{
        background: "#334155",
        height: "10px",
        borderRadius: "10px",
        overflow: "hidden",
        marginBottom: "6px",
      }}
    >
      <div
        style={{
          width: `${confidence}%`,
          height: "100%",
          background:
            confidence >= 80
              ? "#22c55e"
              : confidence >= 60
              ? "#f59e0b"
              : "#ef4444",
          transition: "0.5s",
        }}
      />
    </div>

    <span>{confidence}%</span>
  </td>
</tr>

          <tr>
            <td><strong>Risk</strong></td>
            <td>{risk}</td>
          </tr>

          <tr>
            <td><strong>Target</strong></td>
            <td>₹{target}</td>
          </tr>

          <tr>
            <td><strong>Stop Loss</strong></td>
            <td>₹{stopLoss}</td>
          </tr>
        </tbody>
      </table>

      <hr
        style={{
          border: "1px solid #334155",
          margin: "20px 0",
        }}
      />

      <h3>AI Explanation</h3>

      <ul>
        {reasons.map((item) => (
          <li key={item}>✅ {item}</li>
        ))}
      </ul>

      <h3>Invalid If</h3>

      <ul>
        <li>❌ {invalidIf}</li>
      </ul>
    </div>
  );
}
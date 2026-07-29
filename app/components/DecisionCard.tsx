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
      <h2 style={{ marginTop: 0 }}>🤖 AI Decision Engine</h2>

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
            <td><strong>Decision</strong></td>
            <td
              style={{
                color:
                  decision === "BUY"
                    ? "#22c55e"
                    : decision === "SELL"
                    ? "#ef4444"
                    : "#f59e0b",
              }}
            >
              {decision}
            </td>
          </tr>

          <tr>
            <td><strong>Confidence</strong></td>
            <td>{confidence}%</td>
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
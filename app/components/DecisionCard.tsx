export default function DecisionCard() {
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
            <td><strong>Decision</strong></td>
            <td style={{ color: "#22c55e" }}>BUY ✅</td>
          </tr>

          <tr>
            <td><strong>Confidence</strong></td>
            <td>91%</td>
          </tr>

          <tr>
            <td><strong>Risk</strong></td>
            <td style={{ color: "#f59e0b" }}>LOW</td>
          </tr>

          <tr>
            <td><strong>Target</strong></td>
            <td>₹3250</td>
          </tr>

          <tr>
            <td><strong>Stop Loss</strong></td>
            <td>₹2980</td>
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
        <li>✅ Breakout Confirmed</li>
        <li>✅ RSI above 60</li>
        <li>✅ Strong Volume</li>
      </ul>

      <h3>Invalid If</h3>

      <ul>
        <li>❌ Price closes below ₹2980</li>
      </ul>
    </div>
  );
}
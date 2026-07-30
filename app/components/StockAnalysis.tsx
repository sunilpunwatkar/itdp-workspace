"use client";

import { useState } from "react";

export default function StockAnalysis() {
  const [symbol, setSymbol] = useState("RELIANCE");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/history?symbol=${symbol.toUpperCase()}`
      );

      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch analysis");
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        color: "white",
        background: "#1e293b",
        padding: "20px",
        borderRadius: "12px",
      }}
    >
      <h2>📈 Stock Analysis</h2>

      <div style={{ marginTop: "20px" }}>
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter Symbol"
          style={{
            padding: "10px",
            width: "220px",
            marginRight: "10px",
          }}
        />

        <button onClick={analyze}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: "25px", lineHeight: "2" }}>
          <h3>{result.symbol}</h3>

          <p>
            <strong>Decision:</strong> {result.decision}
          </p>

          <p>
            <strong>Confidence:</strong> {result.confidence}%
          </p>

          <p>
            <strong>Risk:</strong> {result.risk}
          </p>

          <p>
            <strong>Entry:</strong> ₹{result.entry}
          </p>

          <p>
            <strong>Target:</strong> ₹{result.target}
          </p>

          <p>
            <strong>Stop Loss:</strong> ₹{result.stopLoss}
          </p>

          <p>
            <strong>Reasons:</strong>
          </p>

          <ul>
            {result.reasons.map((reason: string, index: number) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>

          <p>
            <strong>Invalid If:</strong> {result.invalidIf}
          </p>
        </div>
      )}
    </div>
  );
}
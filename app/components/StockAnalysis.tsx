"use client";

import { useState } from "react";
import { getStockAnalysis } from "./services/stockService";
import AnalysisCard from "./AnalysisCard";

export default function StockAnalysis() {
  const [symbol, setSymbol] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  async function handleAnalyze() {
    const data = await getStockAnalysis(symbol.toUpperCase());
    setAnalysis(data);
  }

  return (
    <div style={{ color: "white" }}>
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
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Enter Stock Symbol (Example: RELIANCE)"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #334155",
            background: "#0f172a",
            color: "white",
            marginBottom: "15px",
          }}
        />

        <button
          onClick={handleAnalyze}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 25px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Analyze
        </button>

{analysis && <AnalysisCard analysis={analysis} />}
      </div>
    </div>
  );
}
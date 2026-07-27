"use client";

import { useState } from "react";
import { getStockQuote } from "./services/stockService";

export default function StockAnalysis() {
  const [symbol, setSymbol] = useState("");
  const [quote, setQuote] = useState<any>(null);

  async function handleAnalyze() {
    const data = await getStockQuote(symbol || "RELIANCE");
    setQuote(data);
  }

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
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
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

        {quote && (
          <div
            style={{
              marginTop: "25px",
              padding: "20px",
              background: "#0f172a",
              borderRadius: "10px",
              border: "1px solid #334155",
            }}
          >
            <h3>{quote.companyName}</h3>

            <p>
              <strong>Symbol :</strong> {quote.symbol}
            </p>

            <p>
              <strong>Price :</strong> ₹ {quote.price}
            </p>

            <p>
              <strong>Change :</strong> {quote.change}
            </p>

            <p>
              <strong>Change % :</strong> {quote.changePercent}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
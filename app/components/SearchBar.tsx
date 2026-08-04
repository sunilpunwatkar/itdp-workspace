"use client";

import { useEffect, useState } from "react";

type SearchBarProps = {
  symbol: string;
  onSymbolChange: (value: string) => void;
  onAnalyze: (symbol: string) => void;
};

export default function SearchBar({
  symbol,
  onSymbolChange,
  onAnalyze,
}: SearchBarProps) {
  const [localSymbol, setLocalSymbol] = useState(symbol);

  useEffect(() => {
    setLocalSymbol(symbol);
  }, [symbol]);

  function handleInput(value: string) {
    setLocalSymbol(value);
    onSymbolChange(value);
  }

  function handleAnalyzeClick() {
    const finalSymbol = localSymbol.trim().toUpperCase();

    if (!finalSymbol) return;

    onAnalyze(finalSymbol);
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        alignItems: "center",
        marginBottom: "25px",
      }}
    >
      <input
        type="text"
        value={localSymbol}
        onChange={(e) => handleInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAnalyzeClick();
          }
        }}
        placeholder="Enter Stock Symbol (Example: RELIANCE)"
        autoComplete="off"
        spellCheck={false}
        style={{
          flex: 1,
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #334155",
          background: "#1e293b",
          color: "white",
          fontSize: "16px",
          outline: "none",
        }}
      />

      <button
        onClick={handleAnalyzeClick}
        style={{
          padding: "12px 25px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        Analyze
      </button>
    </div>
  );
}
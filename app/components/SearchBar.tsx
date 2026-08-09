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
      className="itdp-search-bar"
      style={{
        display: "flex",
        gap: "15px",
        alignItems: "center",
        marginBottom: "25px",
        width: "100%",
        boxSizing: "border-box",
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
          minWidth: 0,
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #334155",
          background: "#1e293b",
          color: "white",
          fontSize: "16px",
          outline: "none",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={handleAnalyzeClick}
        style={{
          flexShrink: 0,
          padding: "12px 25px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
          whiteSpace: "nowrap",
        }}
      >
        Analyze
      </button>
    </div>
  );
}
"use client";

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
        value={symbol}
        onChange={(e) => onSymbolChange(e.target.value)}
        placeholder="Enter Stock Symbol (Example: RELIANCE)"
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
  onClick={() => onAnalyze(symbol)}
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
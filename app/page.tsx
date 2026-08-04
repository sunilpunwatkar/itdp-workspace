"use client";

import { useState, useEffect } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import MarketNews from "./components/MarketNews";
import StockAnalysis from "./components/StockAnalysis";
import SearchBar from "./components/SearchBar";

export default function Home() {
  const [activePage, setActivePage] = useState("dashboard");

  const [symbol, setSymbol] = useState("RELIANCE");

  const [analysis, setAnalysis] = useState<any>(null);

  async function handleAnalyze(inputSymbol: string) {
    console.log("Current Symbol:", inputSymbol);
    try {
      const response = await fetch(
  `/api/analysis?symbol=${inputSymbol}`
);

      if (!response.ok) {
        throw new Error("Failed to fetch analysis");
      }

      const data = await response.json();

      setAnalysis(data);
    } catch (error) {
      console.error("Analysis Error:", error);
    }
  }

  useEffect(() => {
  handleAnalyze(symbol);
}, []);

  return (
    <>
      <Header />

      <div
        style={{
          display: "flex",
          minHeight: "calc(100vh - 70px)",
        }}
      >
        <Sidebar onMenuClick={setActivePage} />

        <div
          style={{
            flex: 1,
            background: "#0f172a",
            padding: "25px",
          }}
        >
          {activePage === "dashboard" && (
            <>
              <SearchBar
                symbol={symbol}
                onSymbolChange={setSymbol}
                onAnalyze={handleAnalyze}
              />

              {analysis && (
                <Dashboard analysis={analysis} />
              )}
            </>
          )}

          {activePage === "marketnews" && <MarketNews />}

          {activePage === "stock" && <StockAnalysis />}
        </div>
      </div>
    </>
  );
}
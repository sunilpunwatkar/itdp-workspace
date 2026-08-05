"use client";

import { useState, useEffect, useCallback } from "react";

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

  const [loading, setLoading] = useState(false);

  const handleAnalyze = useCallback(
    async (inputSymbol: string) => {
      try {
        const finalSymbol = inputSymbol.trim().toUpperCase();

        setLoading(true);

        console.log("Analyzing :", finalSymbol);

        const response = await fetch(
          `/api/analysis?symbol=${finalSymbol}&ts=${Date.now()}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch analysis");
        }

        const data = await response.json();

        console.log("Analysis :", data);

        setAnalysis(data);
      } catch (error) {
        console.error("Analysis Error :", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    handleAnalyze(symbol);
  }, [handleAnalyze]);

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

              {loading && (
                <p
                  style={{
                    color: "#94a3b8",
                    marginBottom: "20px",
                  }}
                >
                  Analyzing...
                </p>
              )}

              {analysis && (
  <Dashboard
    key={`${analysis.symbol}-${Date.now()}`}
    analysis={analysis}
  />
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
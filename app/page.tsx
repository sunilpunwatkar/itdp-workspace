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

  /* =====================================
     MOBILE SIDEBAR STATE
  ===================================== */

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleAnalyze = useCallback(
    async (inputSymbol: string) => {
      try {
        const finalSymbol =
          inputSymbol.trim().toUpperCase();

        setLoading(true);

        console.log(
          "Analyzing :",
          finalSymbol
        );

        const response = await fetch(
          `/api/analysis?symbol=${finalSymbol}&ts=${Date.now()}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch analysis"
          );
        }

        const data =
          await response.json();

        console.log(
          "Analysis :",
          data
        );

        setAnalysis(data);
      } catch (error) {
        console.error(
          "Analysis Error :",
          error
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
  handleAnalyze(symbol);
}, [handleAnalyze, symbol]);

  return (
    <>
      {/* =====================================
          HEADER
      ===================================== */}

      <Header
        mobileOpen={mobileOpen}
        onMenuToggle={() =>
          setMobileOpen((prev) => !prev)
        }
      />

      <div className="itdp-app-layout">

        {/* =====================================
            SIDEBAR
        ===================================== */}

        <Sidebar
          onMenuClick={setActivePage}
          analysis={analysis}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        {/* =====================================
            MAIN CONTENT
        ===================================== */}

        <div className="itdp-main-content">

          {activePage === "dashboard" && (
            <>
              {/* ==========================
                  SEARCH / ANALYZE
              ========================== */}

              <div className="itdp-search-wrapper">
                <SearchBar
                  symbol={symbol}
                  onSymbolChange={setSymbol}
                  onAnalyze={handleAnalyze}
                />
              </div>

              {/* ==========================
                  LOADING
              ========================== */}

              {loading && (
                <p className="itdp-loading">
                  Analyzing...
                </p>
              )}

              {/* ==========================
                  DASHBOARD
              ========================== */}

              {analysis && (
                <Dashboard
                  key={analysis.symbol}
                  analysis={analysis}
                />
              )}
            </>
          )}

          {activePage === "marketnews" && (
            <MarketNews />
          )}

          {activePage === "stock" && (
            <StockAnalysis />
          )}

        </div>
      </div>
    </>
  );
}
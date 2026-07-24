"use client";

import { useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import MarketNews from "./components/MarketNews";
import StockAnalysis from "./components/StockAnalysis";
import SearchBar from "./components/SearchBar";

import { analyzeStock } from "./utils/analyzeStock";

export default function Home() {
  const [activePage, setActivePage] = useState("dashboard");

  const [symbol, setSymbol] = useState("RELIANCE");

  const [analysis, setAnalysis] = useState(
    analyzeStock("RELIANCE")
  );

  function handleAnalyze() {
    setAnalysis(analyzeStock(symbol));
  }

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

              <Dashboard analysis={analysis} />
            </>
          )}

          {activePage === "marketnews" && <MarketNews />}

          {activePage === "stock" && <StockAnalysis />}
        </div>
      </div>
    </>
  );
}
"use client";

import { useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Dashboard from "./components/Dashboard";
import MarketNews from "./components/MarketNews";
import StockAnalysis from "./components/StockAnalysis";

export default function Home() {
  const [activePage, setActivePage] = useState("dashboard");

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
          {activePage === "dashboard" && <Dashboard />}

          {activePage === "marketnews" && <MarketNews />}

          {activePage === "stock" && <StockAnalysis />}
        </div>
      </div>
    </>
  );
}
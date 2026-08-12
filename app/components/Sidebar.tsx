"use client";

import { useState } from "react";

type SidebarProps = {
  onMenuClick: (page: string) => void;
  analysis: {
    symbol: string;
    decision: string;
    confidence: number;
    risk: string;
  } | null;
};

export default function Sidebar({
  onMenuClick,
  analysis,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    {
      name: "🏠 Dashboard",
      page: "dashboard",
    },
    {
      name: "📈 Stock Analysis",
      page: "stock",
    },
    {
      name: "📰 Market News",
      page: "marketnews",
    },
    {
      name: "🤖 AI Decision Engine",
      page: "ai-engine",
    },
    {
      name: "💼 Portfolio",
      page: "portfolio",
    },
    {
      name: "📊 Analytics",
      page: "analytics",
    },
    {
      name: "⚙️ Settings",
      page: "settings",
    },
  ];

  const handleMenuClick = (page: string) => {
    onMenuClick(page);
    setMobileOpen(false);
  };

  return (
    <>
      {/* =====================================
          MOBILE MENU BUTTON
      ===================================== */}

      <button
        type="button"
        className="itdp-mobile-menu-button"
        onClick={() => setMobileOpen((prev) => !prev)}
        aria-label={
          mobileOpen
            ? "Close navigation menu"
            : "Open navigation menu"
        }
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* =====================================
          MOBILE OVERLAY
      ===================================== */}

      {mobileOpen && (
        <div
          className="itdp-sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside
        className={`itdp-sidebar ${
          mobileOpen ? "itdp-sidebar-open" : ""
        }`}
      >
        {/* Sidebar Heading */}

        <h3
          style={{
            marginTop: 0,
            marginBottom: "25px",
            color: "white",
          }}
        >
          Dashboard
        </h3>

        {/* Menu Items */}

        {menuItems.map((item) => (
          <button
            type="button"
            key={item.page}
            onClick={() =>
              handleMenuClick(item.page)
            }
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              background: "#1e293b",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "14px",
              transition: "0.2s",
              boxSizing: "border-box",
            }}
          >
            {item.name}
          </button>
        ))}

        {/* =====================================
            QUICK AI DECISION
        ===================================== */}

        {analysis && (
          <div
            style={{
              marginTop: "18px",
              padding: "14px",
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "10px",
              color: "white",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                marginBottom: "8px",
              }}
            >
              🤖 QUICK AI DECISION
            </div>

            <div
              style={{
                fontSize: "15px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              {analysis.symbol}
            </div>

            <div
              style={{
                fontSize: "20px",
                fontWeight: "700",
                marginBottom: "8px",
                color:
                  analysis.decision === "BUY"
                    ? "#22c55e"
                    : analysis.decision === "SELL"
                    ? "#ef4444"
                    : "#f59e0b",
              }}
            >
              {analysis.decision}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#cbd5e1",
                lineHeight: "1.7",
              }}
            >
              Confidence: {analysis.confidence}%
              <br />
              Risk: {analysis.risk}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
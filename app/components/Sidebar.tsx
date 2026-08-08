"use client";

import { useState } from "react";

type SidebarProps = {
  onMenuClick: (page: string) => void;
};

export default function Sidebar({
  onMenuClick,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const menuItems = [
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

  const handleMenuClick = (
    page: string
  ) => {
    onMenuClick(page);
    setMobileOpen(false);
  };

  return (
    <>
      {/* =========================
          MOBILE MENU BUTTON
      ========================= */}

      <button
        className="itdp-mobile-menu-button"
        onClick={() =>
          setMobileOpen(!mobileOpen)
        }
        aria-label="Open navigation menu"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={`itdp-sidebar ${
          mobileOpen
            ? "itdp-sidebar-open"
            : ""
        }`}
      >
        <h3
          style={{
            marginBottom: "25px",
          }}
        >
          Dashboard
        </h3>

        {menuItems.map((item) => (
          <div
            key={item.page}
            onClick={() =>
              handleMenuClick(item.page)
            }
            style={{
              padding: "12px",
              marginBottom: "10px",
              background: "#1e293b",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            {item.name}
          </div>
        ))}
      </aside>
    </>
  );
}
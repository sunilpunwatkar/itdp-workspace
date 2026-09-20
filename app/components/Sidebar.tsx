"use client";

import {
  useEffect,
  useState,
} from "react";

// =====================================================
// MARKET INDEX TYPES
// =====================================================

type MarketIndex = {
  name: string;
  symbol: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
};

type MarketIndicesResponse = {
  indices: MarketIndex[];
  updatedAt: string;
};

// =====================================================
// SIDEBAR PROPS
// =====================================================

type SidebarProps = {
  onMenuClick: (page: string) => void;
  mobileOpen: boolean;
  onClose: () => void;
};

// =====================================================
// SIDEBAR
// =====================================================

export default function Sidebar({
  onMenuClick,
  mobileOpen,
  onClose,
}: SidebarProps) {
  const [marketIndices, setMarketIndices] =
    useState<MarketIndex[]>([]);

  const [marketUpdatedAt, setMarketUpdatedAt] =
    useState<string | null>(null);

  // ===================================================
  // MENU ITEMS
  // ===================================================

  const menuItems = [
    {
      name: "Dashboard",
      page: "dashboard",
    },
    {
      name: "Stock Analysis",
      page: "stock",
    },
    {
      name: "Opportunities",
      page: "opportunities",
    },
    {
      name: "Market News",
      page: "marketnews",
    },
    {
      name: "AI Decision Engine",
      page: "ai-engine",
    },
    {
      name: "Portfolio",
      page: "portfolio",
    },
    {
      name: "Analytics",
      page: "analytics",
    },
    {
      name: "Settings",
      page: "settings",
    },
  ];

  // ===================================================
  // MARKET INDICES FETCH
  // ===================================================

  useEffect(() => {
    let cancelled = false;

    async function loadMarketIndices() {
      try {
        const response = await fetch(
          "/api/market-indices",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch market indices"
          );
        }

        const data =
          (await response.json()) as MarketIndicesResponse;

        if (cancelled) {
          return;
        }

        setMarketIndices(data.indices);
        setMarketUpdatedAt(
          data.updatedAt
        );
      } catch (error) {
        console.error(
          "Market Indices Error:",
          error
        );
      }
    }

    loadMarketIndices();

    return () => {
      cancelled = true;
    };
  }, []);

  // ===================================================
  // MENU CLICK
  // ===================================================

  const handleMenuClick = (
    page: string
  ) => {
    onMenuClick(page);
    onClose();
  };

  // ===================================================
  // FORMAT INDEX VALUE
  // ===================================================

  const formatIndexValue = (
    value: number
  ) => {
    return value.toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // ===================================================
  // FORMAT CHANGE
  // ===================================================

  const formatChange = (
    value: number
  ) => {
    const sign =
      value > 0
        ? "+"
        : "";

    return `${sign}${value.toFixed(2)}`;
  };

  // ===================================================
  // FORMAT CHANGE PERCENT
  // ===================================================

  const formatChangePercent = (
    value: number
  ) => {
    const sign =
      value > 0
        ? "+"
        : "";

    return `${sign}${value.toFixed(2)}%`;
  };

  // ===================================================
  // FORMAT UPDATED TIME
  // ===================================================

  const formatUpdatedTime = (
    value: string
  ) => {
    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "—";
    }

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  return (
    <>
      {/* =====================================
          MOBILE OVERLAY
      ===================================== */}

      {mobileOpen && (
        <div
          className="itdp-sidebar-overlay"
          onClick={onClose}
        />
      )}

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside
        className={`itdp-sidebar ${
          mobileOpen
            ? "itdp-sidebar-open"
            : ""
        }`}
      >
        {/* ===================================
            SIDEBAR HEADING
        =================================== */}

        <h3
          style={{
            marginTop: 0,
            marginBottom: "18px",
            color: "white",
            fontSize: "18px",
            fontWeight: "700",
          }}
        >
          Dashboard
        </h3>

        {/* ===================================
            MENU ITEMS
        =================================== */}

        {menuItems.map(
          (item) => (
            <button
              type="button"
              key={item.page}
              onClick={() =>
                handleMenuClick(
                  item.page
                )
              }
              style={{
                display: "block",
                width: "100%",
                padding: "11px 12px",
                marginBottom: "8px",
                background:
                  "#1e293b",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "15px",
                fontWeight: "500",
                lineHeight: "1.35",
                transition: "0.2s",
                boxSizing:
                  "border-box",
              }}
            >
              {item.name}
            </button>
          )
        )}

        {/* ===================================
            MARKET INDICES
        =================================== */}

        <div
          style={{
            marginTop: "14px",
            paddingTop: "16px",
            borderTop:
              "1px solid #334155",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#94a3b8",
              marginBottom: "12px",
              letterSpacing:
                "0.06em",
            }}
          >
            MARKET INDICES
          </div>

          {/* ===============================
              LOADING STATE
          =============================== */}

          {marketIndices.length ===
            0 && (
            <div
              style={{
                padding:
                  "10px 0",
                color:
                  "#64748b",
                fontSize:
                  "11px",
              }}
            >
              Loading market data...
            </div>
          )}

          {/* ===============================
              LIVE INDEX CARDS
          =============================== */}

          {marketIndices.map(
            (index) => {
              const isPositive =
                index.change > 0;

              const isNegative =
                index.change < 0;

              const changeColor =
                isPositive
                  ? "#22c55e"
                  : isNegative
                  ? "#ef4444"
                  : "#94a3b8";

              return (
                <div
                  key={
                    index.symbol
                  }
                  style={{
                    padding:
                      "11px 12px",
                    marginBottom:
                      "8px",
                    background:
                      "#172033",
                    border:
                      "1px solid #263449",
                    borderRadius:
                      "9px",
                  }}
                >
                  {/* INDEX NAME */}

                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "space-between",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize:
                          "15px",
                        fontWeight:
                          "600",
                        color:
                          "#cbd5e1",
                      }}
                    >
                      {index.name}
                    </span>

                    <span
                      style={{
                        fontSize:
                          "13px",
                        fontWeight:
                          "700",
                        color:
                          "#f8fafc",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {formatIndexValue(
                        index.price
                      )}
                    </span>
                  </div>

                  {/* CHANGE */}

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "flex-end",
                      marginTop:
                        "6px",
                    }}
                  >
                    <span
                      style={{
                        color:
                          changeColor,
                        fontSize:
                          "12px",
                        fontWeight:
                          "600",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {formatChange(
                        index.change
                      )}

                      {"  "}

                      {formatChangePercent(
                        index.changePercent
                      )}
                    </span>
                  </div>
                </div>
              );
            }
          )}

          {/* ===============================
              LAST UPDATED
          =============================== */}

          {marketUpdatedAt && (
            <div
              style={{
                marginTop: "10px",
                color:
                  "#94a3b8",
                fontSize:
                  "11px",
                textAlign:
                  "right",
              }}
            >
              Last Updated{" "}
              {formatUpdatedTime(
                marketUpdatedAt
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
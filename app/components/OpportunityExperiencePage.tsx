"use client";

import {
  useCallback,
  useState,
} from "react";

import OpportunitySignalChart from "./chart/OpportunitySignalChart";

type OpportunityExperienceState =
  | "OPPORTUNITIES_AVAILABLE"
  | "WATCHLIST_ONLY"
  | "NO_OPPORTUNITY";

type OpportunityExperienceItem = {
  symbol: string;

  decision:
    | "BUY"
    | "SELL";

  action:
    | "TRADE"
    | "WATCH"
    | "AVOID";

  classification:
    string;

  score:
    number;

  entry:
    number;

  stopLoss:
    number;

  target1:
    number;

  target2:
    number;

  quantity:
    number;

  maxRisk:
    number;

  riskRewardRatio:
    number;

  riskGateStatus:
    | "PASS"
    | "CAUTION"
    | "BLOCK";

  headline:
    string;

  riskMessage:
    string;
};

type OpportunityExperienceApiResponse = {
  source:
    | "LIVE"
    | "CACHE";

  scanId:
    string;

  scannedCount:
    number;

  analyzedCount:
    number;

  failedCount:
    number;

  state:
    OpportunityExperienceState;

  experience: {
    totalOpportunities:
      number;

    tradeCount:
      number;

    watchCount:
      number;

    opportunities:
      OpportunityExperienceItem[];
  };
};
type OpportunityExperiencePageProps = {
  language: "en" | "mr";
  onViewFullAnalysis: (
    symbol: string
  ) => void | Promise<void>;
};

export default function OpportunityExperiencePage({
  language,
  onViewFullAnalysis,
}: OpportunityExperiencePageProps) {
  const [
    capital,
    setCapital,
  ] =
    useState(
      75000
    );

  const [
    riskProfile,
    setRiskProfile,
  ] =
    useState<
      | "CONSERVATIVE"
      | "BALANCED"
      | "AGGRESSIVE"
    >(
      "BALANCED"
    );

  const [
    horizon,
    setHorizon,
  ] =
    useState<
      | "SHORT"
      | "MEDIUM"
    >(
      "SHORT"
    );

  const [
    result,
    setResult,
  ] =
    useState<
      OpportunityExperienceApiResponse | null
    >(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      false
    );

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(
      null
    );

  const [
    selectedOpportunity,
    setSelectedOpportunity,
  ] =
    useState<
      OpportunityExperienceItem | null
    >(
      null
    );

  const findOpportunities =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          setError(
            null
          );

          setSelectedOpportunity(
            null
          );

          const response =
            await fetch(
              "/api/opportunity-experience",
              {
                method:
                  "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                cache:
                  "no-store",

                body:
                  JSON.stringify({
                    stockUniverse:
                      "ITDP_REAL_100",

                    capital,

                    horizon,

                    riskProfile,

                    maxResults:
                      10,

                    freshnessTtlMs:
                      300000,
                  }),
              }
            );

          const data =
            await response.json();

          if (
            !response.ok
          ) {
            throw new Error(
              data?.error ??
                "OPPORTUNITY_REQUEST_FAILED"
            );
          }

          setResult(
            data
          );
        } catch (
          error
        ) {
          setError(
            error instanceof Error
              ? error.message
              : "UNKNOWN_ERROR"
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        capital,
        horizon,
        riskProfile,
      ]
    );
  const tradeOpportunities =
    result?.experience.opportunities.filter(
      (opportunity) =>
        opportunity.action === "TRADE"
    ) ?? [];

  const watchOpportunities =
    result?.experience.opportunities.filter(
      (opportunity) =>
        opportunity.action === "WATCH"
    ) ?? [];

  const avoidedOpportunities =
    result?.experience.opportunities.filter(
      (opportunity) =>
        opportunity.action === "AVOID"
    ) ?? [];
  return (
  <div
    className="itdp-opportunities-page"
    style={{
      padding: "28px 20px 40px",
    }}
  >

            <div
        style={{
          position: "relative",
          overflow: "hidden",
          marginBottom: "24px",
          padding: "28px 30px",
          borderRadius: "18px",
          border: "1px solid #1d4ed8",
          background:
            "linear-gradient(135deg, #071426 0%, #0b1f3a 55%, #071426 100%)",
          boxShadow:
            "0 18px 45px rgba(2, 132, 199, 0.12)",
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
              padding: "5px 10px",
              borderRadius: "999px",
              border:
                "1px solid rgba(56, 189, 248, 0.35)",
              background:
                "rgba(14, 165, 233, 0.08)",
              color: "#38bdf8",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            ITDP MARKET OPPORTUNITY ENGINE
          </div>

          <h2
            style={{
              maxWidth: "850px",
              margin: "0 0 10px",
              color: "#f8fafc",
              fontSize: "28px",
              lineHeight: 1.25,
              fontWeight: 800,
            }}
          >
            Tell ITDP your capital and
            risk preference.
          </h2>

          <p
            style={{
              maxWidth: "760px",
              margin: 0,
              color: "#a8b7cc",
              fontSize: "15px",
              lineHeight: 1.7,
            }}
          >
            The engine will scan the market
            for suitable opportunities and
            filter them through ITDP decision
            and risk intelligence.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "22px",
            }}
          >
            {[
              "Set Your Capital",
              "Choose Your Risk Preference",
              "Discover Opportunities",
            ].map((step, index) => (
              <div
                key={step}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: "9px",
                    border:
                      "1px solid #263b59",
                    background:
                      "rgba(15, 23, 42, 0.78)",
                    color:
                      index === 2
                        ? "#4ade80"
                        : "#dbeafe",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  {index + 1}. {step}
                </div>

                {index < 2 && (
                  <span
                    style={{
                      color: "#38bdf8",
                      fontWeight: 800,
                    }}
                  >
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "240px",
            height: "240px",
            right: "-60px",
            top: "-90px",
            borderRadius: "50%",
            background:
              "rgba(14, 165, 233, 0.12)",
            filter: "blur(18px)",
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "180px",
            height: "180px",
            right: "120px",
            bottom: "-130px",
            borderRadius: "50%",
            background:
              "rgba(34, 197, 94, 0.10)",
            filter: "blur(16px)",
          }}
        />
      </div>
            <div
        style={{
          marginBottom: "24px",
          padding: "20px",
          borderRadius: "16px",
          border: "1px solid #263b59",
          background:
            "linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, rgba(10, 20, 36, 0.96) 100%)",
          boxShadow:
            "0 12px 30px rgba(0, 0, 0, 0.16)",
        }}
      >
        <div
  style={{
    marginBottom: "16px",
  }}
>
  <div
    className="itdp-opportunities-section-label"
    style={{
      color: "#38bdf8",
      fontSize: "15px",
      fontWeight: 800,
      letterSpacing: "0.08em",
      marginBottom: "5px",
    }}
  >
    YOUR OPPORTUNITY PREFERENCES
  </div>
</div>
          <div
            style={{
              color: "#f8fafc",
              fontSize: "18px",
              fontWeight: 750,
            }}
          >
            Set your trading preferences
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(180px, 1.35fr) minmax(150px, 1fr) minmax(170px, 1fr) minmax(190px, auto)",
            gap: "14px",
            alignItems: "end",
          }}
        >
          <div>
            <label
            className="itdp-opportunities-field-label"
              style={{
                display: "block",
                marginBottom: "7px",
                color: "#94a3b8",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              CAPITAL
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "46px",
                borderRadius: "10px",
                border: "1px solid #334155",
                background: "#081321",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  paddingLeft: "14px",
                  color: "#4ade80",
                  fontSize: "18px",
                  fontWeight: 800,
                }}
              >
                {String.fromCharCode(0x20b9)}
              </span>

              <input
                type="number"
                value={capital}
                min={1}
                onChange={(event) =>
                  setCapital(
                    Number(event.target.value)
                  )
                }
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "0 12px 0 8px",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "#f8fafc",
                  fontSize: "15px",
                  fontWeight: 700,
                }}
              />
            </div>
          </div>

          <div>
            <label
            className="itdp-opportunities-field-label"
              style={{
                display: "block",
                marginBottom: "7px",
                color: "#94a3b8",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              TRADING HORIZON
            </label>

            <select
              value={horizon}
              onChange={(event) =>
                setHorizon(
                  event.target.value as
                    | "SHORT"
                    | "MEDIUM"
                )
              }
              style={{
                width: "100%",
                height: "46px",
                padding: "0 12px",
                borderRadius: "10px",
                border: "1px solid #334155",
                background: "#081321",
                color: "#f8fafc",
                fontSize: "14px",
                fontWeight: 650,
                cursor: "pointer",
              }}
            >
              <option value="SHORT">
                Short
              </option>

              <option value="MEDIUM">
                Medium
              </option>
            </select>
          </div>

          <div>
            <label
            className="itdp-opportunities-field-label"
              style={{
                display: "block",
                marginBottom: "7px",
                color: "#94a3b8",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              RISK PREFERENCE
            </label>

            <select
              value={riskProfile}
              onChange={(event) =>
                setRiskProfile(
                  event.target.value as
                    | "CONSERVATIVE"
                    | "BALANCED"
                    | "AGGRESSIVE"
                )
              }
              style={{
                width: "100%",
                height: "46px",
                padding: "0 12px",
                borderRadius: "10px",
                border: "1px solid #334155",
                background: "#081321",
                color: "#f8fafc",
                fontSize: "14px",
                fontWeight: 650,
                cursor: "pointer",
              }}
            >
              <option value="CONSERVATIVE">
                Conservative
              </option>

              <option value="BALANCED">
                Balanced
              </option>

              <option value="AGGRESSIVE">
                Aggressive
              </option>
            </select>
          </div>

          <button
            type="button"
            onClick={findOpportunities}
            disabled={loading}
            style={{
              minWidth: "190px",
              height: "46px",
              padding: "0 20px",
              border: "1px solid #2563eb",
              borderRadius: "10px",
              background: loading
                ? "#1e3a5f"
                : "linear-gradient(135deg, #2563eb 0%, #0284c7 55%, #059669 130%)",
              boxShadow: loading
                ? "none"
                : "0 8px 24px rgba(37, 99, 235, 0.24)",
              color: "#ffffff",
              cursor: loading
                ? "default"
                : "pointer",
              fontSize: "14px",
              fontWeight: 800,
              letterSpacing: "0.01em",
              opacity: loading ? 0.72 : 1,
            }}
          >
            {loading
              ? "Scanning Market..."
              : "Find Opportunities →"}
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "18px",
            flexWrap: "wrap",
            marginTop: "13px",
            color: "#64748b",
            fontSize: "11px",
          }}
        >
          <span>
            Capital-aware scanning
          </span>

          <span>
            Risk-filtered opportunities
          </span>

          <span>
            Decision Engine validated
          </span>
        </div>
      </div>
      {
        !result &&
        !loading &&
        !error && (
          <div
            style={{
              marginTop: "28px",
              padding: "28px",
              border: "1px solid #334155",
              borderRadius: "16px",
              background: "#0f172a",
              color: "#f8fafc",
            }}
          >
            <div
              style={{
                maxWidth: "760px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                 fontSize:
                  "13px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#60a5fa",
                  marginBottom: "10px",
                }}
              >
                ITDP MARKET OPPORTUNITY SCAN
              </div>

              <h3
                style={{
                  margin: "0 0 10px",
                  fontSize: "22px",
                  lineHeight: "1.3",
                }}
              >
                Let the decision engine search
                before you choose a stock.
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#94a3b8",
                  fontSize: "15px",
                  lineHeight: "1.7",
                }}
              >
                ITDP scans the selected market
                universe and filters opportunities
                using decision quality, risk
                conditions and your selected
                capital profile.
              </p>
            </div>

<div
  className="itdp-opportunity-feature-grid"
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "14px",
  }}
>

              <div
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  background: "#111c2f",
                  border: "1px solid #263449",
                }}
              >
                <div
                  style={{
                    color: "#f8fafc",
                    fontWeight: 700,
                    marginBottom: "7px",
                  }}
                >
                  Market Scan
                </div>

                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: "14px",
                    lineHeight: "1.6",
                  }}
                >
                  Screens the ITDP market universe
                  instead of relying on one manually
                  selected stock.
                </div>
              </div>

              <div
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  background: "#111c2f",
                  border: "1px solid #263449",
                }}
              >
                <div
                  style={{
                    color: "#f8fafc",
                    fontWeight: 700,
                    marginBottom: "7px",
                  }}
                >
                  Decision Validation
                </div>

                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: "14px",
                    lineHeight: "1.6",
                  }}
                >
                  Separates validated trade setups
                  from stocks that should only be
                  watched or avoided.
                </div>
              </div>

              <div
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  background: "#111c2f",
                  border: "1px solid #263449",
                }}
              >
                <div
                  style={{
                    color: "#f8fafc",
                    fontWeight: 700,
                    marginBottom: "7px",
                  }}
                >
                  Risk First
                </div>

                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: "14px",
                    lineHeight: "1.6",
                  }}
                >
                  Trade results include Entry,
                  Stop Loss, T1, T2, quantity and
                  maximum planned risk.
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "20px",
                paddingTop: "16px",
                borderTop: "1px solid #263449",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Set your capital, horizon and risk
              profile above, then select
              Find Opportunities.
            </div>
          </div>
        )
      }
      {
        error && (
          <div
            style={{
              marginBottom:
                "20px",

              padding:
                "12px",

              border:
                "1px solid #ef4444",

              borderRadius:
                "8px",
            }}
          >
            {
              error
            }
          </div>
        )
      }

      {
        result && (
          <>
            <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "12px",
    marginBottom: "22px",
  }}
>
  {[
    {
      label: "Scanned",
      value: result.scannedCount,
    },
    {
      label: "Analyzed",
      value: result.analyzedCount,
    },
    {
      label: "Trade",
      value: tradeOpportunities.length,
    },
    {
      label: "Watch",
      value: watchOpportunities.length,
    },
  ].map((item) => (
    <div
      key={item.label}
      style={{
        padding: "14px 16px",
        borderRadius: "12px",
        background: "#0f172a",
        border: "1px solid #263449",
      }}
    >
      <div
        style={{
          color: "#f8fafc",
          fontSize: "22px",
          fontWeight: 700,
          marginBottom: "4px",
        }}
      >
        {item.value}
      </div>

      <div
        style={{
          color: "#94a3b8",
          fontSize: "13px",
        }}
      >
        {item.label}
      </div>
    </div>
  ))}
</div>

            {
              result.state ===
                "NO_OPPORTUNITY" && (
                <div
                  style={{
                    padding:
                      "20px",

                    border:
                      "1px solid #334155",

                    borderRadius:
                      "12px",
                  }}
                >
                  <h3
                    style={{
                      marginTop:
                        0,
                    }}
                  >
                    No suitable opportunity
                    right now
                  </h3>

                  <p
                    style={{
                      marginBottom:
                        0,

                      color:
                        "#94a3b8",
                    }}
                  >
                    ITDP did not find a
                    trade that currently
                    meets your selected
                    conditions. Waiting is
                    also a valid decision.
                  </p>
                </div>
              )
            }

            {
              result.state ===
                "WATCHLIST_ONLY" && (
                <div
                  style={{
                    marginBottom:
                      "18px",

                    padding:
                      "16px",

                    border:
                      "1px solid #f59e0b",

                    borderRadius:
                      "12px",
                  }}
                >
                  No validated trade is
                  ready yet. ITDP found
                  stocks worth watching.
                </div>
              )
            }

            {
              result.state ===
                "OPPORTUNITIES_AVAILABLE" && (
                <div
                  style={{
                    marginBottom:
                      "18px",
                  }}
                >
                  <strong
  style={{
    color: "#f8fafc",
  }}
>
                    {
                      result
                        .experience
                        .tradeCount
                    }{" "}
                    validated opportunity
                    {
                      result
                        .experience
                        .tradeCount ===
                      1
                        ? ""
                        : "ies"
                    }{" "}
                    found.
                  </strong>
                </div>
              )
            }

            {
              selectedOpportunity && (
                <div
                  style={{
                    marginBottom: "22px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "10px",
                    }}
                  >
                    <strong
                      style={{
                      color: "#0f172a",
                      fontSize: "16px",
                    }}
                  >
                    ITDP Signal Detail
                  </strong>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedOpportunity(
                          null
                        )
                      }
                      style={{
                        padding: "7px 12px",
                        borderRadius: "8px",
                        border: "1px solid #475569",
                        background: "#111827",
                        color: "#cbd5e1",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Close Chart
                    </button>
                  </div>

                  <OpportunitySignalChart
                    symbol={
                      selectedOpportunity.symbol
                    }
                    decision={
                      selectedOpportunity.decision
                    }
                    entry={
                      selectedOpportunity.entry
                    }
                    stopLoss={
                      selectedOpportunity.stopLoss
                    }
                    target1={
                      selectedOpportunity.target1
                    }
                    target2={
                      selectedOpportunity.target2
                    }
                  />
                </div>
              )
            }

            {
              tradeOpportunities.length >
                0 && (
                <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "18px",
    width: "100%",
  }}
>
                  {
                    tradeOpportunities.map(
                        (
                          opportunity
                        ) => {
                          const isTrade =
                            opportunity
                              .action ===
                            "TRADE";

                          const isWatch =
                            opportunity
                              .action ===
                            "WATCH";

                          const isBuy =
                            opportunity
                              .decision ===
                            "BUY";

                          return (
                            <div
                              key={
                                opportunity
                                  .symbol
                              }
                              role="button"
                              tabIndex={0}
                              onClick={() =>
                                setSelectedOpportunity(
                                  opportunity
                                )
                              }
                              onKeyDown={(
                                event
                              ) => {
                                if (
                                  event.key ===
                                    "Enter" ||
                                  event.key ===
                                    " "
                                ) {
                                  setSelectedOpportunity(
                                    opportunity
                                  );
                                }
                              }}
                              style={{
                                padding:
                                  "18px",

                                border:
                                  selectedOpportunity?.symbol ===
                                  opportunity.symbol
                                    ? "2px solid #38bdf8"
                                    : isTrade
                                    ? "1px solid #22c55e"
                                    : isWatch
                                    ? "1px solid #f59e0b"
                                    : "1px solid #475569",

                                borderRadius:
                                  "12px",

                                background:
                                  "#0f172a",

                                color:
                                  "#f8fafc",

                                cursor:
                                  "pointer",
                              }}
                            >
                              <div
                                style={{
                                  display:
                                    "flex",

                                  justifyContent:
                                    "space-between",

                                  alignItems:
                                    "center",

                                  gap:
                                    "12px",

                                  marginBottom:
                                    "12px",
                                }}
                              >
                                <strong
                                  style={{
                                    color:
                                      "#f8fafc",

                                    fontSize:
                                      "17px",

                                    letterSpacing:
                                      "0.2px",
                                  }}
                                >
                                  {
                                    opportunity
                                      .symbol
                                  }
                                </strong>

                                <span
                                  style={{
                                    padding:
                                      "4px 9px",

                                    borderRadius:
                                      "999px",

                                    fontSize:
                                      "12px",

                                    fontWeight:
                                      700,

                                    color:
                                      isTrade
                                        ? "#22c55e"
                                        : isWatch
                                        ? "#f59e0b"
                                        : "#cbd5e1",

                                    border:
                                      isTrade
                                        ? "1px solid #22c55e"
                                        : isWatch
                                        ? "1px solid #f59e0b"
                                        : "1px solid #64748b",
                                  }}
                                >
                                  {
                                    opportunity
                                      .action
                                  }
                                </span>
                              </div>

                              <div
                                style={{
                                  display:
                                    "flex",

                                  alignItems:
                                    "center",

                                  gap:
                                    "8px",

                                  marginBottom:
                                    "12px",
                                }}
                              >
                                <span
                                    style={{
                                fontWeight: 700,
                                    fontSize: "16px",
                                color: isBuy
                                     ? "#22c55e"
                                    : "#ef4444",
                                            }}
                                    >
                                    {opportunity.decision}
                                    </span>

                                <span
                                  style={{
                                    color:
                                      "#64748b",
                                  }}
                                >
                                  |
                                </span>

                                <span
                                    style={{
                                        color: "#cbd5e1",
                                     fontWeight: 600,
                                 fontSize: "15px",
                                             }}
                                    >
                                    {opportunity.classification}
                                </span>
                              </div>

                              <p
                                style={{
                                  color:
                                    "#cbd5e1",

                                  fontSize:
                                    "14px",

                                  lineHeight:
                                    "1.6",

                                  marginTop:
                                    0,

                                  marginBottom:
                                    "14px",
                                }}
                              >
                                {
                                  opportunity
                                    .headline
                                }
                              </p>
                              <div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "16px",
    flexWrap: "wrap",
  }}
>
  <button
    type="button"
    onClick={(event) => {
      event.stopPropagation();

      setSelectedOpportunity(
        opportunity
      );
    }}
    style={{
      padding: "9px 12px",
      borderRadius: "8px",
      border: "1px solid #475569",
      background: "#111827",
      color: "#e2e8f0",
      cursor: "pointer",
      fontWeight: 600,
    }}
  >
    View Chart
  </button>

  <button
    type="button"
    onClick={(event) => {
      event.stopPropagation();

      void onViewFullAnalysis(
        opportunity.symbol
      );
    }}
    style={{
      padding: "9px 12px",
      borderRadius: "8px",
      border: "1px solid #2563eb",
      background: "#2563eb",
      color: "white",
      cursor: "pointer",
      fontWeight: 700,
    }}
  >
    Full Analysis →
  </button>
</div>

                              <div
                                style={{
                                  padding:
                                    "12px",

                                  borderRadius:
                                    "8px",

                                  background:
                                    "#111c2f",

                                  color:
                                    "#e2e8f0",

                                  lineHeight:
                                    "1.9",

                                  fontSize:
                                    "14px",

                                  marginBottom:
                                    "12px",
                                }}
                              >
                                <div>
                                  Entry:{" "}
                                  <strong>
                                    Rs.{" "}
                                    {
                                      opportunity
                                        .entry
                                    }
                                  </strong>
                                </div>

                                <div>
                                  Stop Loss:{" "}
                                  <strong>
                                    Rs.{" "}
                                    {
                                      opportunity
                                        .stopLoss
                                    }
                                  </strong>
                                </div>

                                <div>
                                  T1:{" "}
                                  <strong>
                                    Rs.{" "}
                                    {
                                      opportunity
                                        .target1
                                    }
                                  </strong>
                                </div>

                                <div>
                                  T2:{" "}
                                  <strong>
                                    Rs.{" "}
                                    {
                                      opportunity
                                        .target2
                                    }
                                  </strong>
                                </div>

                                <div>
                                  Quantity:{" "}
                                  <strong>
                                    {
                                      opportunity
                                        .quantity
                                    }
                                  </strong>
                                </div>

                                <div>
                                  Max Risk:{" "}
                                  <strong>
                                    Rs.{" "}
                                    {
                                      opportunity
                                        .maxRisk
                                    }
                                  </strong>
                                </div>

                                <div>
                                  R:R:{" "}
                                  <strong>
                                    {
                                      opportunity
                                        .riskRewardRatio
                                    }
                                  </strong>
                                </div>
                              </div>

                              <p
                                style={{
                                  margin:
                                    0,

                                  color:
                                    "#94a3b8",

                                  fontSize:
                                    "13px",

                                  lineHeight:
                                    "1.5",
                                }}
                              >
                                {
                                  opportunity
                                    .riskMessage
                                }
                              </p>
                            </div>
                          );
                        }
                      )
                  }
                </div>
              )
            }
                        {
              watchOpportunities.length > 0 && (
                <div
                  style={{
                    marginTop: "28px",
                    paddingTop: "22px",
                    borderTop:
                      "1px solid #263449",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "end",
                      gap: "16px",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: "#f59e0b",
                          fontSize: "12px",
                          fontWeight: 800,
                          letterSpacing:
                            "0.08em",
                          marginBottom: "6px",
                        }}
                      >
                        ITDP WATCHLIST
                      </div>

                      <h3
                        style={{
                          margin: 0,
                          color: "#f8fafc",
                          fontSize: "20px",
                        }}
                      >
                        Stocks Worth Watching
                      </h3>

                      <p
                        style={{
                          margin:
                            "6px 0 0",
                          color: "#94a3b8",
                          fontSize: "13px",
                          lineHeight: 1.5,
                        }}
                      >
                        These stocks are not
                        validated trades yet.
                        ITDP has identified them
                        as candidates worth
                        monitoring.
                      </p>
                    </div>

                    <div
                      style={{
                        padding: "6px 11px",
                        borderRadius: "999px",
                        border:
                          "1px solid rgba(245, 158, 11, 0.45)",
                        background:
                          "rgba(245, 158, 11, 0.08)",
                        color: "#fbbf24",
                        fontSize: "12px",
                        fontWeight: 800,
                      }}
                    >
                      {watchOpportunities.length} WATCH
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(3, minmax(0, 1fr))",
                      gap: "14px",
                    }}
                  >
                    {watchOpportunities.map(
                      (opportunity) => {
                        const isBuy =
                          opportunity.decision ===
                          "BUY";

                        return (
                          <div
                            key={
                              opportunity.symbol
                            }
                            style={{
                              padding: "16px",
                              borderRadius: "12px",
                              border:
                                "1px solid rgba(245, 158, 11, 0.35)",
                              background:
                                "rgba(15, 23, 42, 0.78)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent:
                                  "space-between",
                                alignItems:
                                  "center",
                                gap: "10px",
                                marginBottom:
                                  "10px",
                              }}
                            >
                              <strong
                                style={{
                                  color:
                                    "#f8fafc",
                                  fontSize:
                                    "15px",
                                }}
                              >
                                {
                                  opportunity.symbol
                                }
                              </strong>

                              <span
                                style={{
                                  padding:
                                    "3px 8px",
                                  borderRadius:
                                    "999px",
                                  border:
                                    "1px solid #f59e0b",
                                  color:
                                    "#fbbf24",
                                  fontSize:
                                    "11px",
                                  fontWeight:
                                    800,
                                }}
                              >
                                WATCH
                              </span>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                alignItems:
                                  "center",
                                gap: "7px",
                                marginBottom:
                                  "10px",
                              }}
                            >
                              <span
                                style={{
                                  color: isBuy
                                    ? "#22c55e"
                                    : "#ef4444",
                                  fontWeight:
                                    800,
                                  fontSize:
                                    "14px",
                                }}
                              >
                                {
                                  opportunity.decision
                                }
                              </span>

                              <span
                                style={{
                                  color:
                                    "#475569",
                                }}
                              >
                                |
                              </span>

                              <span
                                style={{
                                  color:
                                    "#cbd5e1",
                                  fontSize:
                                    "13px",
                                  fontWeight:
                                    600,
                                }}
                              >
                                {
                                  opportunity.classification
                                }
                              </span>
                            </div>

                            <p
                              style={{
                                margin:
                                  "0 0 12px",
                                color:
                                  "#94a3b8",
                                fontSize:
                                  "13px",
                                lineHeight:
                                  1.55,
                              }}
                            >
                              {
                                opportunity.headline
                              }
                            </p>

                            <div
                              style={{
                                display: "flex",
                                justifyContent:
                                  "space-between",
                                gap: "12px",
                                paddingTop:
                                  "10px",
                                borderTop:
                                  "1px solid #263449",
                                color:
                                  "#94a3b8",
                                fontSize:
                                  "12px",
                              }}
                            >
                              <span>
                                Risk Gate
                              </span>

                              <strong
                                style={{
                                  color:
                                    "#fbbf24",
                                }}
                              >
                                {
                                  opportunity.riskGateStatus
                                }
                              </strong>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )
            }
          </>
        )
      }
    </div>
  );
}
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

export default function OpportunityExperiencePage() {
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

  return (
    <div
  style={{
    padding: "28px 20px 40px",
  }}
>
      <div
        style={{
          marginBottom:
            "20px",
        }}
      >
        <h2
          style={{
            marginTop:
              0,

            marginBottom:
              "8px",
          }}
        >
          ITDP Opportunities
        </h2>

        <p
          style={{
            margin:
              0,

            color:
              "#94a3b8",
          }}
        >
          Tell ITDP your capital and
          risk preference. The engine
          will scan the market for
          suitable opportunities.
        </p>
      </div>

      <div
        style={{
          display:
            "flex",

          gap:
            "12px",

          flexWrap:
            "wrap",

          marginBottom:
            "20px",
        }}
      >
        <div>
          <label
            style={{
              display:
                "block",

              fontSize:
                "13px",

              marginBottom:
                "6px",
            }}
          >
            Capital
          </label>

          <input
            type="number"
            value={
              capital
            }
            min={
              1
            }
            onChange={(
              event
            ) =>
              setCapital(
                Number(
                  event
                    .target
                    .value
                )
              )
            }
            style={{
              padding:
                "10px",

              borderRadius:
                "8px",

              border:
                "1px solid #334155",

              background:
                "#0f172a",

              color:
                "white",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display:
                "block",

              fontSize:
                 "13px",

              marginBottom:
                "6px",
            }}
          >
            Horizon
          </label>

          <select
            value={
              horizon
            }
            onChange={(
              event
            ) =>
              setHorizon(
                event
                  .target
                  .value as
                  | "SHORT"
                  | "MEDIUM"
              )
            }
            style={{
              padding:
                "10px",

              borderRadius:
                "8px",

              border:
                "1px solid #334155",

              background:
                "#0f172a",

              color:
                "white",
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
            style={{
              display:
                "block",

              fontSize:
                "13px",

              marginBottom:
                "6px",
            }}
          >
            Risk Profile
          </label>

          <select
            value={
              riskProfile
            }
            onChange={(
              event
            ) =>
              setRiskProfile(
                event
                  .target
                  .value as
                  | "CONSERVATIVE"
                  | "BALANCED"
                  | "AGGRESSIVE"
              )
            }
            style={{
              padding:
                "10px",

              borderRadius:
                "8px",

              border:
                "1px solid #334155",

              background:
                "#0f172a",

              color:
                "white",
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

        <div
          style={{
            display:
              "flex",

            alignItems:
              "end",
          }}
        >
          <button
            type="button"
            onClick={
              findOpportunities
            }
            disabled={
              loading
            }
            style={{
              padding:
                "10px 18px",

              border:
                "none",

              borderRadius:
                "8px",

              cursor:
                loading
                  ? "default"
                  : "pointer",

              fontWeight:
                600,
            }}
          >
            {
              loading
                ? "Scanning..."
                : "Find Opportunities"
            }
          </button>
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
                marginBottom:
                  "18px",

                fontSize:
                  "14px",

                color:
                  "#94a3b8",
              }}
            >
              Source:{" "}
              {
                result.source
              }
              {" | "}
              Scanned:{" "}
              {
                result.scannedCount
              }
              {" | "}
              Analyzed:{" "}
              {
                result.analyzedCount
              }
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
                  <strong>
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
              result
                .experience
                .opportunities
                .length >
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
                    result
                      .experience
                      .opportunities
                      .map(
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
          </>
        )
      }
    </div>
  );
}
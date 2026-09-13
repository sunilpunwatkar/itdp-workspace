"use client";

import {
  useCallback,
  useState,
} from "react";

type OpportunityExperienceState =
  | "OPPORTUNITIES_AVAILABLE"
  | "WATCHLIST_ONLY"
  | "NO_OPPORTUNITY";

type OpportunityExperienceItem = {
  symbol: string;
  decision: "BUY" | "SELL";
  action:
    | "TRADE"
    | "WATCH"
    | "AVOID";

  classification: string;

  score: number;

  entry: number;
  stopLoss: number;
  target1: number;
  target2: number;

  quantity: number;
  maxRisk: number;

  riskRewardRatio: number;

  riskGateStatus:
    | "PASS"
    | "CAUTION"
    | "BLOCK";

  headline: string;
  riskMessage: string;
};

type OpportunityExperienceApiResponse = {
  source:
    | "LIVE"
    | "CACHE";

  scanId: string;

  scannedCount: number;
  analyzedCount: number;
  failedCount: number;

  state:
    OpportunityExperienceState;

  experience: {
    totalOpportunities: number;
    tradeCount: number;
    watchCount: number;
    opportunities:
      OpportunityExperienceItem[];
  };
};

export default function OpportunityExperiencePage() {
  const [capital, setCapital] =
    useState(75000);

  const [
    riskProfile,
    setRiskProfile,
  ] =
    useState<
      | "CONSERVATIVE"
      | "BALANCED"
      | "AGGRESSIVE"
    >("BALANCED");

  const [
    horizon,
    setHorizon,
  ] =
    useState<
      | "SHORT"
      | "MEDIUM"
    >("SHORT");

  const [
    result,
    setResult,
  ] =
    useState<
      OpportunityExperienceApiResponse | null
    >(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(
      null
    );

  const findOpportunities =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError(null);

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

          if (!response.ok) {
            throw new Error(
              data?.error ??
                "OPPORTUNITY_REQUEST_FAILED"
            );
          }

          setResult(data);
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "UNKNOWN_ERROR"
          );
        } finally {
          setLoading(false);
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
        padding:
          "20px",
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
                "12px",

              marginBottom:
                "6px",
            }}
          >
            Capital
          </label>

          <input
            type="number"
            value={capital}
            min={1}
            onChange={(
              event
            ) =>
              setCapital(
                Number(
                  event.target
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
                "12px",

              marginBottom:
                "6px",
            }}
          >
            Horizon
          </label>

          <select
            value={horizon}
            onChange={(
              event
            ) =>
              setHorizon(
                event.target
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
                "12px",

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
                event.target
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
            {loading
              ? "Scanning..."
              : "Find Opportunities"}
          </button>
        </div>
      </div>

      {error && (
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
          {error}
        </div>
      )}

      {result && (
        <>
          <div
            style={{
              marginBottom:
                "18px",

              fontSize:
                "13px",

              color:
                "#94a3b8",
            }}
          >
            Source:{" "}
            {result.source}
            {" • "}
            Scanned:{" "}
            {
              result.scannedCount
            }
            {" • "}
            Analyzed:{" "}
            {
              result.analyzedCount
            }
          </div>

          {result.state ===
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
          )}

          {result.state ===
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
          )}

          {result.state ===
            "OPPORTUNITIES_AVAILABLE" && (
            <div
              style={{
                marginBottom:
                  "18px",
              }}
            >
              <strong>
                {
                  result.experience
                    .tradeCount
                }{" "}
                validated opportunity
                {result.experience
                  .tradeCount === 1
                  ? ""
                  : "ies"}{" "}
                found.
              </strong>
            </div>
          )}

          {result.experience
            .opportunities.length >
            0 && (
            <div
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",

                gap:
                  "16px",
              }}
            >
              {result.experience.opportunities.map(
                (
                  opportunity
                ) => (
                  <div
                    key={
                      opportunity.symbol
                    }
                    style={{
                      padding:
                        "16px",

                      border:
                        "1px solid #334155",

                      borderRadius:
                        "12px",

                      background:
                        "#0f172a",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",

                        justifyContent:
                          "space-between",

                        marginBottom:
                          "12px",
                      }}
                    >
                      <strong>
                        {
                          opportunity.symbol
                        }
                      </strong>

                      <span>
                        {
                          opportunity.action
                        }
                      </span>
                    </div>

                    <div
                      style={{
                        marginBottom:
                          "10px",

                        fontWeight:
                          600,
                      }}
                    >
                      {
                        opportunity.decision
                      }{" "}
                      •{" "}
                      {
                        opportunity.classification
                      }
                    </div>

                    <p
                      style={{
                        color:
                          "#cbd5e1",

                        fontSize:
                          "13px",
                      }}
                    >
                      {
                        opportunity.headline
                      }
                    </p>

                    <div
                      style={{
                        lineHeight:
                          "1.8",

                        fontSize:
                          "13px",
                      }}
                    >
                      Entry: ₹
                      {
                        opportunity.entry
                      }
                      <br />

                      Stop Loss: ₹
                      {
                        opportunity.stopLoss
                      }
                      <br />

                      T1: ₹
                      {
                        opportunity.target1
                      }
                      <br />

                      T2: ₹
                      {
                        opportunity.target2
                      }
                      <br />

                      Quantity:{" "}
                      {
                        opportunity.quantity
                      }
                      <br />

                      Max Risk: ₹
                      {
                        opportunity.maxRisk
                      }
                      <br />

                      R:R:{" "}
                      {
                        opportunity.riskRewardRatio
                      }
                    </div>

                    <p
                      style={{
                        marginBottom:
                          0,

                        color:
                          "#94a3b8",

                        fontSize:
                          "12px",
                      }}
                    >
                      {
                        opportunity.riskMessage
                      }
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
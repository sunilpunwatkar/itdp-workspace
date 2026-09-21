"use client";

type DecisionSummaryCardProps = {
  symbol: string;
  decision: string;
  confidence: number;
  risk: string;

  entryContext:
    | "FAVORABLE"
    | "CAUTION"
    | "UNFAVORABLE";

  riskGate: {
    status:
      | "PASS"
      | "CAUTION"
      | "BLOCK";
    reason: string;
    failures: string[];
    warnings: string[];
  };

  entry: number;
  riskReward: string;
  maxRisk: number;
  quantity: number;

  target: number;
  stopLoss: number;

  language: "en" | "mr";
};

export default function DecisionSummaryCard({
  symbol,
  decision,
  confidence,
  risk,
  entryContext,
  riskGate,
  entry,
  riskReward,
  maxRisk,
  quantity,
  target,
  stopLoss,
  language,
}: DecisionSummaryCardProps) {
  const decisionColor =
    decision === "BUY"
      ? "#22c55e"
      : decision === "SELL"
      ? "#ef4444"
      : "#f59e0b";

  const riskColor =
    risk === "LOW"
      ? "#22c55e"
      : risk === "HIGH"
      ? "#ef4444"
      : "#f59e0b";

  const gateColor =
    riskGate.status === "PASS"
      ? "#22c55e"
      : riskGate.status === "BLOCK"
      ? "#ef4444"
      : "#f59e0b";

  const formatMoney = (value: number) => {
    if (
      !Number.isFinite(value) ||
      value === 0
    ) {
      return "-";
    }

    return `${String.fromCharCode(
      0x20b9
    )}${value.toFixed(2)}`;
  };

  const label = (
    english: string,
    marathi: string
  ) => {
    return language === "mr"
      ? marathi
      : english;
  };

  const actionMessage =
    riskGate.status === "PASS"
      ? label(
          "Trade conditions are acceptable",
          "ट्रेडच्या अटी अनुकूल आहेत"
        )
      : riskGate.status === "CAUTION"
      ? label(
          "Proceed with caution",
          "सावधगिरीने पुढे जा"
        )
      : label(
          "Do not execute this trade",
          "हा ट्रेड सध्या करू नका"
        );

  const entryContextLabel =
    entryContext === "FAVORABLE"
      ? label("Favorable", "अनुकूल")
      : entryContext === "CAUTION"
      ? label("Caution", "सावधगिरी")
      : label("Unfavorable", "प्रतिकूल");

  return (
    <section className="itdp-summary-card">
      <div className="itdp-summary-header">
        <div>
          <h2 className="itdp-summary-title">
            ◈ {label(
              "AI Decision",
              "AI निर्णय"
            )}
          </h2>

          <div className="itdp-summary-symbol">
            {symbol}
          </div>
        </div>
      </div>

      <div className="itdp-summary-grid">
        <div className="itdp-summary-item">
          <span className="itdp-summary-label">
            {label(
              "Decision",
              "निर्णय"
            )}
          </span>

          <strong
            className="itdp-summary-value"
            style={{
              color: decisionColor,
            }}
          >
            {decision}
          </strong>
        </div>

        <div className="itdp-summary-item">
          <span className="itdp-summary-label">
            {label(
              "Confidence",
              "विश्वास"
            )}
          </span>

          <strong className="itdp-summary-value">
            {confidence}%
          </strong>

          <div className="itdp-summary-confidence">
            <div
              className="itdp-summary-confidence-fill"
              style={{
                width: `${Math.min(
                  Math.max(confidence, 0),
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="itdp-summary-item">
          <span className="itdp-summary-label">
            {label(
              "Risk",
              "जोखीम"
            )}
          </span>

          <strong
            className="itdp-summary-value"
            style={{
              color: riskColor,
            }}
          >
            {risk}
          </strong>
        </div>

        <div className="itdp-summary-item">
          <span className="itdp-summary-label">
            {label(
              "Can I act now?",
              "आत्ता ट्रेड करता येईल?"
            )}
          </span>

          <strong
            className="itdp-summary-value"
            style={{
              color: gateColor,
            }}
          >
            {riskGate.status}
          </strong>

          <div
            style={{
              marginTop: "4px",
              color: "#cbd5e1",
              fontSize: "11px",
              lineHeight: 1.35,
            }}
          >
            {actionMessage}
          </div>
        </div>

        <div className="itdp-summary-item">
          <span className="itdp-summary-label">
            {label(
              "Entry Context",
              "एंट्री स्थिती"
            )}
          </span>

          <strong className="itdp-summary-value">
            {entryContextLabel}
          </strong>
        </div>

        <div className="itdp-summary-item">
          <span className="itdp-summary-label">
            {label(
              "Entry",
              "एंट्री"
            )}
          </span>

          <strong className="itdp-summary-value">
            {formatMoney(entry)}
          </strong>
        </div>

        <div className="itdp-summary-item">
          <span className="itdp-summary-label">
            {label(
              "Target",
              "लक्ष्य"
            )}
          </span>

          <strong
            className="itdp-summary-value"
            style={{
              color: "#22c55e",
            }}
          >
            {formatMoney(target)}
          </strong>
        </div>

        <div className="itdp-summary-item">
          <span className="itdp-summary-label">
            {label(
              "Stop Loss",
              "स्टॉप लॉस"
            )}
          </span>

          <strong
            className="itdp-summary-value"
            style={{
              color: "#ef4444",
            }}
          >
            {formatMoney(stopLoss)}
          </strong>
        </div>

        <div className="itdp-summary-item">
          <span className="itdp-summary-label">
            {label(
              "Risk : Reward",
              "जोखीम : परतावा"
            )}
          </span>

          <strong className="itdp-summary-value">
            {riskReward || "-"}
          </strong>
        </div>

        <div className="itdp-summary-item">
          <span className="itdp-summary-label">
            {label(
              "Maximum Risk",
              "कमाल जोखीम"
            )}
          </span>

          <strong className="itdp-summary-value">
            {formatMoney(maxRisk)}
          </strong>
        </div>

        <div className="itdp-summary-item">
          <span className="itdp-summary-label">
            {label(
              "Quantity",
              "शेअर्सची संख्या"
            )}
          </span>

          <strong className="itdp-summary-value">
            {quantity > 0
              ? `${quantity} ${label(
                  "shares",
                  "शेअर्स"
                )}`
              : "-"}
          </strong>
        </div>

        <button
          type="button"
          className="itdp-summary-action"
        >
          {label(
            "View Full Analysis →",
            "संपूर्ण विश्लेषण →"
          )}
        </button>
      </div>
    </section>
  );
}
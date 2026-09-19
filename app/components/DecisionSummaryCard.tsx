"use client";

type DecisionSummaryCardProps = {
  symbol: string;
  decision: string;
  confidence: number;
  risk: string;
  target: number;
  stopLoss: number;
  language: "en" | "mr";
};

export default function DecisionSummaryCard({
  symbol,
  decision,
  confidence,
  risk,
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

  const formatMoney = (value: number) => {
    if (!value || value === 0) {
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

  return (
    <section className="itdp-summary-card">
      <div className="itdp-summary-header">
        <div>
          <h2 className="itdp-summary-title">
            ◈ {label("AI Decision", "AI निर्णय")}
          </h2>

          <div className="itdp-summary-symbol">
            {symbol}
          </div>
        </div>
      </div>

      <div className="itdp-summary-grid">
        <div className="itdp-summary-item">
          <span className="itdp-summary-label">
            {label("Decision", "निर्णय")}
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
            {label("Risk", "जोखीम")}
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
            {label("Target", "लक्ष्य")}
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
"use client";

type DecisionCardProps = {
  symbol: string;
  decision: string;
  confidence: number;
  risk: string;
  target: number;
  stopLoss: number;
  reasons: string[];
  invalidIf: string;
};

export default function DecisionCard({
  symbol,
  decision,
  confidence,
  risk,
  target,
  stopLoss,
  reasons,
  invalidIf,
}: DecisionCardProps) {
  // ==========================================
  // DECISION COLOR
  // ==========================================

  const decisionColor =
    decision === "BUY"
      ? "#16a34a"
      : decision === "SELL"
      ? "#dc2626"
      : "#d97706";

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatMoney = (value: number) => {
    if (!value || value === 0) {
      return "-";
    }

    return `₹${value.toFixed(2)}`;
  };

  return (
    <div className="itdp-decision-card">
      {/* ========================================
          HEADER
      ======================================== */}

      <div className="itdp-decision-header">
        <div>
          <h2 className="itdp-decision-title">
            🤖 AI Decision Engine
          </h2>

          <p className="itdp-decision-subtitle">
            Smart Technical Analysis Report
          </p>
        </div>

        <div className="itdp-symbol-badge">
          {symbol}
        </div>
      </div>

      {/* ========================================
          SUMMARY
      ======================================== */}

      <div className="itdp-analysis-grid">
        {/* STOCK */}

        <div className="itdp-analysis-item">
          <span className="itdp-analysis-label">
            Stock
          </span>

          <strong className="itdp-analysis-value">
            {symbol}
          </strong>
        </div>

        {/* DECISION */}

        <div className="itdp-analysis-item">
          <span className="itdp-analysis-label">
            Decision
          </span>

          <span
            className="itdp-decision-badge"
            style={{
              background: decisionColor,
            }}
          >
            {decision}
          </span>
        </div>

        {/* CONFIDENCE */}

        <div className="itdp-analysis-item">
          <span className="itdp-analysis-label">
            Confidence
          </span>

          <div className="itdp-confidence-wrapper">
            <div className="itdp-confidence-bar">
              <div
                className="itdp-confidence-fill"
                style={{
                  width: `${Math.min(
                    Math.max(confidence, 0),
                    100
                  )}%`,
                }}
              />
            </div>

            <strong>
              {confidence}%
            </strong>
          </div>
        </div>

        {/* RISK */}

        <div className="itdp-analysis-item">
          <span className="itdp-analysis-label">
            Risk
          </span>

          <strong className="itdp-analysis-value">
            {risk}
          </strong>
        </div>

        {/* TARGET */}

        <div className="itdp-analysis-item">
          <span className="itdp-analysis-label">
            Target
          </span>

          <strong className="itdp-target">
            {formatMoney(target)}
          </strong>
        </div>

        {/* STOP LOSS */}

        <div className="itdp-analysis-item">
          <span className="itdp-analysis-label">
            Stop Loss
          </span>

          <strong className="itdp-stoploss">
            {formatMoney(stopLoss)}
          </strong>
        </div>
      </div>

      {/* ========================================
          SEPARATOR
      ======================================== */}

      <div className="itdp-divider" />

      {/* ========================================
          AI EXPLANATION
      ======================================== */}

      <section>
        <h3 className="itdp-section-title">
          AI Explanation
        </h3>

        <div className="itdp-reasons">
          {reasons.length > 0 ? (
            reasons.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="itdp-reason"
              >
                <span className="itdp-check">
                  ✓
                </span>

                <span className="itdp-reason-text">
                  {item}
                </span>
              </div>
            ))
          ) : (
            <div className="itdp-reason">
              <span className="itdp-reason-text">
                No technical explanation available.
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ========================================
          INVALID IF
      ======================================== */}

      <section className="itdp-invalid-section">
        <h3 className="itdp-section-title">
          Invalid If
        </h3>

        <div className="itdp-invalid-box">
          <span className="itdp-invalid-icon">
            ✕
          </span>

          <span>
            {invalidIf || "-"}
          </span>
        </div>
      </section>

      {/* ========================================
          RESPONSIVE CSS
      ======================================== */}

      <style jsx>{`
        .itdp-decision-card {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;

          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 12px;

          padding: 24px;
          margin-top: 25px;

          color: white;

          overflow: hidden;
        }

        /* ======================================
           HEADER
        ====================================== */

        .itdp-decision-header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          gap: 15px;

          margin-bottom: 22px;
        }

        .itdp-decision-title {
          margin: 0;

          font-size: 20px;
          font-weight: 600;
        }

        .itdp-decision-subtitle {
          margin: 6px 0 0;

          color: #94a3b8;

          font-size: 13px;
        }

        .itdp-symbol-badge {
          background: #0f172a;

          border: 1px solid #334155;

          border-radius: 8px;

          padding: 10px 14px;

          font-size: 13px;
          font-weight: 600;

          white-space: nowrap;
        }

        /* ======================================
           ANALYSIS GRID
        ====================================== */

        .itdp-analysis-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 12px;
        }

        .itdp-analysis-item {
          min-width: 0;

          background: #172033;

          border: 1px solid #334155;

          border-radius: 9px;

          padding: 13px;
        }

        .itdp-analysis-label {
          display: block;

          color: #94a3b8;

          font-size: 12px;

          margin-bottom: 7px;
        }

        .itdp-analysis-value {
          display: block;

          font-size: 15px;

          word-break: break-word;
        }

        /* ======================================
           DECISION
        ====================================== */

        .itdp-decision-badge {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          min-width: 62px;

          padding: 5px 12px;

          border-radius: 999px;

          color: white;

          font-size: 12px;

          font-weight: 700;
        }

        /* ======================================
           CONFIDENCE
        ====================================== */

        .itdp-confidence-wrapper {
          display: flex;

          align-items: center;

          gap: 10px;

          width: 100%;
        }

        .itdp-confidence-bar {
          flex: 1;

          height: 8px;

          background: #334155;

          border-radius: 999px;

          overflow: hidden;
        }

        .itdp-confidence-fill {
          height: 100%;

          background: #f59e0b;

          border-radius: 999px;

          transition: width 0.3s ease;
        }

        /* ======================================
           TARGET / STOP LOSS
        ====================================== */

        .itdp-target {
          color: #22c55e;

          font-size: 15px;
        }

        .itdp-stoploss {
          color: #ef4444;

          font-size: 15px;
        }

        /* ======================================
           DIVIDER
        ====================================== */

        .itdp-divider {
          height: 1px;

          background: #334155;

          margin: 22px 0;
        }

        /* ======================================
           SECTION TITLE
        ====================================== */

        .itdp-section-title {
          margin: 0 0 12px;

          font-size: 16px;

          font-weight: 600;
        }

        /* ======================================
           REASONS
        ====================================== */

        .itdp-reasons {
          display: flex;

          flex-direction: column;

          gap: 8px;
        }

        .itdp-reason {
          display: flex;

          align-items: flex-start;

          gap: 8px;

          min-width: 0;

          background: #172033;

          border-radius: 7px;

          padding: 9px 10px;

          font-size: 13px;

          line-height: 1.4;
        }

        .itdp-check {
          flex-shrink: 0;

          color: #22c55e;

          font-weight: 700;
        }

        .itdp-reason-text {
          min-width: 0;

          overflow-wrap: anywhere;

          word-break: break-word;
        }

        /* ======================================
           INVALID IF
        ====================================== */

        .itdp-invalid-section {
          margin-top: 20px;
        }

        .itdp-invalid-box {
          display: flex;

          align-items: flex-start;

          gap: 9px;

          background: rgba(239, 68, 68, 0.08);

          border: 1px solid
            rgba(239, 68, 68, 0.3);

          border-radius: 8px;

          padding: 11px;

          color: #f8fafc;

          font-size: 13px;

          line-height: 1.4;

          overflow-wrap: anywhere;
        }

        .itdp-invalid-icon {
          flex-shrink: 0;

          color: #ef4444;

          font-weight: 700;
        }

        /* ======================================
           TABLET
        ====================================== */

        @media (max-width: 768px) {
          .itdp-decision-card {
            padding: 18px;

            margin-top: 18px;

            border-radius: 10px;
          }

          .itdp-decision-header {
            align-items: flex-start;
          }

          .itdp-decision-title {
            font-size: 18px;
          }

          .itdp-analysis-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap: 9px;
          }

          .itdp-analysis-item {
            padding: 11px;
          }
        }

        /* ======================================
           MOBILE
        ====================================== */

        @media (max-width: 480px) {
          .itdp-decision-card {
            padding: 14px;

            margin-top: 15px;
          }

          .itdp-decision-header {
            flex-direction: column;

            align-items: stretch;

            gap: 10px;
          }

          .itdp-decision-title {
            font-size: 17px;
          }

          .itdp-decision-subtitle {
            font-size: 12px;
          }

          .itdp-symbol-badge {
            width: fit-content;

            padding: 7px 10px;
          }

          .itdp-analysis-grid {
            grid-template-columns: 1fr;

            gap: 8px;
          }

          .itdp-analysis-item {
            padding: 11px;
          }

          .itdp-analysis-label {
            font-size: 11px;
          }

          .itdp-analysis-value {
            font-size: 14px;
          }

          .itdp-section-title {
            font-size: 15px;
          }

          .itdp-reason {
            font-size: 12px;

            padding: 8px;
          }

          .itdp-invalid-box {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
"use client";

import type {
  AnalysisResult,
} from "../types/analysis";

type FullAnalysisPageProps = {
  analysis: AnalysisResult;
  language: "en" | "mr";
  onBack: () => void;
};

export default function FullAnalysisPage({
  analysis,
  language,
  onBack,
}: FullAnalysisPageProps) {
  const label = (
    english: string,
    marathi: string
  ) => {
    return language === "mr"
      ? marathi
      : english;
  };

  const formatMoney = (
    value: number | null
  ) => {
    if (
      value === null ||
      !Number.isFinite(value) ||
      value <= 0
    ) {
      return "-";
    }

    return `${String.fromCharCode(
      0x20b9
    )}${value.toFixed(2)}`;
  };

  const formatText = (
    value: string | null | undefined
  ) => {
    if (!value) {
      return "-";
    }

    return value
      .replaceAll("_", " ")
      .trim();
  };

  const decisionColor =
    analysis.decision === "BUY"
      ? "#22c55e"
      : analysis.decision === "SELL"
      ? "#ef4444"
      : "#f59e0b";

  const riskColor =
    analysis.risk === "LOW"
      ? "#22c55e"
      : analysis.risk === "HIGH"
      ? "#ef4444"
      : "#f59e0b";

  const gateColor =
    analysis.riskGate.status === "PASS"
      ? "#22c55e"
      : analysis.riskGate.status === "BLOCK"
      ? "#ef4444"
      : "#f59e0b";

  const entryContextColor =
    analysis.entryContext === "FAVORABLE"
      ? "#22c55e"
      : analysis.entryContext ===
        "UNFAVORABLE"
      ? "#ef4444"
      : "#f59e0b";

  const actionTitle =
    analysis.riskGate.status === "PASS"
      ? label(
          "Trade conditions are acceptable",
          "à¤Ÿà¥à¤°à¥‡à¤¡à¤šà¥à¤¯à¤¾ à¤…à¤Ÿà¥€ à¤…à¤¨à¥à¤•à¥‚à¤² à¤†à¤¹à¥‡à¤¤"
        )
      : analysis.riskGate.status ===
        "CAUTION"
      ? label(
          "Proceed with caution",
          "à¤¸à¤¾à¤µà¤§à¤—à¤¿à¤°à¥€à¤¨à¥‡ à¤ªà¥à¤¢à¥‡ à¤œà¤¾"
        )
      : label(
          "Do not execute this trade",
          "à¤¹à¤¾ à¤Ÿà¥à¤°à¥‡à¤¡ à¤¸à¤§à¥à¤¯à¤¾ à¤•à¤°à¥‚ à¤¨à¤•à¤¾"
        );
          const consumerExplanation =
    analysis.decision === "HOLD" &&
    analysis.entryContext === "UNFAVORABLE"
      ? label(
          "Market evidence may point in a direction, but a safe executable entry is not available right now. The entry context is unfavorable, so the system is keeping the decision at HOLD.",
          "à¤®à¤¾à¤°à¥à¤•à¥‡à¤Ÿà¤šà¥‡ à¤¸à¤‚à¤•à¥‡à¤¤ à¤à¤•à¤¾ à¤¦à¤¿à¤¶à¥‡à¤•à¤¡à¥‡ à¤…à¤¸à¤²à¥‡ à¤¤à¤°à¥€ à¤¸à¤§à¥à¤¯à¤¾ à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤à¤ªà¤£à¥‡ à¤Ÿà¥à¤°à¥‡à¤¡ à¤˜à¥‡à¤£à¥à¤¯à¤¾à¤¸à¤¾à¤ à¥€ à¤¯à¥‹à¤—à¥à¤¯ à¤à¤‚à¤Ÿà¥à¤°à¥€ à¤‰à¤ªà¤²à¤¬à¥à¤§ à¤¨à¤¾à¤¹à¥€. à¤à¤‚à¤Ÿà¥à¤°à¥€à¤šà¥€ à¤¸à¥à¤¥à¤¿à¤¤à¥€ à¤ªà¥à¤°à¤¤à¤¿à¤•à¥‚à¤² à¤…à¤¸à¤²à¥à¤¯à¤¾à¤®à¥à¤³à¥‡ à¤¸à¤¿à¤¸à¥à¤Ÿà¥€à¤®à¤¨à¥‡ à¤¨à¤¿à¤°à¥à¤£à¤¯ HOLD à¤ à¥‡à¤µà¤²à¤¾ à¤†à¤¹à¥‡."
        )
      : analysis.decision === "HOLD"
      ? label(
          "The available evidence is not strong enough for a safe executable trade. Waiting is the current decision.",
          "à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤à¤ªà¤£à¥‡ à¤Ÿà¥à¤°à¥‡à¤¡ à¤˜à¥‡à¤£à¥à¤¯à¤¾à¤¸à¤¾à¤ à¥€ à¤‰à¤ªà¤²à¤¬à¥à¤§ à¤ªà¥à¤°à¤¾à¤µà¥‡ à¤ªà¥à¤°à¥‡à¤¸à¥‡ à¤®à¤œà¤¬à¥‚à¤¤ à¤¨à¤¾à¤¹à¥€à¤¤. à¤¤à¥à¤¯à¤¾à¤®à¥à¤³à¥‡ à¤¸à¤§à¥à¤¯à¤¾ à¤ªà¥à¤°à¤¤à¥€à¤•à¥à¤·à¤¾ à¤•à¤°à¤£à¥‡ à¤¹à¤¾ à¤¨à¤¿à¤°à¥à¤£à¤¯ à¤†à¤¹à¥‡."
        )
      : analysis.riskGate.status === "BLOCK"
      ? label(
          "A directional decision exists, but one or more critical execution conditions have failed. The trade should not be executed.",
          "à¤¦à¤¿à¤¶à¤¾à¤¤à¥à¤®à¤• à¤¨à¤¿à¤°à¥à¤£à¤¯ à¤‰à¤ªà¤²à¤¬à¥à¤§ à¤†à¤¹à¥‡, à¤ªà¤£ à¤Ÿà¥à¤°à¥‡à¤¡ à¤•à¤°à¤£à¥à¤¯à¤¾à¤¸à¤¾à¤ à¥€ à¤†à¤µà¤¶à¥à¤¯à¤• à¤à¤• à¤•à¤¿à¤‚à¤µà¤¾ à¤…à¤§à¤¿à¤• à¤®à¤¹à¤¤à¥à¤¤à¥à¤µà¤¾à¤šà¥à¤¯à¤¾ à¤…à¤Ÿà¥€ à¤ªà¥‚à¤°à¥à¤£ à¤à¤¾à¤²à¥‡à¤²à¥à¤¯à¤¾ à¤¨à¤¾à¤¹à¥€à¤¤. à¤¤à¥à¤¯à¤¾à¤®à¥à¤³à¥‡ à¤Ÿà¥à¤°à¥‡à¤¡ à¤•à¤°à¥‚ à¤¨à¤¯à¥‡."
        )
      : analysis.riskGate.status === "CAUTION"
      ? label(
          "A trade setup exists, but the system has detected conditions that require additional caution before execution.",
          "à¤Ÿà¥à¤°à¥‡à¤¡à¤šà¥€ à¤¸à¤‚à¤§à¥€ à¤‰à¤ªà¤²à¤¬à¥à¤§ à¤†à¤¹à¥‡, à¤ªà¤£ à¤Ÿà¥à¤°à¥‡à¤¡ à¤•à¤°à¤£à¥à¤¯à¤¾à¤ªà¥‚à¤°à¥à¤µà¥€ à¤…à¤§à¤¿à¤• à¤¸à¤¾à¤µà¤§à¤—à¤¿à¤°à¥€ à¤†à¤µà¤¶à¥à¤¯à¤• à¤…à¤¸à¤²à¥‡à¤²à¥à¤¯à¤¾ à¤…à¤Ÿà¥€ à¤¸à¤¿à¤¸à¥à¤Ÿà¥€à¤®à¤¨à¥‡ à¤“à¤³à¤–à¤²à¥à¤¯à¤¾ à¤†à¤¹à¥‡à¤¤."
        )
      : label(
          "The directional decision and critical execution conditions are currently aligned.",
          "à¤¦à¤¿à¤¶à¤¾à¤¤à¥à¤®à¤• à¤¨à¤¿à¤°à¥à¤£à¤¯ à¤†à¤£à¤¿ à¤Ÿà¥à¤°à¥‡à¤¡ à¤•à¤°à¤£à¥à¤¯à¤¾à¤¸à¤¾à¤ à¥€ à¤†à¤µà¤¶à¥à¤¯à¤• à¤®à¤¹à¤¤à¥à¤¤à¥à¤µà¤¾à¤šà¥à¤¯à¤¾ à¤…à¤Ÿà¥€ à¤¸à¤§à¥à¤¯à¤¾ à¤à¤•à¤®à¥‡à¤•à¤¾à¤‚à¤¶à¥€ à¤¸à¥à¤¸à¤‚à¤—à¤¤ à¤†à¤¹à¥‡à¤¤."
        );
          const primaryFailures =
    analysis.riskGate.failures.filter(
      (failure) =>
        failure.includes(
          "Final decision is HOLD"
        ) ||
        failure.includes(
          "Entry context is UNFAVORABLE"
        ) ||
        failure.includes(
          "High conflict"
        ) ||
        failure.includes(
          "Decision reliability is LOW"
        ) ||
        failure.includes(
          "Entry price is invalid"
        )
    );

  const executionConsequences =
    analysis.riskGate.failures.filter(
      (failure) =>
        !primaryFailures.includes(failure)
    );

  return (
    <section className="itdp-full-analysis-page">
      {/* BACK */}
      <button
        type="button"
        className="itdp-full-back"
        onClick={onBack}
      >
        {"\u2190"}{" "}
        {label(
          "Back to Dashboard",
          "à¤¡à¥…à¤¶à¤¬à¥‹à¤°à¥à¤¡à¤µà¤° à¤ªà¤°à¤¤ à¤œà¤¾"
        )}
      </button>

      {/* PAGE HEADER */}
      <div className="itdp-full-page-header">
        <div>
          <div className="itdp-full-eyebrow">
            {analysis.symbol}
          </div>

          <h1 className="itdp-full-title">
            {label(
              "AI Full Analysis",
              "AI à¤¸à¤‚à¤ªà¥‚à¤°à¥à¤£ à¤µà¤¿à¤¶à¥à¤²à¥‡à¤·à¤£"
            )}
          </h1>

          <p className="itdp-full-subtitle">
            {label(
              "Decision intelligence, trade levels and risk controls in one view.",
              "à¤¨à¤¿à¤°à¥à¤£à¤¯, à¤Ÿà¥à¤°à¥‡à¤¡ à¤ªà¤¾à¤¤à¤³à¥à¤¯à¤¾ à¤†à¤£à¤¿ à¤œà¥‹à¤–à¥€à¤® à¤¨à¤¿à¤¯à¤‚à¤¤à¥à¤°à¤£ à¤à¤•à¤¾à¤š à¤ à¤¿à¤•à¤¾à¤£à¥€."
            )}
          </p>
        </div>
      </div>

      {/* HERO */}
      <div className="itdp-full-hero">
        <div className="itdp-full-hero-main">
          <span className="itdp-full-section-label">
            {label(
              "Final Decision",
              "à¤…à¤‚à¤¤à¤¿à¤® à¤¨à¤¿à¤°à¥à¤£à¤¯"
            )}
          </span>

          <strong
            className="itdp-full-decision"
            style={{
              color: decisionColor,
            }}
          >
            {analysis.decision}
          </strong>
        </div>

        <Metric
          label={label(
            "Confidence",
            "à¤µà¤¿à¤¶à¥à¤µà¤¾à¤¸"
          )}
          value={`${analysis.confidence}%`}
        />

        <Metric
          label={label(
            "Risk",
            "à¤œà¥‹à¤–à¥€à¤®"
          )}
          value={analysis.risk}
          color={riskColor}
        />

        <Metric
          label={label(
            "Entry Context",
            "à¤à¤‚à¤Ÿà¥à¤°à¥€ à¤¸à¥à¤¥à¤¿à¤¤à¥€"
          )}
          value={formatText(
            analysis.entryContext
          )}
          color={entryContextColor}
        />
      </div>

      {/* ACTIONABILITY */}
      <div
        className="itdp-full-action-card"
        style={{
          borderColor: gateColor,
        }}
      >
        <div>
          <span className="itdp-full-section-label">
            {label(
              "Can I act now?",
              "à¤†à¤¤à¥à¤¤à¤¾ à¤Ÿà¥à¤°à¥‡à¤¡ à¤•à¤°à¤¤à¤¾ à¤¯à¥‡à¤ˆà¤²?"
            )}
          </span>

          <div className="itdp-full-action-line">
            <strong
              className="itdp-full-gate-status"
              style={{
                color: gateColor,
              }}
            >
              {analysis.riskGate.status}
            </strong>

            <span className="itdp-full-action-title">
              {actionTitle}
            </span>
          </div>
        </div>

                <div className="itdp-full-action-explanation">
          <strong>
            {label(
              "Why?",
              "à¤•à¤¾?"
            )}
          </strong>
<p>
  {consumerExplanation}
</p>

{analysis.riskGate.warnings.length > 0 && (
  <div className="itdp-full-gate-list">
    <strong>
      {label(
        "Specific risk warnings",
        "à¤µà¤¿à¤¶à¤¿à¤·à¥à¤Ÿ à¤œà¥‹à¤–à¥€à¤® à¤¸à¥‚à¤šà¤¨à¤¾"
      )}
    </strong>

    <ul>
      {analysis.riskGate.warnings.map(
        (warning, index) => (
          <li key={`${warning}-${index}`}>
            {warning}
          </li>
        )
      )}
    </ul>
  </div>
)}

{analysis.riskGate.failures.length > 0 && (
  <div className="itdp-full-gate-list">
    <strong>
      {label(
        "Critical failures",
        "à¤—à¤‚à¤­à¥€à¤° à¤…à¤¡à¤¥à¤³à¥‡"
      )}
    </strong>

    <ul>
      {analysis.riskGate.failures.map(
        (failure, index) => (
          <li key={`${failure}-${index}`}>
            {failure}
          </li>
        )
      )}
    </ul>
  </div>
)}

<span>
  {analysis.riskGate.reason}
</span>

        </div>
      </div>

      {/* DECISION INTELLIGENCE */}
      <Section
        title={label(
          "Decision Intelligence",
          "à¤¨à¤¿à¤°à¥à¤£à¤¯ à¤¬à¥à¤¦à¥à¤§à¤¿à¤®à¤¤à¥à¤¤à¤¾"
        )}
        subtitle={label(
          "How strong and dependable is the current decision?",
          "à¤¸à¤§à¥à¤¯à¤¾à¤šà¤¾ à¤¨à¤¿à¤°à¥à¤£à¤¯ à¤•à¤¿à¤¤à¥€ à¤®à¤œà¤¬à¥‚à¤¤ à¤†à¤£à¤¿ à¤µà¤¿à¤¶à¥à¤µà¤¾à¤¸à¤¾à¤°à¥à¤¹ à¤†à¤¹à¥‡?"
        )}
      >
        <div className="itdp-full-grid itdp-full-grid-4">
          <MetricCard
            label={label(
              "Strength",
              "à¤¨à¤¿à¤°à¥à¤£à¤¯à¤¾à¤šà¥€ à¤¤à¤¾à¤•à¤¦"
            )}
            value={formatText(
              analysis.decisionStrength
            )}
          />

          <MetricCard
            label={label(
              "Quality",
              "à¤¨à¤¿à¤°à¥à¤£à¤¯à¤¾à¤šà¥€ à¤—à¥à¤£à¤µà¤¤à¥à¤¤à¤¾"
            )}
            value={formatText(
              analysis.decisionQuality
            )}
          />

          <MetricCard
            label={label(
              "Reliability",
              "à¤µà¤¿à¤¶à¥à¤µà¤¾à¤¸à¤¾à¤°à¥à¤¹à¤¤à¤¾"
            )}
            value={formatText(
              analysis.decisionReliability
            )}
          />

          <MetricCard
            label={label(
              "Evidence Conflict",
              "à¤ªà¥à¤°à¤¾à¤µà¥à¤¯à¤¾à¤¤à¥€à¤² à¤¸à¤‚à¤˜à¤°à¥à¤·"
            )}
            value={formatText(
              analysis.conflictSeverity
            )}
          />
        </div>
      </Section>

      {/* TRADE LEVELS */}
      <Section
        title={label(
          "Trade Levels",
          "à¤Ÿà¥à¤°à¥‡à¤¡ à¤ªà¤¾à¤¤à¤³à¥à¤¯à¤¾"
        )}
        subtitle={label(
          "Price levels produced by the current analysis.",
          "à¤¸à¤§à¥à¤¯à¤¾à¤šà¥à¤¯à¤¾ à¤µà¤¿à¤¶à¥à¤²à¥‡à¤·à¤£à¤¾à¤¤à¥‚à¤¨ à¤®à¤¿à¤³à¤¾à¤²à¥‡à¤²à¥à¤¯à¤¾ à¤•à¤¿à¤‚à¤®à¤¤ à¤ªà¤¾à¤¤à¤³à¥à¤¯à¤¾."
        )}
      >
        <div className="itdp-full-grid itdp-full-grid-4">
          <MetricCard
            label={label(
              "Entry",
              "à¤à¤‚à¤Ÿà¥à¤°à¥€"
            )}
            value={formatMoney(
              analysis.entry
            )}
          />

          <MetricCard
            label={label(
              "Target 1",
              "à¤²à¤•à¥à¤·à¥à¤¯ 1"
            )}
            value={formatMoney(
              analysis.target1
            )}
          />

          <MetricCard
            label={label(
              "Target 2",
              "à¤²à¤•à¥à¤·à¥à¤¯ 2"
            )}
            value={formatMoney(
              analysis.target2
            )}
          />

          <MetricCard
            label={label(
              "Stop Loss",
              "à¤¸à¥à¤Ÿà¥‰à¤ª à¤²à¥‰à¤¸"
            )}
            value={formatMoney(
              analysis.stopLoss
            )}
          />
        </div>
      </Section>

      {/* RISK & POSITION */}
      <Section
        title={label(
          "Risk & Position",
          "à¤œà¥‹à¤–à¥€à¤® à¤†à¤£à¤¿ à¤ªà¥‹à¤à¤¿à¤¶à¤¨"
        )}
        subtitle={label(
          "Capital exposure and position sizing from the risk engine.",
          "à¤°à¤¿à¤¸à¥à¤• à¤‡à¤‚à¤œà¤¿à¤¨à¤¨à¥à¤¸à¤¾à¤° à¤­à¤¾à¤‚à¤¡à¤µà¤² à¤†à¤£à¤¿ à¤ªà¥‹à¤à¤¿à¤¶à¤¨ à¤¸à¤¾à¤‡à¤œ."
        )}
      >
        <div className="itdp-full-grid itdp-full-grid-5">
          <MetricCard
            label={label(
              "Risk : Reward",
              "à¤œà¥‹à¤–à¥€à¤® : à¤ªà¤°à¤¤à¤¾à¤µà¤¾"
            )}
            value={
              analysis.riskReward || "-"
            }
          />

          <MetricCard
            label={label(
              "Capital",
              "à¤­à¤¾à¤‚à¤¡à¤µà¤²"
            )}
            value={formatMoney(
              analysis.capital
            )}
          />

          <MetricCard
            label={label(
              "Risk %",
              "à¤œà¥‹à¤–à¥€à¤® %"
            )}
            value={`${analysis.riskPercent}%`}
          />

          <MetricCard
            label={label(
              "Maximum Risk",
              "à¤•à¤®à¤¾à¤² à¤œà¥‹à¤–à¥€à¤®"
            )}
            value={formatMoney(
              analysis.maxRisk
            )}
          />

          <MetricCard
            label={label(
              "Quantity",
              "à¤¶à¥‡à¤…à¤°à¥à¤¸à¤šà¥€ à¤¸à¤‚à¤–à¥à¤¯à¤¾"
            )}
            value={
              analysis.quantity > 0
                ? `${analysis.quantity}`
                : "-"
            }
          />
        </div>
      </Section>

      {/* MARKET STRUCTURE */}
      <Section
        title={label(
          "Market Structure",
          "à¤®à¤¾à¤°à¥à¤•à¥‡à¤Ÿ à¤¸à¥à¤Ÿà¥à¤°à¤•à¥à¤šà¤°"
        )}
        subtitle={label(
          "Important support and resistance levels.",
          "à¤®à¤¹à¤¤à¥à¤¤à¥à¤µà¤¾à¤šà¥à¤¯à¤¾ à¤¸à¤ªà¥‹à¤°à¥à¤Ÿ à¤†à¤£à¤¿ à¤°à¥‡à¤à¤¿à¤¸à¥à¤Ÿà¤¨à¥à¤¸ à¤ªà¤¾à¤¤à¤³à¥à¤¯à¤¾."
        )}
      >
        <div className="itdp-full-grid itdp-full-grid-4">
          <MetricCard
            label={label(
              "Support 1",
              "à¤¸à¤ªà¥‹à¤°à¥à¤Ÿ 1"
            )}
            value={formatMoney(
              analysis.support1
            )}
          />

          <MetricCard
            label={label(
              "Support 2",
              "à¤¸à¤ªà¥‹à¤°à¥à¤Ÿ 2"
            )}
            value={formatMoney(
              analysis.support2
            )}
          />

          <MetricCard
            label={label(
              "Resistance 1",
              "à¤°à¥‡à¤à¤¿à¤¸à¥à¤Ÿà¤¨à¥à¤¸ 1"
            )}
            value={formatMoney(
              analysis.resistance1
            )}
          />

          <MetricCard
            label={label(
              "Resistance 2",
              "à¤°à¥‡à¤à¤¿à¤¸à¥à¤Ÿà¤¨à¥à¤¸ 2"
            )}
            value={formatMoney(
              analysis.resistance2
            )}
          />
        </div>
      </Section>

      {/* WHY */}
      <Section
        title={label(
          "Why this decision?",
          "à¤¹à¤¾ à¤¨à¤¿à¤°à¥à¤£à¤¯ à¤•à¤¾?"
        )}
        subtitle={label(
          "Evidence used by the decision engine.",
          "à¤¨à¤¿à¤°à¥à¤£à¤¯ à¤‡à¤‚à¤œà¤¿à¤¨à¤¨à¥‡ à¤µà¤¾à¤ªà¤°à¤²à¥‡à¤²à¥‡ à¤ªà¥à¤°à¤¾à¤µà¥‡."
        )}
      >
        {analysis.reasons.length > 0 ? (
          <div className="itdp-full-list">
            {analysis.reasons.map(
              (reason, index) => (
                <div
                  className="itdp-full-list-item"
                  key={`${reason}-${index}`}
                >
                  <span className="itdp-full-list-dot">
                    {index + 1}
                  </span>

                  <span>{reason}</span>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="itdp-full-empty">
            -
          </p>
        )}
      </Section>

      {/* INVALIDATION */}
      <Section
        title={label(
          "When does this decision become invalid?",
          "à¤¹à¤¾ à¤¨à¤¿à¤°à¥à¤£à¤¯ à¤•à¤§à¥€ à¤…à¤®à¤¾à¤¨à¥à¤¯ à¤¹à¥‹à¤ˆà¤²?"
        )}
        subtitle={label(
          "Conditions that invalidate the current decision.",
          "à¤¸à¤§à¥à¤¯à¤¾à¤šà¤¾ à¤¨à¤¿à¤°à¥à¤£à¤¯ à¤…à¤®à¤¾à¤¨à¥à¤¯ à¤•à¤°à¤£à¤¾à¤±à¥à¤¯à¤¾ à¤…à¤Ÿà¥€."
        )}
      >
        <div className="itdp-full-invalidation">
          {analysis.invalidIf || "-"}
        </div>
      </Section>

      {/* RISK GATE */}
      <Section
        title={label(
          "Risk Gate",
          "à¤°à¤¿à¤¸à¥à¤• à¤—à¥‡à¤Ÿ"
        )}
        subtitle={label(
          "Final execution safety check.",
          "à¤Ÿà¥à¤°à¥‡à¤¡ à¤•à¤°à¤£à¥à¤¯à¤¾à¤ªà¥‚à¤°à¥à¤µà¥€à¤šà¥€ à¤…à¤‚à¤¤à¤¿à¤® à¤¸à¥à¤°à¤•à¥à¤·à¤¾ à¤¤à¤ªà¤¾à¤¸à¤£à¥€."
        )}
      >
        <div className="itdp-full-risk-gate">
          <div className="itdp-full-risk-gate-header">
            <span>
              {label(
                "Status",
                "à¤¸à¥à¤¥à¤¿à¤¤à¥€"
              )}
            </span>

            <strong
              style={{
                color: gateColor,
              }}
            >
              {analysis.riskGate.status}
            </strong>
          </div>

          <p className="itdp-full-risk-gate-reason">
            {analysis.riskGate.reason}
          </p>

                    {primaryFailures.length > 0 && (
            <GateList
              title={label(
                "Why execution is blocked",
                "à¤Ÿà¥à¤°à¥‡à¤¡ à¤•à¤¾ à¤¥à¤¾à¤‚à¤¬à¤µà¤²à¤¾ à¤†à¤¹à¥‡?"
              )}
              items={primaryFailures}
            />
          )}

          {executionConsequences.length >
            0 && (
            <GateList
              title={label(
                "Execution consequences",
                "à¤¤à¥à¤¯à¤¾à¤®à¥à¤³à¥‡ à¤‰à¤ªà¤²à¤¬à¥à¤§ à¤¨à¤¸à¤²à¥‡à¤²à¥à¤¯à¤¾ à¤Ÿà¥à¤°à¥‡à¤¡ à¤…à¤Ÿà¥€"
              )}
              items={executionConsequences}
            />
          )}

          {analysis.riskGate.warnings.length >
            0 && (
            <GateList
              title={label(
                "Warnings",
                "à¤¸à¤¾à¤µà¤§à¤—à¤¿à¤°à¥€à¤šà¥à¤¯à¤¾ à¤¸à¥‚à¤šà¤¨à¤¾"
              )}
              items={
                analysis.riskGate.warnings
              }
            />
          )}

          {analysis.riskGate.failures.length ===
            0 &&
            analysis.riskGate.warnings
              .length === 0 && (
              <div className="itdp-full-pass-message">
                {label(
                  "No critical failures or material warnings were reported.",
                  "à¤•à¥‹à¤£à¤¤à¥‡à¤¹à¥€ à¤—à¤‚à¤­à¥€à¤° à¤…à¤¡à¤¥à¤³à¥‡ à¤•à¤¿à¤‚à¤µà¤¾ à¤®à¤¹à¤¤à¥à¤¤à¥à¤µà¤¾à¤šà¥à¤¯à¤¾ à¤¸à¤¾à¤µà¤§à¤—à¤¿à¤°à¥€à¤šà¥à¤¯à¤¾ à¤¸à¥‚à¤šà¤¨à¤¾ à¤†à¤¢à¤³à¤²à¥à¤¯à¤¾ à¤¨à¤¾à¤¹à¥€à¤¤."
                )}
              </div>
            )}
        </div>
      </Section>

      {/* TRADE OUTLOOK */}
      <Section
        title={label(
          "Trade Outlook",
          "à¤Ÿà¥à¤°à¥‡à¤¡ à¤†à¤‰à¤Ÿà¤²à¥à¤•"
        )}
        subtitle={label(
          "Planning context generated from the current decision.",
          "à¤¸à¤§à¥à¤¯à¤¾à¤šà¥à¤¯à¤¾ à¤¨à¤¿à¤°à¥à¤£à¤¯à¤¾à¤µà¤° à¤†à¤§à¤¾à¤°à¤¿à¤¤ à¤Ÿà¥à¤°à¥‡à¤¡ à¤¨à¤¿à¤¯à¥‹à¤œà¤¨."
        )}
      >
        <div className="itdp-full-grid itdp-full-grid-2">
          <MetricCard
            label={label(
              "Trade Quality",
              "à¤Ÿà¥à¤°à¥‡à¤¡ à¤—à¥à¤£à¤µà¤¤à¥à¤¤à¤¾"
            )}
            value={
              analysis.tradeQuality || "-"
            }
          />

          <MetricCard
            label={label(
              "Holding Period",
              "à¤¹à¥‹à¤²à¥à¤¡à¤¿à¤‚à¤— à¤•à¤¾à¤²à¤¾à¤µà¤§à¥€"
            )}
            value={
              analysis.holdingPeriod || "-"
            }
          />
        </div>

        <div className="itdp-full-ai-summary">
          <span className="itdp-full-section-label">
            {label(
              "AI Summary",
              "AI à¤¸à¤¾à¤°à¤¾à¤‚à¤¶"
            )}
          </span>

          <p>
            {analysis.aiSummary || "-"}
          </p>
        </div>
      </Section>

      <button
        type="button"
        className="itdp-full-back itdp-full-bottom-back"
        onClick={onBack}
      >
        {"\u2190"}{" "}
        {label(
          "Back to Dashboard",
          "à¤¡à¥…à¤¶à¤¬à¥‹à¤°à¥à¤¡à¤µà¤° à¤ªà¤°à¤¤ à¤œà¤¾"
        )}
      </button>
    </section>
  );
}

type MetricProps = {
  label: string;
  value: string;
  color?: string;
};

function Metric({
  label,
  value,
  color,
}: MetricProps) {
  return (
    <div className="itdp-full-hero-metric">
      <span>{label}</span>

      <strong
        style={
          color
            ? {
                color,
              }
            : undefined
        }
      >
        {value}
      </strong>
    </div>
  );
}

function MetricCard({
  label,
  value,
}: MetricProps) {
  return (
    <div className="itdp-full-metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

type SectionProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

function Section({
  title,
  subtitle,
  children,
}: SectionProps) {
  return (
    <section className="itdp-full-section">
      <div className="itdp-full-section-header">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      {children}
    </section>
  );
}

type GateListProps = {
  title: string;
  items: string[];
};

function GateList({
  title,
  items,
}: GateListProps) {
  return (
    <div className="itdp-full-gate-list">
      <strong>{title}</strong>

      <ul>
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

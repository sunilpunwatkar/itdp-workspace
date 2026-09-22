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
          "ट्रेडच्या अटी अनुकूल आहेत"
        )
      : analysis.riskGate.status ===
        "CAUTION"
      ? label(
          "Proceed with caution",
          "सावधगिरीने पुढे जा"
        )
      : label(
          "Do not execute this trade",
          "हा ट्रेड सध्या करू नका"
        );
          const consumerExplanation =
    analysis.decision === "HOLD" &&
    analysis.entryContext === "UNFAVORABLE"
      ? label(
          "Market evidence may point in a direction, but a safe executable entry is not available right now. The entry context is unfavorable, so the system is keeping the decision at HOLD.",
          "मार्केटचे संकेत एका दिशेकडे असले तरी सध्या सुरक्षितपणे ट्रेड घेण्यासाठी योग्य एंट्री उपलब्ध नाही. एंट्रीची स्थिती प्रतिकूल असल्यामुळे सिस्टीमने निर्णय HOLD ठेवला आहे."
        )
      : analysis.decision === "HOLD"
      ? label(
          "The available evidence is not strong enough for a safe executable trade. Waiting is the current decision.",
          "सुरक्षितपणे ट्रेड घेण्यासाठी उपलब्ध पुरावे पुरेसे मजबूत नाहीत. त्यामुळे सध्या प्रतीक्षा करणे हा निर्णय आहे."
        )
      : analysis.riskGate.status === "BLOCK"
      ? label(
          "A directional decision exists, but one or more critical execution conditions have failed. The trade should not be executed.",
          "दिशात्मक निर्णय उपलब्ध आहे, पण ट्रेड करण्यासाठी आवश्यक एक किंवा अधिक महत्त्वाच्या अटी पूर्ण झालेल्या नाहीत. त्यामुळे ट्रेड करू नये."
        )
      : analysis.riskGate.status === "CAUTION"
      ? label(
          "A trade setup exists, but the system has detected conditions that require additional caution before execution.",
          "ट्रेडची संधी उपलब्ध आहे, पण ट्रेड करण्यापूर्वी अधिक सावधगिरी आवश्यक असलेल्या अटी सिस्टीमने ओळखल्या आहेत."
        )
      : label(
          "The directional decision and critical execution conditions are currently aligned.",
          "दिशात्मक निर्णय आणि ट्रेड करण्यासाठी आवश्यक महत्त्वाच्या अटी सध्या एकमेकांशी सुसंगत आहेत."
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
          "डॅशबोर्डवर परत जा"
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
              "AI संपूर्ण विश्लेषण"
            )}
          </h1>

          <p className="itdp-full-subtitle">
            {label(
              "Decision intelligence, trade levels and risk controls in one view.",
              "निर्णय, ट्रेड पातळ्या आणि जोखीम नियंत्रण एकाच ठिकाणी."
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
              "अंतिम निर्णय"
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
            "विश्वास"
          )}
          value={`${analysis.confidence}%`}
        />

        <Metric
          label={label(
            "Risk",
            "जोखीम"
          )}
          value={analysis.risk}
          color={riskColor}
        />

        <Metric
          label={label(
            "Entry Context",
            "एंट्री स्थिती"
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
              "आत्ता ट्रेड करता येईल?"
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
              "का?"
            )}
          </strong>

          <p>
            {consumerExplanation}
          </p>

          <span>
            {analysis.riskGate.reason}
          </span>
        </div>
      </div>

      {/* DECISION INTELLIGENCE */}
      <Section
        title={label(
          "Decision Intelligence",
          "निर्णय बुद्धिमत्ता"
        )}
        subtitle={label(
          "How strong and dependable is the current decision?",
          "सध्याचा निर्णय किती मजबूत आणि विश्वासार्ह आहे?"
        )}
      >
        <div className="itdp-full-grid itdp-full-grid-4">
          <MetricCard
            label={label(
              "Strength",
              "निर्णयाची ताकद"
            )}
            value={formatText(
              analysis.decisionStrength
            )}
          />

          <MetricCard
            label={label(
              "Quality",
              "निर्णयाची गुणवत्ता"
            )}
            value={formatText(
              analysis.decisionQuality
            )}
          />

          <MetricCard
            label={label(
              "Reliability",
              "विश्वासार्हता"
            )}
            value={formatText(
              analysis.decisionReliability
            )}
          />

          <MetricCard
            label={label(
              "Evidence Conflict",
              "पुराव्यातील संघर्ष"
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
          "ट्रेड पातळ्या"
        )}
        subtitle={label(
          "Price levels produced by the current analysis.",
          "सध्याच्या विश्लेषणातून मिळालेल्या किंमत पातळ्या."
        )}
      >
        <div className="itdp-full-grid itdp-full-grid-4">
          <MetricCard
            label={label(
              "Entry",
              "एंट्री"
            )}
            value={formatMoney(
              analysis.entry
            )}
          />

          <MetricCard
            label={label(
              "Target 1",
              "लक्ष्य 1"
            )}
            value={formatMoney(
              analysis.target1
            )}
          />

          <MetricCard
            label={label(
              "Target 2",
              "लक्ष्य 2"
            )}
            value={formatMoney(
              analysis.target2
            )}
          />

          <MetricCard
            label={label(
              "Stop Loss",
              "स्टॉप लॉस"
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
          "जोखीम आणि पोझिशन"
        )}
        subtitle={label(
          "Capital exposure and position sizing from the risk engine.",
          "रिस्क इंजिननुसार भांडवल आणि पोझिशन साइज."
        )}
      >
        <div className="itdp-full-grid itdp-full-grid-5">
          <MetricCard
            label={label(
              "Risk : Reward",
              "जोखीम : परतावा"
            )}
            value={
              analysis.riskReward || "-"
            }
          />

          <MetricCard
            label={label(
              "Capital",
              "भांडवल"
            )}
            value={formatMoney(
              analysis.capital
            )}
          />

          <MetricCard
            label={label(
              "Risk %",
              "जोखीम %"
            )}
            value={`${analysis.riskPercent}%`}
          />

          <MetricCard
            label={label(
              "Maximum Risk",
              "कमाल जोखीम"
            )}
            value={formatMoney(
              analysis.maxRisk
            )}
          />

          <MetricCard
            label={label(
              "Quantity",
              "शेअर्सची संख्या"
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
          "मार्केट स्ट्रक्चर"
        )}
        subtitle={label(
          "Important support and resistance levels.",
          "महत्त्वाच्या सपोर्ट आणि रेझिस्टन्स पातळ्या."
        )}
      >
        <div className="itdp-full-grid itdp-full-grid-4">
          <MetricCard
            label={label(
              "Support 1",
              "सपोर्ट 1"
            )}
            value={formatMoney(
              analysis.support1
            )}
          />

          <MetricCard
            label={label(
              "Support 2",
              "सपोर्ट 2"
            )}
            value={formatMoney(
              analysis.support2
            )}
          />

          <MetricCard
            label={label(
              "Resistance 1",
              "रेझिस्टन्स 1"
            )}
            value={formatMoney(
              analysis.resistance1
            )}
          />

          <MetricCard
            label={label(
              "Resistance 2",
              "रेझिस्टन्स 2"
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
          "हा निर्णय का?"
        )}
        subtitle={label(
          "Evidence used by the decision engine.",
          "निर्णय इंजिनने वापरलेले पुरावे."
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
          "हा निर्णय कधी अमान्य होईल?"
        )}
        subtitle={label(
          "Conditions that invalidate the current decision.",
          "सध्याचा निर्णय अमान्य करणाऱ्या अटी."
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
          "रिस्क गेट"
        )}
        subtitle={label(
          "Final execution safety check.",
          "ट्रेड करण्यापूर्वीची अंतिम सुरक्षा तपासणी."
        )}
      >
        <div className="itdp-full-risk-gate">
          <div className="itdp-full-risk-gate-header">
            <span>
              {label(
                "Status",
                "स्थिती"
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
                "ट्रेड का थांबवला आहे?"
              )}
              items={primaryFailures}
            />
          )}

          {executionConsequences.length >
            0 && (
            <GateList
              title={label(
                "Execution consequences",
                "त्यामुळे उपलब्ध नसलेल्या ट्रेड अटी"
              )}
              items={executionConsequences}
            />
          )}

          {analysis.riskGate.warnings.length >
            0 && (
            <GateList
              title={label(
                "Warnings",
                "सावधगिरीच्या सूचना"
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
                  "कोणतेही गंभीर अडथळे किंवा महत्त्वाच्या सावधगिरीच्या सूचना आढळल्या नाहीत."
                )}
              </div>
            )}
        </div>
      </Section>

      {/* TRADE OUTLOOK */}
      <Section
        title={label(
          "Trade Outlook",
          "ट्रेड आउटलुक"
        )}
        subtitle={label(
          "Planning context generated from the current decision.",
          "सध्याच्या निर्णयावर आधारित ट्रेड नियोजन."
        )}
      >
        <div className="itdp-full-grid itdp-full-grid-2">
          <MetricCard
            label={label(
              "Trade Quality",
              "ट्रेड गुणवत्ता"
            )}
            value={
              analysis.tradeQuality || "-"
            }
          />

          <MetricCard
            label={label(
              "Holding Period",
              "होल्डिंग कालावधी"
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
              "AI सारांश"
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
          "डॅशबोर्डवर परत जा"
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
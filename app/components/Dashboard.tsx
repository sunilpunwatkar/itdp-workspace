import DecisionSummaryCard from "./DecisionSummaryCard";

type DashboardProps = {
  analysis: {
    symbol: string;
    decision: string;
    confidence: number;
    risk: string;

    entry: number;

    target: number;
    target1: number;
    target2: number;

    stopLoss: number;

    support1: number | null;
    support2: number | null;

    resistance1: number | null;
    resistance2: number | null;

    tradeQuality: string;
    holdingPeriod: string;

    reasons: string[];
    invalidIf: string;
  };

  language: "en" | "mr";
};

export default function Dashboard({
  analysis,
  language,
}: DashboardProps) {
  return (
    <main className="itdp-dashboard">

      {/* ==============================
          TITLE
      ============================== */}

      {/* ==============================
          LIVE CHART
      ============================== */}

      

      {/* ==============================
          AI DECISION
      ============================== */}

<div className="itdp-decision-container">
  <DecisionSummaryCard
    key={analysis.symbol}
    symbol={analysis.symbol}
    decision={analysis.decision}
    confidence={analysis.confidence}
    risk={analysis.risk}
    target={analysis.target}
    stopLoss={analysis.stopLoss}
    language={language}
  />
</div>

    </main>
  );
}
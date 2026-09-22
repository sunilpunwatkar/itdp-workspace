import DecisionSummaryCard from "./DecisionSummaryCard";

type DashboardProps = {
  analysis: {
    symbol: string;
    decision: string;
    confidence: number;
    risk: string;

    entryContext:
      | "FAVORABLE"
      | "CAUTION"
      | "UNFAVORABLE";

    entry: number;

    target: number;
    target1: number;
    target2: number;

    stopLoss: number;

    support1: number | null;
    support2: number | null;

    resistance1: number | null;
    resistance2: number | null;

    riskReward: string;

    capital: number;
    riskPercent: number;
    maxRisk: number;
    quantity: number;

    riskGate: {
      status:
        | "PASS"
        | "CAUTION"
        | "BLOCK";
      reason: string;
      failures: string[];
      warnings: string[];
    };

    tradeQuality: string;
    holdingPeriod: string;

    reasons: string[];
    invalidIf: string;
  };

  language: "en" | "mr";
  onViewFullAnalysis: () => void;
};

export default function Dashboard({
  analysis,
  language,
  onViewFullAnalysis,
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
          entryContext={analysis.entryContext}
          riskGate={analysis.riskGate}
          entry={analysis.entry}
          riskReward={analysis.riskReward}
          maxRisk={analysis.maxRisk}
          quantity={analysis.quantity}
          target={analysis.target}
          stopLoss={analysis.stopLoss}
          language={language}
          onViewFullAnalysis={
            onViewFullAnalysis
          }
        />
      </div>
    </main>
  );
}
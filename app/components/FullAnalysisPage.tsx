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

  return (
    <section className="itdp-full-analysis">
      <button
        type="button"
        onClick={onBack}
      >
        ← {label(
          "Back to Dashboard",
          "डॅशबोर्डवर परत जा"
        )}
      </button>

      <div style={{ marginTop: "24px" }}>
        <h1>
          {label(
            "Full Analysis",
            "संपूर्ण विश्लेषण"
          )}
        </h1>

        <p>{analysis.symbol}</p>
      </div>
    </section>
  );
}
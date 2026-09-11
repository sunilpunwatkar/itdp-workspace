import type {
  AnalysisResult,
} from "../types/analysis";

import {
  calculateOpportunityRanking,
  OpportunityDecisionQuality,
  OpportunityDecisionStrength,
  OpportunityReliability,
} from "./opportunityRankingService";

import type {
  OpportunityCandidate,
} from "./opportunityDiscoveryService";

// ==================================================
// RISK / REWARD PARSER
// Example:
// "1 : 1.50" -> 1.5
// ==================================================

export function parseOpportunityRiskReward(
  riskReward: string
): number | null {
  const match =
    riskReward.match(
      /^\s*1\s*:\s*(\d+(?:\.\d+)?)\s*$/
    );

  if (!match) {
    return null;
  }

  const ratio =
    Number(match[1]);

  if (
    !Number.isFinite(ratio) ||
    ratio <= 0
  ) {
    return null;
  }

  return ratio;
}

// ==================================================
// DECISION STRENGTH VALIDATION
// ==================================================

function isDecisionStrength(
  value: string
): value is OpportunityDecisionStrength {
  return (
    value === "STRONG" ||
    value === "MODERATE" ||
    value === "WEAK"
  );
}

// ==================================================
// DECISION QUALITY VALIDATION
// ==================================================

function isDecisionQuality(
  value: string
): value is OpportunityDecisionQuality {
  return (
    value === "HIGH" ||
    value === "MEDIUM" ||
    value === "LOW"
  );
}

// ==================================================
// RELIABILITY VALIDATION
// ==================================================

function isReliability(
  value: string
): value is OpportunityReliability {
  return (
    value === "HIGH_RELIABILITY" ||
    value === "MODERATE_RELIABILITY" ||
    value === "REDUCED_RELIABILITY" ||
    value === "LOW_RELIABILITY"
  );
}

// ==================================================
// ANALYSIS -> OPPORTUNITY CANDIDATE
// ==================================================

export function buildOpportunityCandidateFromAnalysis(
  analysis: AnalysisResult
): OpportunityCandidate | null {
  // ------------------------------------------------
  // HOLD IS NEVER AN ACTIONABLE OPPORTUNITY
  // ------------------------------------------------

  if (
    analysis.decision !== "BUY" &&
    analysis.decision !== "SELL"
  ) {
    return null;
  }

  // ------------------------------------------------
  // VALIDATE FINAL DECISION INTELLIGENCE
  // ------------------------------------------------

  if (
    !isDecisionStrength(
      analysis.decisionStrength
    )
  ) {
    return null;
  }

  if (
    !isDecisionQuality(
      analysis.decisionQuality
    )
  ) {
    return null;
  }

  if (
    !isReliability(
      analysis.decisionReliability
    )
  ) {
    return null;
  }

  // ------------------------------------------------
  // PARSE RISK / REWARD
  // ------------------------------------------------

  const riskRewardRatio =
    parseOpportunityRiskReward(
      analysis.riskReward
    );

  if (riskRewardRatio === null) {
    return null;
  }

  // ------------------------------------------------
  // OPPORTUNITY RANKING
  // ------------------------------------------------

  const ranking =
    calculateOpportunityRanking({
      direction:
        analysis.decision,

      riskGateStatus:
        analysis.riskGate.status,

      entryContext:
        analysis.entryContext,

      decisionQuality:
        analysis.decisionQuality,

      decisionStrength:
        analysis.decisionStrength,

      reliability:
        analysis.decisionReliability,

      conflictSeverity:
        analysis.conflictSeverity,

      riskRewardRatio,
    });

  // ------------------------------------------------
  // DISCOVERY CANDIDATE
  // ------------------------------------------------

  return {
    symbol:
      analysis.symbol,

    decision:
      analysis.decision,

    entry:
      analysis.entry,

    stopLoss:
      analysis.stopLoss,

    target1:
      analysis.target1,

    target2:
      analysis.target2,

    riskRewardRatio,

    quantity:
      analysis.quantity,

    maxRisk:
      analysis.maxRisk,

    riskGateStatus:
      analysis.riskGate.status,

    opportunityScore:
      ranking.score,

    classification:
      ranking.classification,
  };
}
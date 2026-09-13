import type {
  OpportunityCandidate,
  OpportunityClassification,
  OpportunityDecision,
  OpportunityRiskGateStatus,
} from "./opportunityDiscoveryService";

export type OpportunityExperienceAction =
  | "TRADE"
  | "WATCH"
  | "AVOID";

export interface OpportunityExperienceItem {
  symbol: string;

  decision:
    OpportunityDecision;

  action:
    OpportunityExperienceAction;

  classification:
    OpportunityClassification;

  score:
    number;

  entry:
    number;

  stopLoss:
    number;

  target1:
    number;

  target2:
    number;

  quantity:
    number;

  maxRisk:
    number;

  riskRewardRatio:
    number;

  riskGateStatus:
    OpportunityRiskGateStatus;

  headline:
    string;

  riskMessage:
    string;
}

export interface OpportunityExperienceResult {
  totalOpportunities:
    number;

  tradeCount:
    number;

  watchCount:
    number;

  opportunities:
    OpportunityExperienceItem[];
}

function resolveAction(
  candidate:
    OpportunityCandidate
): OpportunityExperienceAction {
  if (
    candidate.riskGateStatus === "PASS" &&
    (
      candidate.classification === "PRIME" ||
      candidate.classification === "STRONG"
    )
  ) {
    return "TRADE";
  }

  if (
    candidate.riskGateStatus !== "BLOCK" &&
    candidate.classification !== "REJECT"
  ) {
    return "WATCH";
  }

  return "AVOID";
}

function buildHeadline(
  candidate:
    OpportunityCandidate,
  action:
    OpportunityExperienceAction
): string {
  if (action === "TRADE") {
    return candidate.decision === "BUY"
      ? `${candidate.symbol} has a validated BUY opportunity.`
      : `${candidate.symbol} has a validated SELL opportunity.`;
  }

  if (action === "WATCH") {
    return `${candidate.symbol} is worth watching, but conditions are not strong enough yet.`;
  }

  return `${candidate.symbol} does not currently meet ITDP trade conditions.`;
}

function buildRiskMessage(
  candidate:
    OpportunityCandidate
): string {
  if (
    candidate.riskGateStatus === "PASS"
  ) {
    return `Maximum planned risk is ₹${candidate.maxRisk}.`;
  }

  if (
    candidate.riskGateStatus === "CAUTION"
  ) {
    return "Risk conditions require caution before taking this trade.";
  }

  return "Risk Gate blocks this trade.";
}

export function buildOpportunityExperienceItem(
  candidate:
    OpportunityCandidate
): OpportunityExperienceItem {
  const action =
    resolveAction(
      candidate
    );

  return {
    symbol:
      candidate.symbol,

    decision:
      candidate.decision,

    action,

    classification:
      candidate.classification,

    score:
      candidate.opportunityScore,

    entry:
      candidate.entry,

    stopLoss:
      candidate.stopLoss,

    target1:
      candidate.target1,

    target2:
      candidate.target2,

    quantity:
      candidate.quantity,

    maxRisk:
      candidate.maxRisk,

    riskRewardRatio:
      candidate.riskRewardRatio,

    riskGateStatus:
      candidate.riskGateStatus,

    headline:
      buildHeadline(
        candidate,
        action
      ),

    riskMessage:
      buildRiskMessage(
        candidate
      ),
  };
}

export function buildOpportunityExperienceResult(
  candidates:
    OpportunityCandidate[]
): OpportunityExperienceResult {
  const opportunities =
    candidates.map(
      buildOpportunityExperienceItem
    );

  return {
    totalOpportunities:
      opportunities.length,

    tradeCount:
      opportunities.filter(
        (item) =>
          item.action === "TRADE"
      ).length,

    watchCount:
      opportunities.filter(
        (item) =>
          item.action === "WATCH"
      ).length,

    opportunities,
  };
}
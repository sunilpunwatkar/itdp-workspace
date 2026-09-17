export type OpportunitySignalDecision =
  | "BUY"
  | "SELL";

export interface OpportunitySignalLevelsInput {
  decision:
    OpportunitySignalDecision;

  entry:
    number;

  stopLoss:
    number;

  target1:
    number;

  target2:
    number;
}

export interface OpportunitySignalLevels {
  decision:
    OpportunitySignalDecision;

  entry:
    number;

  stopLoss:
    number;

  target1:
    number;

  target2:
    number;
}

function validatePrice(
  value: number
): void {
  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    throw new Error(
      "INVALID_OPPORTUNITY_SIGNAL_PRICE"
    );
  }
}

export function buildOpportunitySignalLevels(
  input:
    OpportunitySignalLevelsInput
): OpportunitySignalLevels {
  validatePrice(
    input.entry
  );

  validatePrice(
    input.stopLoss
  );

  validatePrice(
    input.target1
  );

  validatePrice(
    input.target2
  );

  if (
    input.decision === "BUY"
  ) {
    const validBuyGeometry =
      input.stopLoss <
        input.entry &&
      input.entry <
        input.target1 &&
      input.target1 <=
        input.target2;

    if (
      !validBuyGeometry
    ) {
      throw new Error(
        "INVALID_BUY_SIGNAL_GEOMETRY"
      );
    }
  } else if (
    input.decision === "SELL"
  ) {
    const validSellGeometry =
      input.target2 <=
        input.target1 &&
      input.target1 <
        input.entry &&
      input.entry <
        input.stopLoss;

    if (
      !validSellGeometry
    ) {
      throw new Error(
        "INVALID_SELL_SIGNAL_GEOMETRY"
      );
    }
  } else {
    throw new Error(
      "INVALID_OPPORTUNITY_SIGNAL_DECISION"
    );
  }

  return {
    decision:
      input.decision,

    entry:
      input.entry,

    stopLoss:
      input.stopLoss,

    target1:
      input.target1,

    target2:
      input.target2,
  };
}
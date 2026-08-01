export interface PositionSizingResult {
  capital: number;
  riskPercent: number;
  maxRisk: number;
  quantity: number;
}

export function calculatePositionSize(
  capital: number,
  riskPercent: number,
  entry: number,
  stopLoss: number
): PositionSizingResult {

  const maxRisk =
    capital * (riskPercent / 100);

  const riskPerShare =
    Math.abs(entry - stopLoss);

  const quantity =
    riskPerShare > 0
      ? Math.floor(maxRisk / riskPerShare)
      : 0;

  return {
    capital,
    riskPercent,
    maxRisk,
    quantity,
  };
}
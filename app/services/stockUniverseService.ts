export type StockUniverse =
  | "ITDP_REAL_5";

export interface StockUniverseResult {
  universe: StockUniverse;
  symbols: string[];
}

const ITDP_REAL_5_SYMBOLS = [
  "RELIANCE",
  "TCS",
  "INFY",
  "HDFCBANK",
  "ICICIBANK",
] as const;

export function getStockUniverse(
  universe: StockUniverse
): StockUniverseResult {
  if (universe === "ITDP_REAL_5") {
    return {
      universe,
      symbols: [...ITDP_REAL_5_SYMBOLS],
    };
  }

  const exhaustiveCheck: never = universe;

  throw new Error(
    `Unsupported stock universe: ${exhaustiveCheck}`
  );
}
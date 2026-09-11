export type StockUniverse =
  | "ITDP_REAL_5"
  | "ITDP_REAL_20";

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

const ITDP_REAL_20_SYMBOLS = [
  "RELIANCE.NS",
  "TCS.NS",
  "INFY.NS",
  "HDFCBANK.NS",
  "ICICIBANK.NS",

  "BHARTIARTL.NS",
  "LT.NS",
  "SBIN.NS",
  "AXISBANK.NS",
  "KOTAKBANK.NS",

  "ITC.NS",
  "HCLTECH.NS",
  "SUNPHARMA.NS",
  "MARUTI.NS",
  "NTPC.NS",

  "POWERGRID.NS",
  "TITAN.NS",
  "ULTRACEMCO.NS",
  "BAJFINANCE.NS",
  "TECHM.NS",
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

  if (universe === "ITDP_REAL_20") {
    return {
      universe,
      symbols: [...ITDP_REAL_20_SYMBOLS],
    };
  }

  const exhaustiveCheck: never = universe;

  throw new Error(
    `Unsupported stock universe: ${exhaustiveCheck}`
  );
}
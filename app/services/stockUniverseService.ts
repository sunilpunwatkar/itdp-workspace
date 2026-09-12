export type StockUniverse =
  | "ITDP_REAL_5"
  | "ITDP_REAL_20"
  | "ITDP_REAL_50"
  | "ITDP_REAL_100";

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

const ITDP_REAL_50_SYMBOLS = [
  "ADANIENT.NS",
  "ADANIPORTS.NS",
  "APOLLOHOSP.NS",
  "ASIANPAINT.NS",
  "AXISBANK.NS",

  "BAJAJ-AUTO.NS",
  "BAJFINANCE.NS",
  "BAJAJFINSV.NS",
  "BEL.NS",
  "BHARTIARTL.NS",

  "CIPLA.NS",
  "COALINDIA.NS",
  "DRREDDY.NS",
  "EICHERMOT.NS",
  "ETERNAL.NS",

  "GRASIM.NS",
  "HCLTECH.NS",
  "HDFCBANK.NS",
  "HDFCLIFE.NS",
  "HINDALCO.NS",

  "HINDUNILVR.NS",
  "ICICIBANK.NS",
  "INDIGO.NS",
  "INFY.NS",
  "ITC.NS",

  "JIOFIN.NS",
  "JSWSTEEL.NS",
  "KOTAKBANK.NS",
  "LT.NS",
  "M&M.NS",

  "MARUTI.NS",
  "MAXHEALTH.NS",
  "NESTLEIND.NS",
  "NTPC.NS",
  "ONGC.NS",

  "POWERGRID.NS",
  "RELIANCE.NS",
  "SBILIFE.NS",
  "SBIN.NS",
  "SHRIRAMFIN.NS",

  "SUNPHARMA.NS",
  "TATACONSUM.NS",
  "TCS.NS",
  "TMPV.NS",
  "TATASTEEL.NS",

  "TECHM.NS",
  "TITAN.NS",
  "TRENT.NS",
  "ULTRACEMCO.NS",
  "WIPRO.NS",
] as const;
const ITDP_REAL_100_SYMBOLS = [
  "HDFCBANK.NS",
  "ICICIBANK.NS",
  "RELIANCE.NS",
  "BHARTIARTL.NS",
  "LT.NS",
  "SBIN.NS",
  "INFY.NS",
  "AXISBANK.NS",
  "BAJFINANCE.NS",
  "M&M.NS",

  "ABB.NS",
  "ADANIENSOL.NS",
  "ADANIENT.NS",
  "ADANIGREEN.NS",
  "ADANIPORTS.NS",
  "ADANIPOWER.NS",
  "AMBUJACEM.NS",
  "APOLLOHOSP.NS",
  "ASIANPAINT.NS",
  "DMART.NS",

  "BAJAJ-AUTO.NS",
  "BAJAJFINSV.NS",
  "BAJAJHLDNG.NS",
  "BANKBARODA.NS",
  "BEL.NS",
  "BPCL.NS",
  "BOSCHLTD.NS",
  "BRITANNIA.NS",
  "CGPOWER.NS",
  "CANBK.NS",

  "CHOLAFIN.NS",
  "CIPLA.NS",
  "COALINDIA.NS",
  "CUMMINSIND.NS",
  "DLF.NS",
  "DIVISLAB.NS",
  "DRREDDY.NS",
  "EICHERMOT.NS",
  "ETERNAL.NS",
  "GAIL.NS",

  "GODREJCP.NS",
  "GRASIM.NS",
  "HCLTECH.NS",
  "HDFCAMC.NS",
  "HDFCLIFE.NS",
  "HINDALCO.NS",
  "HAL.NS",
  "HINDUNILVR.NS",
  "HINDZINC.NS",
  "HYUNDAI.NS",

  "ITC.NS",
  "INDHOTEL.NS",
  "IOC.NS",
  "IRFC.NS",
  "INDIGO.NS",
  "JSWSTEEL.NS",
  "JINDALSTEL.NS",
  "JIOFIN.NS",
  "KOTAKBANK.NS",
  "LTM.NS",

  "LODHA.NS",
  "MARUTI.NS",
  "MAXHEALTH.NS",
  "MAZDOCK.NS",
  "MUTHOOTFIN.NS",
  "NTPC.NS",
  "NESTLEIND.NS",
  "ONGC.NS",
  "PIDILITIND.NS",
  "PFC.NS",

  "POWERGRID.NS",
  "PNB.NS",
  "RECLTD.NS",
  "SBILIFE.NS",
  "MOTHERSON.NS",
  "SHREECEM.NS",
  "SHRIRAMFIN.NS",
  "ENRIN.NS",
  "SIEMENS.NS",
  "SOLARINDS.NS",

  "SUNPHARMA.NS",
  "TVSMOTOR.NS",
  "TATACAP.NS",
  "TCS.NS",
  "TATACONSUM.NS",
  "TMCV.NS",
  "TMPV.NS",
  "TATAPOWER.NS",
  "TATASTEEL.NS",
  "TECHM.NS",

  "TITAN.NS",
  "TORNTPHARM.NS",
  "TRENT.NS",
  "ULTRACEMCO.NS",
  "UNIONBANK.NS",
  "UNITDSPR.NS",
  "VBL.NS",
  "VEDL.NS",
  "WIPRO.NS",
  "ZYDUSLIFE.NS",
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

  if (universe === "ITDP_REAL_50") {
    return {
      universe,
      symbols: [...ITDP_REAL_50_SYMBOLS],
    };
  }
  if (universe === "ITDP_REAL_100") {
  return {
    universe,
    symbols: [...ITDP_REAL_100_SYMBOLS],
  };
}

  const exhaustiveCheck: never =
    universe;

  throw new Error(
    `Unsupported stock universe: ${exhaustiveCheck}`
  );
}
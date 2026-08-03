const symbolMap: Record<string, string> = {
  RELIANCE: "RELIANCE.NS",
  "RELIANCE INDUSTRIES": "RELIANCE.NS",

  TCS: "TCS.NS",
  "TATA CONSULTANCY SERVICES": "TCS.NS",

  INFY: "INFY.NS",
  INFOSYS: "INFY.NS",

  HDFCBANK: "HDFCBANK.NS",
  "HDFC BANK": "HDFCBANK.NS",

  ICICIBANK: "ICICIBANK.NS",
  "ICICI BANK": "ICICIBANK.NS",

  SBI: "SBIN.NS",
  SBIN: "SBIN.NS",
  "STATE BANK OF INDIA": "SBIN.NS",

  LT: "LT.NS",
  LARSEN: "LT.NS",

  WIPRO: "WIPRO.NS",

  TATAMOTORS: "TATAMOTORS.NS",
  "TATA MOTORS": "TATAMOTORS.NS",
};

export function resolveSymbol(input: string): string {
  const key = input.trim().toUpperCase();

  return symbolMap[key] ?? input.toUpperCase();
}
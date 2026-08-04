const symbolMap: Record<string, string> = {
  // Reliance
  "RELIANCE": "RELIANCE.NS",
  "RELIANCE INDUSTRIES": "RELIANCE.NS",
  "RELIANCE INDUSTRIES LTD": "RELIANCE.NS",
  "RIL": "RELIANCE.NS",

  // Infosys
  "INFOSYS": "INFY.NS",
  "INFY": "INFY.NS",
  "INFOSYS LTD": "INFY.NS",
"INFOSYS LIMITED": "INFY.NS",

  // TCS
  "TCS": "TCS.NS",
  "TATA CONSULTANCY SERVICES": "TCS.NS",
  "TCS LTD": "TCS.NS",
  "TCS LIMITED": "TCS.NS",

  // Wipro
  "WIPRO": "WIPRO.NS",

  // SBI
  "SBI": "SBIN.NS",
  "SBIN": "SBIN.NS",
  "STATE BANK OF INDIA": "SBIN.NS",
  "STATE BANK": "SBIN.NS",

  // ICICI
  "ICICI": "ICICIBANK.NS",
  "ICICI BANK": "ICICIBANK.NS",
  "ICICIBANK": "ICICIBANK.NS",

  // HDFC
  "HDFC": "HDFCBANK.NS",
  "HDFC BANK": "HDFCBANK.NS",
  "HDFCBANK": "HDFCBANK.NS",

  // Tata Motors
  "TATA MOTORS": "TATAMOTORS.NS",
  "TATAMOTORS": "TATAMOTORS.NS",
  "TATA MOTORS LTD": "TATAMOTORS.NS",
"TATA MOTORS LIMITED": "TATAMOTORS.NS",

  // Larsen
  "LT": "LT.NS",
  "LARSEN": "LT.NS",
  "L&T": "LT.NS",
};

export function resolveUniversalSymbol(input: string): string {

  const key = input
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");

  return symbolMap[key] ?? key;

}
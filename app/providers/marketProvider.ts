export interface MarketData {
  symbol: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketProvider {
  getQuote(symbol: string): Promise<MarketData>;
}

export async function getMarketData(
  symbol: string
): Promise<MarketData> {
  return {
    symbol,
    price: 2500,
    open: 2480,
    high: 2525,
    low: 2470,
    close: 2500,
    volume: 1250000,
  };
}
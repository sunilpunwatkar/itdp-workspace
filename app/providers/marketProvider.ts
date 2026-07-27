export interface MarketProvider {
  getQuote(symbol: string): Promise<any>;
}
import { MarketProvider } from "./marketProvider";

export class YahooProvider implements MarketProvider {
  async getQuote(symbol: string): Promise<any> {
    return {
      symbol,
      price: 3250,
      change: 42.35,
      changePercent: 1.32,
      volume: 1250000,
    };
  }
}
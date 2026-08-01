import { MarketProvider, MarketData } from "./marketProvider";

export class YahooProvider implements MarketProvider {
  async getQuote(symbol: string): Promise<MarketData> {
    console.log("Fetching Live Quote:", symbol);

    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=1d`;

    console.log("Yahoo Quote URL:", url);

    const response = await fetch(url);

   console.log("Response received");
console.log(response.status);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch live quote for ${symbol}. Status: ${response.status}`
      );
    }

    const data = await response.json();

    const result = data.chart?.result?.[0];
    const meta = result?.meta;
    const quote = result?.indicators?.quote?.[0];

    console.log("LIVE QUOTE:", {
      price: meta?.regularMarketPrice,
      open: quote?.open?.[0],
      high: quote?.high?.[0],
      low: quote?.low?.[0],
      close: quote?.close?.[0],
      volume: quote?.volume?.[0],
    });

    return {
      symbol,
      price: meta?.regularMarketPrice ?? 0,
      open: quote?.open?.[0] ?? 0,
      high: quote?.high?.[0] ?? 0,
      low: quote?.low?.[0] ?? 0,
      close: quote?.close?.[0] ?? 0,
      volume: quote?.volume?.[0] ?? 0,
    };
  }
}
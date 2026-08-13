import { MarketProvider, MarketData } from "./marketProvider";

export class YahooProvider implements MarketProvider {
  async getQuote(symbol: string): Promise<MarketData> {
    console.log("Fetching Live Quote:", symbol);

    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=1d`;

    console.log("Yahoo Quote URL:", url);

    try {
      const response = await fetch(url, {
        cache: "no-store",
      });

      console.log("Response received");
      console.log("Yahoo Status:", response.status);

      if (!response.ok) {
        throw new Error(
          `Yahoo HTTP ${response.status}`
        );
      }

      const data = await response.json();

      const result =
        data.chart?.result?.[0];

      const meta = result?.meta;

      const quote =
        result?.indicators?.quote?.[0];

      const price =
        meta?.regularMarketPrice ??
        quote?.close?.[0] ??
        0;

      const open =
        quote?.open?.[0] ?? 0;

      const high =
        quote?.high?.[0] ?? 0;

      const low =
        quote?.low?.[0] ?? 0;

      const close =
        quote?.close?.[0] ?? 0;

      const volume =
        quote?.volume?.[0] ?? 0;

      console.log("LIVE QUOTE:", {
        symbol,
        price,
        open,
        high,
        low,
        close,
        volume,
      });

      return {
        symbol,
        price,
        open,
        high,
        low,
        close,
        volume,
      };

    } catch (error) {

      console.error(
        "Yahoo Quote Error:",
        error
      );

      throw error;
    }
  }
}
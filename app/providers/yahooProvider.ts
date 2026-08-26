import { MarketProvider, MarketData } from "./marketProvider";

export class YahooProvider implements MarketProvider {
  async getQuote(symbol: string): Promise<MarketData> {

    console.log("Fetching Live Quote:", symbol);

    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=1d`;

    console.log("Yahoo Quote URL:", url);

    const totalLabel =
      `Yahoo Quote Total ${symbol}`;

    const fetchLabel =
      `Yahoo Quote Fetch ${symbol}`;

    const jsonLabel =
      `Yahoo Quote JSON ${symbol}`;

    console.time(totalLabel);

    try {

      // =====================================
      // Yahoo HTTP FETCH
      // =====================================

      console.time(fetchLabel);

      const response =
        await fetch(url, {
          cache: "no-store",
        });

      console.timeEnd(fetchLabel);

      console.log(
        "Yahoo Response received:",
        symbol
      );

      console.log(
        "Yahoo Status:",
        response.status
      );

      if (!response.ok) {
        throw new Error(
          `Yahoo HTTP ${response.status}`
        );
      }

      // =====================================
      // JSON PARSE
      // =====================================

      console.time(jsonLabel);

      const data =
        await response.json();

      console.timeEnd(jsonLabel);

      // =====================================
      // RESULT EXTRACTION
      // =====================================

      const result =
        data.chart?.result?.[0];

      if (!result) {
        throw new Error(
          `Yahoo returned empty result for ${symbol}`
        );
      }

      const meta =
        result?.meta;

      const quote =
        result?.indicators?.quote?.[0];

      if (!quote) {
        throw new Error(
          `Yahoo returned empty quote data for ${symbol}`
        );
      }

      // =====================================
      // PRICE
      // =====================================

      const price =
        meta?.regularMarketPrice ??
        quote?.close?.[0] ??
        0;

      // =====================================
      // OHLC
      // =====================================

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

      // =====================================
      // LIVE QUOTE LOG
      // =====================================

      console.log(
        "LIVE QUOTE:",
        {
          symbol,
          price,
          open,
          high,
          low,
          close,
          volume,
        }
      );

      // =====================================
      // TOTAL TIME
      // =====================================

      console.timeEnd(totalLabel);

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

      // =====================================
      // ERROR
      // =====================================

      console.error(
        "Yahoo Quote Error:",
        error
      );

      console.timeEnd(totalLabel);

      throw error;
    }
  }
}
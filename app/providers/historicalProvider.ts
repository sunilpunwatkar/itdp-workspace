export interface HistoricalOHLC {
  timestamps: number[];
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
}

const YAHOO_TIMEOUT_MS = 12_000;

export class HistoricalProvider {

  // ==========================================
  // Existing Method (EMA / RSI / MACD साठी)
  // ==========================================
  async getHistoricalPrices(
    symbol: string
  ): Promise<number[]> {

    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=2y&interval=1d`;

    console.log("Yahoo URL:", url);

    const controller =
      new AbortController();

    const timeout =
      setTimeout(
        () => controller.abort(),
        YAHOO_TIMEOUT_MS
      );

    try {

      const response =
        await fetch(
          url,
          {
            signal: controller.signal,
          }
        );

      if (response.status === 429) {
  throw new Error(
    `Yahoo rate limit (HTTP 429) for ${symbol}.`
  );
}

if (!response.ok) {
  throw new Error(
    `Yahoo historical HTTP ${response.status} for ${symbol}.`
  );
}

      const data =
        await response.json();

      const closes =
        data.chart?.result?.[0]
          ?.indicators
          ?.quote?.[0]
          ?.close;

      const validPrices =
        closes?.filter(
          (price: number | null): price is number =>
            price !== null
        ) ?? [];

      console.log(
        "Prices Length:",
        validPrices.length
      );

      return validPrices;

    } catch (error) {

      if (
        error instanceof Error &&
        error.name === "AbortError"
      ) {
        throw new Error(
          `Yahoo historical request timed out after ${YAHOO_TIMEOUT_MS / 1000}s for ${symbol}`
        );
      }

      throw error;

    } finally {

      clearTimeout(timeout);

    }
  }

  // ==========================================
  // Candlestick Chart साठी
  // ==========================================
  async getHistoricalOHLC(
    symbol: string
  ): Promise<HistoricalOHLC> {

    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=2y&interval=1d`;

    console.log(
      "Yahoo OHLC URL:",
      url
    );

    const controller =
      new AbortController();

    const timeout =
      setTimeout(
        () => controller.abort(),
        YAHOO_TIMEOUT_MS
      );

    try {

      const response =
        await fetch(
          url,
          {
            signal: controller.signal,
          }
        );

      if (response.status === 429) {
  throw new Error(
    `Yahoo rate limit (HTTP 429) for ${symbol}.`
  );
}

if (!response.ok) {
  throw new Error(
    `Yahoo historical HTTP ${response.status} for ${symbol}.`
  );
}

      const data =
        await response.json();

      const result =
        data.chart?.result?.[0];

      if (!result) {
        throw new Error(
          "Yahoo returned empty data."
        );
      }

      return {
        timestamps:
          result.timestamp ?? [],

        open:
          result.indicators?.quote?.[0]?.open ?? [],

        high:
          result.indicators?.quote?.[0]?.high ?? [],

        low:
          result.indicators?.quote?.[0]?.low ?? [],

        close:
          result.indicators?.quote?.[0]?.close ?? [],

        volume:
          result.indicators?.quote?.[0]?.volume ?? [],
      };

    } catch (error) {

      if (
        error instanceof Error &&
        error.name === "AbortError"
      ) {
        throw new Error(
          `Yahoo OHLC request timed out after ${YAHOO_TIMEOUT_MS / 1000}s for ${symbol}`
        );
      }

      throw error;

    } finally {

      clearTimeout(timeout);

    }
  }

}
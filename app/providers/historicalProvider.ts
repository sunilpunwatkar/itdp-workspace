import {
  executeProviderOperationWithRetry,
} from "../services/providerRetryExecutor";

export interface HistoricalOHLC {
  timestamps: number[];
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
}

const YAHOO_TIMEOUT_MS = 12_000;

const MAX_RETRY_ATTEMPTS = 3;

type SleepFunction = (
  delayMs: number
) => Promise<void>;

const defaultSleep: SleepFunction =
  async (delayMs) => {
    await new Promise<void>(
      (resolve) => {
        setTimeout(
          resolve,
          delayMs
        );
      }
    );
  };

async function withHistoricalDeadline<T>(
  operation: (
    signal: AbortSignal
  ) => Promise<T>,
  timeoutMessage: string
): Promise<T> {
  const controller =
    new AbortController();

  let timeout:
    ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise =
    new Promise<never>(
      (_resolve, reject) => {
        timeout = setTimeout(
          () => {
            reject(
              new Error(
                timeoutMessage
              )
            );

            controller.abort();
          },
          YAHOO_TIMEOUT_MS
        );
      }
    );

  try {
    return await Promise.race([
      operation(
        controller.signal
      ),
      timeoutPromise,
    ]);
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw new Error(
        timeoutMessage
      );
    }

    throw error;
  } finally {
    if (timeout !== undefined) {
      clearTimeout(
        timeout
      );
    }
  }
}

export class HistoricalProvider {
  private readonly sleep:
    SleepFunction;

  constructor(
    sleep: SleepFunction =
      defaultSleep
  ) {
    this.sleep =
      sleep;
  }

  // ==========================================
  // HISTORICAL PRICES
  // EMA / RSI / MACD
  // ==========================================

  async getHistoricalPrices(
    symbol: string
  ): Promise<number[]> {
    return executeProviderOperationWithRetry(
      () =>
        this.fetchHistoricalPricesOnce(
          symbol
        ),
      {
        maxAttempts:
          MAX_RETRY_ATTEMPTS,

        sleep:
          this.sleep,
      }
    );
  }

  private async fetchHistoricalPricesOnce(
    symbol: string
  ): Promise<number[]> {
    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=2y&interval=1d`;

    console.log(
      "Yahoo URL:",
      url
    );
return withHistoricalDeadline(
  async (signal) => {
        const response =
          await fetch(
            url,
            {
              signal,
            }
          );

        if (
          response.status === 429
        ) {
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
            (
              price:
                number | null
            ): price is number =>
              price !== null
          ) ?? [];

        console.log(
          "Prices Length:",
          validPrices.length
        );

        return validPrices;
      },
      `Yahoo historical request timed out after ${YAHOO_TIMEOUT_MS / 1000}s for ${symbol}`
    );
  }

  // ==========================================
  // HISTORICAL OHLC
  // CANDLESTICK / ANALYSIS
  // ==========================================

  async getHistoricalOHLC(
    symbol: string
  ): Promise<HistoricalOHLC> {
    return executeProviderOperationWithRetry(
      () =>
        this.fetchHistoricalOHLCOnce(
          symbol
        ),
      {
        maxAttempts:
          MAX_RETRY_ATTEMPTS,

        sleep:
          this.sleep,
      }
    );
  }

  private async fetchHistoricalOHLCOnce(
    symbol: string
  ): Promise<HistoricalOHLC> {
    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=2y&interval=1d`;

    console.log(
      "Yahoo OHLC URL:",
      url
    );

    const attemptStartedAt =
      performance.now();

    try {
return await withHistoricalDeadline(
  async (signal) => {
          const response =
            await fetch(
              url,
              {
                signal,
              }
            );

          if (
            response.status === 429
          ) {
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
              result.indicators
                ?.quote?.[0]
                ?.open ?? [],

            high:
              result.indicators
                ?.quote?.[0]
                ?.high ?? [],

            low:
              result.indicators
                ?.quote?.[0]
                ?.low ?? [],

            close:
              result.indicators
                ?.quote?.[0]
                ?.close ?? [],

            volume:
              result.indicators
                ?.quote?.[0]
                ?.volume ?? [],
          };
        },
        `Yahoo OHLC request timed out after ${YAHOO_TIMEOUT_MS / 1000}s for ${symbol}`
      );
    } finally {
      console.log(
        `YAHOO OHLC ATTEMPT ${symbol}:`,
        `${(performance.now() - attemptStartedAt).toFixed(2)} ms`
      );
    }
  }
}

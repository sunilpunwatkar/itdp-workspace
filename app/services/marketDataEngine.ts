import { YahooProvider } from "../providers/yahooProvider";

import {
  HistoricalOHLC,
} from "../providers/historicalProvider";

import { resolveUniversalSymbol } from "./universalSymbolEngine";

import {
  getCachedHistoricalOHLC,
} from "./historicalDataCache";

const yahoo = new YahooProvider();

export type MarketData = {
  symbol: string;

  quote: {
    symbol: string;
    price: number;
  };

  prices: number[];

  ohlc: HistoricalOHLC;
};

export async function getMarketData(
  inputSymbol: string
): Promise<MarketData> {

  const symbol =
    resolveUniversalSymbol(inputSymbol);

  console.log(
    `MarketData Engine : ${inputSymbol} -> ${symbol}`
  );

  // =====================================
  // Quote + Cached Historical OHLC
  // =====================================

  const [quote, ohlc] =
    await Promise.all([

      yahoo.getQuote(symbol),

      getCachedHistoricalOHLC(symbol),

    ]);

  // =====================================
  // Close Prices
  // =====================================

  const prices =
    ohlc.close.filter(
      (price): price is number =>
        price != null &&
        Number.isFinite(price)
    );

  console.log(
    "MarketData Prices Length:",
    prices.length
  );

  return {
    symbol,
    quote,
    prices,
    ohlc,
  };
}

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
  // HISTORICAL DATA
  // =====================================

  const ohlc =
    await getCachedHistoricalOHLC(symbol);

  // =====================================
  // CLOSE PRICES
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

  // =====================================
  // LIVE QUOTE
  // =====================================

  let quote: {
    symbol: string;
    price: number;
  };

  try {

    quote =
      await yahoo.getQuote(symbol);

    console.log(
      "MarketData Live Quote OK:",
      quote
    );

  } catch (error) {

    // =====================================
    // LIVE QUOTE FAILED
    // =====================================

    console.error(
      `⚠ Live Quote FAILED: ${symbol}`,
      error
    );

    // =====================================
    // HISTORICAL FALLBACK PRICE
    // =====================================

    const lastPrice =
      prices.length > 0
        ? prices[prices.length - 1]
        : null;

    if (
      lastPrice === null ||
      !Number.isFinite(lastPrice) ||
      lastPrice <= 0
    ) {

      throw new Error(
        `Live quote unavailable and no historical fallback price exists for ${symbol}`
      );
    }

    console.warn(
      `🔄 Using Historical Fallback Quote: ${symbol} -> ${lastPrice}`
    );

    quote = {
      symbol,
      price: lastPrice,
    };
  }

  // =====================================
  // FINAL MARKET DATA
  // =====================================

  return {
    symbol,
    quote,
    prices,
    ohlc,
  };
}
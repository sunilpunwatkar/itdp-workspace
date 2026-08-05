import { YahooProvider } from "../providers/yahooProvider";
import {
  HistoricalProvider,
  HistoricalOHLC,
} from "../providers/historicalProvider";

import { resolveUniversalSymbol } from "./universalSymbolEngine";

const yahoo = new YahooProvider();
const historical = new HistoricalProvider();

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

  const [quote, prices, ohlc] =
    await Promise.all([
      yahoo.getQuote(symbol),
      historical.getHistoricalPrices(symbol),
      historical.getHistoricalOHLC(symbol),
    ]);

  return {
    symbol,
    quote,
    prices,
    ohlc,
  };
}
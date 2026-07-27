import { YahooProvider } from "../../providers/yahooProvider";

export type StockQuote = {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
};

const provider = new YahooProvider();

export async function getStockQuote(
  symbol: string
): Promise<StockQuote> {

  const quote = await provider.getQuote(symbol);

  return {
    symbol: quote.symbol,
    companyName: "Demo Company",
    price: quote.price,
    change: quote.change,
    changePercent: quote.changePercent,
  };
}
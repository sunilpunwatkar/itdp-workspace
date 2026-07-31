import { MarketProvider, MarketData } from "./marketProvider";


export class YahooProvider implements MarketProvider {
  async getQuote(symbol: string): Promise<MarketData> {
    console.log("Fetching Live Quote:", symbol);
    console.time("Yahoo Quote");
    const url =
  `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=1d`;

console.log("Yahoo Quote URL:", url);
console.timeEnd("Yahoo Quote"); 
    return {
  symbol,
  price: 3250,
  open: 3240,
  high: 3265,
  low: 3230,
  close: 3250,
  volume: 1250000,
};
}

}
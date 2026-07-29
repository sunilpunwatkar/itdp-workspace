export class HistoricalProvider {

  async getHistoricalPrices(symbol: string) {

    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS?range=6mo&interval=1d`;

    const response = await fetch(url);

    const data = await response.json();

    return data;
  }

}
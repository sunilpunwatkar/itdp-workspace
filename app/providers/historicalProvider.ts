export class HistoricalProvider {
  async getHistoricalPrices(symbol: string): Promise<number[]> {
    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=2y&interval=1d`;

    console.log("Yahoo URL:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch historical data for ${symbol}`
      );
    }

    const data = await response.json();

    const closes =
      data.chart?.result?.[0]
        ?.indicators
        ?.quote?.[0]
        ?.close;

    const validPrices =
      closes?.filter(
        (price: number | null): price is number => price !== null
      ) ?? [];

    console.log("Prices Length:", validPrices.length);

    return validPrices;
  }
}
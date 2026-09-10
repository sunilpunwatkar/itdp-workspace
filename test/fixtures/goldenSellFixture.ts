import {
  MarketProvider,
  MarketData,
} from "../../app/providers/marketProvider";

export const GOLDEN_SELL_SYMBOL = "TEST.RISK_GATE.SELL.E2E";

const MIRROR_BASE = 2700;

export const goldenSellMarketProvider: MarketProvider = {
  async getQuote(symbol: string): Promise<MarketData> {
    return {
      symbol,
      price: 1336,
      open: 1337,
      high: 1338,
      low: 1335,
      close: 1336,
      volume: 1000000,
    };
  },
};

export function buildGoldenSellOHLC() {
  const timestamps: number[] = [];
  const open: number[] = [];
  const high: number[] = [];
  const low: number[] = [];
  const close: number[] = [];
  const volume: number[] = [];

  for (let i = 0; i < 220; i++) {
    const buyPrice = 1000 + i * 1.5;
    const price = MIRROR_BASE - buyPrice;

    timestamps.push(1700000000 + i * 86400);

    open.push(price + 1);
    high.push(price + 2);
    low.push(price - 2);
    close.push(price);

    volume.push(1000000);
  }

  const buyRecentPrices = [
    1330, 1340, 1346, 1356, 1350,
    1352, 1346, 1340, 1348, 1350,
    1344, 1336, 1330, 1332, 1324,
    1332, 1340, 1348, 1346, 1344,
    1342, 1348, 1350, 1360, 1358,
    1368, 1370, 1362, 1366, 1364,
  ];

  for (let i = 0; i < buyRecentPrices.length; i++) {
    const buyPrice = buyRecentPrices[i];
    const price = MIRROR_BASE - buyPrice;

    timestamps.push(
      1700000000 + (220 + i) * 86400
    );

    open.push(price + 0.5);
    high.push(price + 1.5);
    low.push(price - 1.5);
    close.push(price);

    volume.push(1000000);
  }

  return {
    timestamps,
    open,
    high,
    low,
    close,
    volume,
  };
}
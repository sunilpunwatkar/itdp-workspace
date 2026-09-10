import {
  MarketProvider,
  MarketData,
} from "../../app/providers/marketProvider";

export const GOLDEN_BUY_SYMBOL = "TEST.RISK_GATE.BUY.E2E";

export const goldenBuyMarketProvider: MarketProvider = {
  async getQuote(symbol: string): Promise<MarketData> {
    return {
      symbol,
      price: 1364,
      open: 1363,
      high: 1365,
      low: 1362,
      close: 1364,
      volume: 1000000,
    };
  },
};

export function buildGoldenBuyOHLC() {
  const timestamps: number[] = [];
  const open: number[] = [];
  const high: number[] = [];
  const low: number[] = [];
  const close: number[] = [];
  const volume: number[] = [];

  for (let i = 0; i < 220; i++) {
    const price = 1000 + i * 1.5;

    timestamps.push(1700000000 + i * 86400);
    open.push(price - 1);
    high.push(price + 2);
    low.push(price - 2);
    close.push(price);
    volume.push(1000000);
  }

  const recentPrices = [
    1330, 1340, 1346, 1356, 1350,
    1352, 1346, 1340, 1348, 1350,
    1344, 1336, 1330, 1332, 1324,
    1332, 1340, 1348, 1346, 1344,
    1342, 1348, 1350, 1360, 1358,
    1368, 1370, 1362, 1366, 1364,
  ];

  for (let i = 0; i < recentPrices.length; i++) {
    const price = recentPrices[i];

    timestamps.push(
      1700000000 + (220 + i) * 86400
    );

    open.push(price - 0.5);
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

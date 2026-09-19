export type MarketIndexDefinition = {
  name: string;
  symbol: string;
};

export type MarketIndex = {
  name: string;
  symbol: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
};

// =====================================================
// CANONICAL MARKET INDEX DEFINITIONS
// =====================================================

export const MARKET_INDEX_DEFINITIONS:
  MarketIndexDefinition[] = [
    {
      name: "NIFTY 50",
      symbol: "^NSEI",
    },
    {
      name: "SENSEX",
      symbol: "^BSESN",
    },
    {
      name: "BANK NIFTY",
      symbol: "^NSEBANK",
    },
  ];

// =====================================================
// BUILD MARKET INDEX
// =====================================================

export function buildMarketIndex(
  definition: MarketIndexDefinition,
  price: number,
  previousClose: number
): MarketIndex {
  const change =
    price - previousClose;

  const changePercent =
    previousClose > 0
      ? (change / previousClose) * 100
      : 0;

  return {
    name: definition.name,
    symbol: definition.symbol,
    price,
    previousClose,
    change,
    changePercent,
  };
}
// =====================================================
// YAHOO MARKET INDEX META
// =====================================================

type YahooIndexMeta = {
  regularMarketPrice?: number;
  chartPreviousClose?: number;
};

// =====================================================
// FETCH SINGLE MARKET INDEX
// =====================================================

export async function fetchMarketIndex(
  definition: MarketIndexDefinition
): Promise<MarketIndex> {
  const encodedSymbol =
    encodeURIComponent(definition.symbol);

  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodedSymbol}?range=1d&interval=1d`;

  const response = await fetch(
    url,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Yahoo index HTTP ${response.status} for ${definition.symbol}`
    );
  }

  const data = await response.json();

  const result =
    data?.chart?.result?.[0];

  if (!result) {
    throw new Error(
      `Yahoo returned empty index result for ${definition.symbol}`
    );
  }

  const meta =
    result.meta as YahooIndexMeta;

  const price =
    meta.regularMarketPrice;

  const previousClose =
    meta.chartPreviousClose;

  if (
    !Number.isFinite(price) ||
    !Number.isFinite(previousClose) ||
    !price ||
    !previousClose
  ) {
    throw new Error(
      `Yahoo returned invalid index data for ${definition.symbol}`
    );
  }

  return buildMarketIndex(
    definition,
    price,
    previousClose
  );
}

// =====================================================
// FETCH ALL MARKET INDICES
// =====================================================

export async function getMarketIndices():
  Promise<MarketIndex[]> {
  return Promise.all(
    MARKET_INDEX_DEFINITIONS.map(
      (definition) =>
        fetchMarketIndex(definition)
    )
  );
}
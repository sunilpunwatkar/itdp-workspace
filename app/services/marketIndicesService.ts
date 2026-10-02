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
  sparkline: number[];
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
// EXTRACT SPARKLINE
// =====================================================

export function extractSparkline(
  values: unknown
): number[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return values.filter(
    (value): value is number =>
      typeof value === "number" &&
      Number.isFinite(value)
  );
}
// =====================================================
// BUILD MARKET INDEX
// =====================================================

export function buildMarketIndex(
  definition: MarketIndexDefinition,
  price: number,
  previousClose: number,
  sparkline: number[] = []
): MarketIndex {
  const change =
    price - previousClose;

  const changePercent =
    previousClose > 0
      ? (change / previousClose) * 100
      : 0;

  const validSparkline =
    sparkline.filter(
      (value) =>
        Number.isFinite(value)
    );

  return {
    name: definition.name,
    symbol: definition.symbol,
    price,
    previousClose,
    change,
    changePercent,
    sparkline: validSparkline,
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

type MarketIndexFetchOptions = {
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
};

const MARKET_INDEX_TIMEOUT_MS = 12_000;

export async function fetchMarketIndex(
  definition: MarketIndexDefinition,
  options: MarketIndexFetchOptions = {}
): Promise<MarketIndex> {
  const encodedSymbol =
    encodeURIComponent(definition.symbol);

  const url =
  `https://query1.finance.yahoo.com/v8/finance/chart/${encodedSymbol}?range=1d&interval=5m`;

  const fetchImpl =
    options.fetchImpl ?? fetch;

  const timeoutMs =
    options.timeoutMs ??
    MARKET_INDEX_TIMEOUT_MS;

  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () => controller.abort(),
      timeoutMs
    );

  let response: Response;

  try {
    response = await fetchImpl(
      url,
      {
        cache: "no-store",
        signal: controller.signal,
      }
    );
  } catch (error) {
    if (
      controller.signal.aborted ||
      (
        error instanceof Error &&
        error.name === "AbortError"
      )
    ) {
      throw new Error(
        `Yahoo index request timed out after ${timeoutMs}ms for ${definition.symbol}`
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }

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

  const sparkline =
    extractSparkline(
      result?.indicators?.quote?.[0]?.close
    );

  return buildMarketIndex(
    definition,
    price,
    previousClose,
    sparkline
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

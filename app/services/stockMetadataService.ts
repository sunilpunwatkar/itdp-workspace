export type StockMetadata = {
  symbol: string;
  companyName: string;
  exchange: string;
  instrumentType: string;
  currency: string;
};

type YahooStockMeta = {
  symbol?: unknown;
  longName?: unknown;
  shortName?: unknown;
  fullExchangeName?: unknown;
  exchangeName?: unknown;
  instrumentType?: unknown;
  currency?: unknown;
};

// =====================================================
// METADATA CACHE
// =====================================================

const stockMetadataCache =
  new Map<string, StockMetadata>();

// =====================================================
// HELPERS
// =====================================================

function readString(
  value: unknown
): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function normalizeSymbol(
  symbol: string
): string {
  return symbol
    .trim()
    .toUpperCase();
}

// =====================================================
// YAHOO META -> ITDP METADATA
// =====================================================

export function extractStockMetadata(
  meta: YahooStockMeta
): StockMetadata {
  const symbol =
    readString(meta.symbol);

  const longName =
    readString(meta.longName);

  const shortName =
    readString(meta.shortName);

  const fullExchangeName =
    readString(
      meta.fullExchangeName
    );

  const exchangeName =
    readString(meta.exchangeName);

  return {
    symbol,

    companyName:
      longName || shortName,

    exchange:
      fullExchangeName ||
      exchangeName,

    instrumentType:
      readString(
        meta.instrumentType
      ),

    currency:
      readString(
        meta.currency
      ),
  };
}

// =====================================================
// CACHE WRITE
// =====================================================

export function saveStockMetadata(
  metadata: StockMetadata
): void {
  const symbol =
    normalizeSymbol(
      metadata.symbol
    );

  if (!symbol) {
    return;
  }

  stockMetadataCache.set(
    symbol,
    {
      ...metadata,
      symbol,
    }
  );
}

// =====================================================
// CACHE READ
// =====================================================

export function getCachedStockMetadata(
  symbol: string
): StockMetadata | null {
  const normalizedSymbol =
    normalizeSymbol(symbol);

  return (
    stockMetadataCache.get(
      normalizedSymbol
    ) ?? null
  );
}

// =====================================================
// TEST SUPPORT
// =====================================================

export function clearStockMetadataCacheForTest(
  symbol?: string
): void {
  if (symbol) {
    stockMetadataCache.delete(
      normalizeSymbol(symbol)
    );

    return;
  }

  stockMetadataCache.clear();
}
export interface StockUniverseValidationResult {
  valid: boolean;
  symbols: string[];
  error: string | null;
}

export function validateStockUniverse(
  symbols: string[]
): StockUniverseValidationResult {
  const normalized =
    symbols.map(
      (symbol) =>
        symbol
          .trim()
          .toUpperCase()
    );

  if (
    normalized.some(
      (symbol) =>
        symbol.length === 0
    )
  ) {
    return {
      valid: false,
      symbols: [],
      error:
        "Stock universe contains a blank symbol.",
    };
  }

  const seen =
    new Set<string>();

  for (
    const symbol of normalized
  ) {
    if (
      seen.has(symbol)
    ) {
      return {
        valid: false,
        symbols: [],
        error:
          `Stock universe contains duplicate symbol: ${symbol}`,
      };
    }

    seen.add(symbol);
  }

  return {
    valid: true,
    symbols: normalized,
    error: null,
  };
}
import {
  getStockAnalysis,
} from "../../services/stockAnalysisService";

import type {
  OpportunityScannerSource,
} from "./opportunityScannerService";

import {
  validateStockUniverse,
} from "./stockUniverseValidationService";

export function buildOpportunityScannerSources(
  symbols: string[]
): OpportunityScannerSource[] {
  const validation =
    validateStockUniverse(
      symbols
    );

  if (!validation.valid) {
    throw new Error(
      validation.error ??
        "Stock universe validation failed."
    );
  }

  return validation.symbols.map(
    (symbol) => ({
      symbol,

      analyze: async () =>
        getStockAnalysis(
          symbol
        ),
    })
  );
}
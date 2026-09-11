import {
  getStockAnalysis,
} from "../../services/stockAnalysisService";

import type {
  OpportunityScannerSource,
} from "./opportunityScannerService";

export function buildOpportunityScannerSources(
  symbols: string[]
): OpportunityScannerSource[] {
  return symbols.map(
    (symbol) => ({
      symbol,

      analyze: async () =>
        getStockAnalysis(symbol),
    })
  );
}
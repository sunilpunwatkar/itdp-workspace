import {
  getStockUniverse,
  StockUniverse,
} from "./stockUniverseService";

import {
  buildOpportunityScannerSources,
} from "./opportunityScannerSourceFactory";

import {
  scanOpportunities,
  OpportunityScannerResult,
  OpportunityScannerOptions,
} from "./opportunityScannerService";

import {
  OpportunityDiscoveryInput,
} from "./opportunityDiscoveryService";

import {
  orchestrateScan,
  OrchestratedScanResult,
} from "./scanOrchestratorService";

import {
  buildOpportunityScanCacheKey,
} from "./opportunityScanCacheKeyService";

export interface OpportunityScanAccessInput {
  stockUniverse:
    StockUniverse;

  discovery:
    OpportunityDiscoveryInput;

  freshnessTtlMs:
    number;

  scannerOptions?:
    OpportunityScannerOptions;
}

export interface OpportunityScanAccessDependencies {
  now?:
    () => number;

  createScanId?:
    () => string;
}

let scanSequence =
  0;

function defaultCreateScanId(): string {
  scanSequence += 1;

  return `OPPORTUNITY-SCAN-${Date.now()}-${scanSequence}`;
}

export async function scanOpportunityUniverse(
  input:
    OpportunityScanAccessInput,

  dependencies:
    OpportunityScanAccessDependencies = {}
): Promise<
  OrchestratedScanResult<
    OpportunityScannerResult
  >
> {
  // ==========================================
  // RESOLVE STOCK UNIVERSE
  // ==========================================

  const universe =
    getStockUniverse(
      input.stockUniverse
    );

  // ==========================================
  // BUILD SCANNER SOURCES
  // ==========================================

  const sources =
    buildOpportunityScannerSources(
      universe.symbols
    );

  // ==========================================
  // RUNTIME DEPENDENCIES
  // ==========================================

  const now =
    dependencies.now ??
    (() => Date.now());

  const createScanId =
    dependencies.createScanId ??
    defaultCreateScanId;

  // ==========================================
  // BUILD FULL CACHE / ORCHESTRATION KEY
  // ==========================================

  const cacheKey =
    buildOpportunityScanCacheKey({
      stockUniverse:
        input.stockUniverse,

      discovery:
        input.discovery,
    });

  // ==========================================
  // ORCHESTRATED SCAN
  // ==========================================

  return orchestrateScan<
    OpportunityScannerResult
  >({
    universe:
      cacheKey,

    freshnessTtlMs:
      input.freshnessTtlMs,

    now,

    createScanId,

    scan:
      () =>
        scanOpportunities(
          sources,
          input.discovery,
          input.scannerOptions
        ),

    getCounts:
      (result) => ({
        scannedCount:
          result.scannedCount,

        analyzedCount:
          result.analyzedCount,

        failedCount:
          result.failedCount,
      }),
  });
}
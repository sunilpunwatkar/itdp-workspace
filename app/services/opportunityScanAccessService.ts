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
  const universe =
    getStockUniverse(
      input.stockUniverse
    );

  const sources =
    buildOpportunityScannerSources(
      universe.symbols
    );

  const now =
    dependencies.now ??
    (() => Date.now());

  const createScanId =
    dependencies.createScanId ??
    defaultCreateScanId;

  return orchestrateScan<
    OpportunityScannerResult
  >({
    universe:
      input.stockUniverse,

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
import type {
  OpportunityScannerOptions,
} from "./opportunityScannerService";

export const OPPORTUNITY_PRODUCTION_SCANNER_OPTIONS:
  Readonly<OpportunityScannerOptions> = {
    concurrency: 2,
    batchSize: 10,
    batchDelayMs: 500,
  };
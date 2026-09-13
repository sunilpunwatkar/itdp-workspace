import type {
  OpportunityScannerResult,
} from "./opportunityScannerService";

import type {
  OrchestratedScanResult,
} from "./scanOrchestratorService";

import {
  buildOpportunityExperienceResult,
} from "./opportunityExperienceService";

export interface OpportunityExperienceResponse {
  source:
    | "LIVE"
    | "CACHE";

  scanId:
    string;

  scannedCount:
    number;

  analyzedCount:
    number;

  failedCount:
    number;

  experience:
    ReturnType<
      typeof buildOpportunityExperienceResult
    >;
}

export function buildOpportunityExperienceResponse(
  scan:
    OrchestratedScanResult<
      OpportunityScannerResult
    >
): OpportunityExperienceResponse {
  const experience =
    buildOpportunityExperienceResult(
      scan.result.discovery.opportunities
    );

  return {
    source:
      scan.source,

    scanId:
      scan.metadata.scanId,

    scannedCount:
      scan.metadata.scannedCount,

    analyzedCount:
      scan.metadata.analyzedCount,

    failedCount:
      scan.metadata.failedCount,

    experience,
  };
}
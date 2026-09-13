import type {
  OpportunityScannerResult,
} from "./opportunityScannerService";

import type {
  OrchestratedScanResult,
} from "./scanOrchestratorService";

import {
  buildOpportunityExperienceResult,
} from "./opportunityExperienceService";

import {
  resolveOpportunityExperienceState,
} from "./opportunityExperienceStateService";

import type {
  OpportunityExperienceState,
} from "./opportunityExperienceStateService";

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

  state:
    OpportunityExperienceState;

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

  const state =
    resolveOpportunityExperienceState({
      tradeCount:
        experience.tradeCount,

      watchCount:
        experience.watchCount,
    });

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

    state,

    experience,
  };
}
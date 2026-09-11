import type {
  AnalysisResult,
} from "../types/analysis";

import {
  buildOpportunityCandidateFromAnalysis,
} from "./opportunityAdapterService";

import {
  buildOpportunityDiscoveryResult,
  OpportunityDiscoveryInput,
  OpportunityDiscoveryResult,
} from "./opportunityDiscoveryService";

export interface OpportunityScannerSource {
  symbol: string;

  analyze:
    () => Promise<AnalysisResult>;
}

export interface OpportunityScannerFailure {
  symbol: string;

  error: string;
}

export interface OpportunityScannerResult {
  scannedCount: number;

  analyzedCount: number;

  failedCount: number;

  candidateCount: number;

  failures: OpportunityScannerFailure[];

  discovery: OpportunityDiscoveryResult;
}

export async function scanOpportunities(
  sources: OpportunityScannerSource[],
  input: OpportunityDiscoveryInput
): Promise<OpportunityScannerResult> {
  const candidates = [];

  const failures:
    OpportunityScannerFailure[] = [];

  let analyzedCount = 0;

  for (const source of sources) {
    try {
      const analysis =
        await source.analyze();

      analyzedCount += 1;

      const candidate =
        buildOpportunityCandidateFromAnalysis(
          analysis
        );

      if (candidate) {
        candidates.push(candidate);
      }
    } catch (error) {
      failures.push({
        symbol:
          source.symbol,

        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }

  const discovery =
    buildOpportunityDiscoveryResult(
      input,
      candidates
    );

  return {
    scannedCount:
      sources.length,

    analyzedCount,

    failedCount:
      failures.length,

    candidateCount:
      candidates.length,

    failures,

    discovery,
  };
}
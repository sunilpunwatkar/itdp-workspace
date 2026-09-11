import type {
  AnalysisResult,
} from "../types/analysis";

import {
  buildOpportunityCandidateFromAnalysis,
} from "./opportunityAdapterService";

import {
  buildOpportunityDiscoveryResult,
  OpportunityCandidate,
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

export interface OpportunityScannerOptions {
  concurrency?: number;
}

export async function scanOpportunities(
  sources: OpportunityScannerSource[],
  input: OpportunityDiscoveryInput,
  options: OpportunityScannerOptions = {}
): Promise<OpportunityScannerResult> {
  const candidates: OpportunityCandidate[] = [];

  const failures:
    OpportunityScannerFailure[] = [];

  let analyzedCount = 0;

  const requestedConcurrency =
    options.concurrency ?? 1;

  if (
    !Number.isInteger(requestedConcurrency) ||
    requestedConcurrency <= 0
  ) {
    throw new Error(
      "Scanner concurrency must be a positive integer."
    );
  }

  const concurrency =
    Math.min(
      requestedConcurrency,
      Math.max(
        sources.length,
        1
      )
    );

  let nextIndex = 0;

  async function worker() {
    while (true) {
      const currentIndex =
        nextIndex;

      nextIndex += 1;

      if (
        currentIndex >=
        sources.length
      ) {
        return;
      }

      const source =
        sources[currentIndex];

      try {
        const analysis =
          await source.analyze();

        analyzedCount += 1;

        const candidate =
          buildOpportunityCandidateFromAnalysis(
            analysis
          );

        if (candidate) {
          candidates.push(
            candidate
          );
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
  }

  const workers =
    Array.from(
      {
        length:
          concurrency,
      },
      () => worker()
    );

  await Promise.all(
    workers
  );

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
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

  failures:
    OpportunityScannerFailure[];

  discovery:
    OpportunityDiscoveryResult;
}

export interface OpportunityScannerOptions {
  concurrency?: number;

  batchSize?: number;

  batchDelayMs?: number;

  sleep?: (
    delayMs: number
  ) => Promise<void>;
}

const defaultSleep =
  async (
    delayMs: number
  ): Promise<void> => {
    if (delayMs <= 0) {
      return;
    }

    await new Promise<void>(
      (resolve) => {
        setTimeout(
          resolve,
          delayMs
        );
      }
    );
  };

export async function scanOpportunities(
  sources:
    OpportunityScannerSource[],
  input:
    OpportunityDiscoveryInput,
  options:
    OpportunityScannerOptions = {}
): Promise<OpportunityScannerResult> {
  const candidates:
    OpportunityCandidate[] = [];

  const failures:
    OpportunityScannerFailure[] = [];

  let analyzedCount = 0;

  // =====================================
  // CONCURRENCY
  // =====================================

  const requestedConcurrency =
    options.concurrency ?? 1;

  if (
    !Number.isInteger(
      requestedConcurrency
    ) ||
    requestedConcurrency <= 0
  ) {
    throw new Error(
      "Scanner concurrency must be a positive integer."
    );
  }

  // =====================================
  // BATCH SIZE
  // =====================================

  const requestedBatchSize =
    options.batchSize ??
    Math.max(
      sources.length,
      1
    );

  if (
    !Number.isInteger(
      requestedBatchSize
    ) ||
    requestedBatchSize <= 0
  ) {
    throw new Error(
      "Scanner batch size must be a positive integer."
    );
  }

  // =====================================
  // BATCH DELAY
  // =====================================

  const batchDelayMs =
    options.batchDelayMs ?? 0;

  if (
    !Number.isFinite(
      batchDelayMs
    ) ||
    batchDelayMs < 0
  ) {
    throw new Error(
      "Scanner batch delay must be a non-negative number."
    );
  }

  const sleep =
    options.sleep ??
    defaultSleep;

  // =====================================
  // PROCESS ONE BATCH
  // =====================================

  async function processBatch(
    batch:
      OpportunityScannerSource[]
  ): Promise<void> {
    const concurrency =
      Math.min(
        requestedConcurrency,
        Math.max(
          batch.length,
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
          batch.length
        ) {
          return;
        }

        const source =
          batch[currentIndex];

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
  }

  // =====================================
  // FIXED BATCH EXECUTION
  // =====================================

  for (
    let batchStart = 0;
    batchStart < sources.length;
    batchStart +=
      requestedBatchSize
  ) {
    const batch =
      sources.slice(
        batchStart,
        batchStart +
          requestedBatchSize
      );

    await processBatch(
      batch
    );

    const hasNextBatch =
      batchStart +
        requestedBatchSize <
      sources.length;

    if (
      hasNextBatch &&
      batchDelayMs > 0
    ) {
      await sleep(
        batchDelayMs
      );
    }
  }

  // =====================================
  // DISCOVERY
  // =====================================

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
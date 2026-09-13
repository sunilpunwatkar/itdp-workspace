import {
  buildOpportunityExperienceResponse,
} from "../app/services/opportunityExperienceResponseService";

import type {
  OpportunityScannerResult,
} from "../app/services/opportunityScannerService";

import type {
  OrchestratedScanResult,
} from "../app/services/scanOrchestratorService";

function assertEqual<T>(
  label: string,
  actual: T,
  expected: T
) {
  if (actual !== expected) {
    throw new Error(
      `${label} FAILED | Expected=${expected} | Actual=${actual}`
    );
  }

  console.log(
    `PASS | ${label} | ${String(actual)}`
  );
}

console.log(
  "=== OPPORTUNITY EXPERIENCE RESPONSE CONTRACT ==="
);

// ==========================================
// CONTROLLED TECHNICAL RESULT
// TRADE + WATCH + AVOID
// ==========================================

const technicalResult:
  OpportunityScannerResult = {
    scannedCount:
      4,

    analyzedCount:
      4,

    failedCount:
      0,

    candidateCount:
      3,

    failures:
      [],

    discovery: {
      universe:
        "NIFTY_500",

      horizon:
        "SHORT",

      scannedCount:
        4,

      analyzedCount:
        4,

      eligibleCount:
        3,

      opportunities: [
        {
          symbol:
            "BUY.TEST",

          decision:
            "BUY",

          entry:
            100,

          stopLoss:
            95,

          target1:
            110,

          target2:
            115,

          riskRewardRatio:
            2,

          quantity:
            20,

          maxRisk:
            100,

          riskGateStatus:
            "PASS",

          opportunityScore:
            96,

          classification:
            "PRIME",
        },

        {
          symbol:
            "WATCH.TEST",

          decision:
            "BUY",

          entry:
            200,

          stopLoss:
            190,

          target1:
            220,

          target2:
            230,

          riskRewardRatio:
            2,

          quantity:
            10,

          maxRisk:
            100,

          riskGateStatus:
            "CAUTION",

          opportunityScore:
            82,

          classification:
            "STRONG",
        },

        {
          symbol:
            "BLOCK.TEST",

          decision:
            "SELL",

          entry:
            300,

          stopLoss:
            315,

          target1:
            270,

          target2:
            255,

          riskRewardRatio:
            2,

          quantity:
            6,

          maxRisk:
            90,

          riskGateStatus:
            "BLOCK",

          opportunityScore:
            40,

          classification:
            "REJECT",
        },
      ],
    },
  };

// ==========================================
// CASE 1
// LIVE RESPONSE
// TRADE PRESENT
// ==========================================

const liveScan:
  OrchestratedScanResult<
    OpportunityScannerResult
  > = {
    source:
      "LIVE",

    metadata: {
      scanId:
        "EXPERIENCE-LIVE-1",

      universe:
        "ITDP_REAL_100|NIFTY_500|SHORT|BALANCED|75000|10",

      startedAt:
        1000,

      completedAt:
        2000,

      durationMs:
        1000,

      scannedCount:
        4,

      analyzedCount:
        4,

      failedCount:
        0,
    },

    result:
      technicalResult,
  };

const liveResponse =
  buildOpportunityExperienceResponse(
    liveScan
  );

assertEqual(
  "LIVE Source",
  liveResponse.source,
  "LIVE"
);

assertEqual(
  "LIVE Scan ID",
  liveResponse.scanId,
  "EXPERIENCE-LIVE-1"
);

assertEqual(
  "LIVE Scanned Count",
  liveResponse.scannedCount,
  4
);

assertEqual(
  "LIVE Analyzed Count",
  liveResponse.analyzedCount,
  4
);

assertEqual(
  "LIVE Failed Count",
  liveResponse.failedCount,
  0
);

assertEqual(
  "Trade Available State",
  liveResponse.state,
  "OPPORTUNITIES_AVAILABLE"
);

assertEqual(
  "Experience Total",
  liveResponse.experience.totalOpportunities,
  3
);

assertEqual(
  "Experience Trade Count",
  liveResponse.experience.tradeCount,
  1
);

assertEqual(
  "Experience Watch Count",
  liveResponse.experience.watchCount,
  1
);

assertEqual(
  "First Action",
  liveResponse.experience.opportunities[0]
    .action,
  "TRADE"
);

assertEqual(
  "Second Action",
  liveResponse.experience.opportunities[1]
    .action,
  "WATCH"
);

assertEqual(
  "Third Action",
  liveResponse.experience.opportunities[2]
    .action,
  "AVOID"
);

// ==========================================
// CASE 2
// TRADING VALUES PASSTHROUGH
// ==========================================

const firstOpportunity =
  liveResponse.experience
    .opportunities[0];

assertEqual(
  "Entry Passthrough",
  firstOpportunity.entry,
  100
);

assertEqual(
  "Stop Loss Passthrough",
  firstOpportunity.stopLoss,
  95
);

assertEqual(
  "Target 1 Passthrough",
  firstOpportunity.target1,
  110
);

assertEqual(
  "Target 2 Passthrough",
  firstOpportunity.target2,
  115
);

assertEqual(
  "Quantity Passthrough",
  firstOpportunity.quantity,
  20
);

assertEqual(
  "Max Risk Passthrough",
  firstOpportunity.maxRisk,
  100
);

assertEqual(
  "Risk Reward Passthrough",
  firstOpportunity.riskRewardRatio,
  2
);

assertEqual(
  "Headline Passthrough",
  firstOpportunity.headline,
  "BUY.TEST has a validated BUY opportunity."
);

// ==========================================
// CASE 3
// CACHE RESPONSE
// ==========================================

const cacheScan:
  OrchestratedScanResult<
    OpportunityScannerResult
  > = {
    ...liveScan,

    source:
      "CACHE",

    metadata: {
      ...liveScan.metadata,

      scanId:
        "EXPERIENCE-CACHE-1",
    },
  };

const cacheResponse =
  buildOpportunityExperienceResponse(
    cacheScan
  );

assertEqual(
  "CACHE Source",
  cacheResponse.source,
  "CACHE"
);

assertEqual(
  "CACHE Scan ID",
  cacheResponse.scanId,
  "EXPERIENCE-CACHE-1"
);

assertEqual(
  "CACHE State",
  cacheResponse.state,
  "OPPORTUNITIES_AVAILABLE"
);

assertEqual(
  "CACHE Experience Total",
  cacheResponse.experience.totalOpportunities,
  3
);

assertEqual(
  "CACHE First Action",
  cacheResponse.experience.opportunities[0]
    .action,
  "TRADE"
);

// ==========================================
// CASE 4
// WATCHLIST ONLY
// NO TRADE AVAILABLE
// ==========================================

const watchOnlyResult:
  OpportunityScannerResult = {
    scannedCount:
      1,

    analyzedCount:
      1,

    failedCount:
      0,

    candidateCount:
      1,

    failures:
      [],

    discovery: {
      universe:
        "NIFTY_500",

      horizon:
        "SHORT",

      scannedCount:
        1,

      analyzedCount:
        1,

      eligibleCount:
        1,

      opportunities: [
        {
          symbol:
            "WATCH.ONLY",

          decision:
            "BUY",

          entry:
            500,

          stopLoss:
            480,

          target1:
            540,

          target2:
            560,

          riskRewardRatio:
            2,

          quantity:
            5,

          maxRisk:
            100,

          riskGateStatus:
            "CAUTION",

          opportunityScore:
            80,

          classification:
            "STRONG",
        },
      ],
    },
  };

const watchOnlyScan:
  OrchestratedScanResult<
    OpportunityScannerResult
  > = {
    source:
      "LIVE",

    metadata: {
      scanId:
        "WATCH-ONLY-1",

      universe:
        "WATCH-ONLY",

      startedAt:
        3000,

      completedAt:
        4000,

      durationMs:
        1000,

      scannedCount:
        1,

      analyzedCount:
        1,

      failedCount:
        0,
    },

    result:
      watchOnlyResult,
  };

const watchOnlyResponse =
  buildOpportunityExperienceResponse(
    watchOnlyScan
  );

assertEqual(
  "Watchlist Only State",
  watchOnlyResponse.state,
  "WATCHLIST_ONLY"
);

assertEqual(
  "Watchlist Trade Count",
  watchOnlyResponse.experience.tradeCount,
  0
);

assertEqual(
  "Watchlist Watch Count",
  watchOnlyResponse.experience.watchCount,
  1
);

assertEqual(
  "Watchlist Action",
  watchOnlyResponse.experience.opportunities[0]
    .action,
  "WATCH"
);

// ==========================================
// CASE 5
// NO OPPORTUNITY
// ==========================================

const noOpportunityResult:
  OpportunityScannerResult = {
    scannedCount:
      5,

    analyzedCount:
      5,

    failedCount:
      0,

    candidateCount:
      0,

    failures:
      [],

    discovery: {
      universe:
        "NIFTY_500",

      horizon:
        "SHORT",

      scannedCount:
        5,

      analyzedCount:
        5,

      eligibleCount:
        0,

      opportunities:
        [],
    },
  };

const noOpportunityScan:
  OrchestratedScanResult<
    OpportunityScannerResult
  > = {
    source:
      "LIVE",

    metadata: {
      scanId:
        "NO-OPPORTUNITY-1",

      universe:
        "NO-OPPORTUNITY",

      startedAt:
        5000,

      completedAt:
        6000,

      durationMs:
        1000,

      scannedCount:
        5,

      analyzedCount:
        5,

      failedCount:
        0,
    },

    result:
      noOpportunityResult,
  };

const noOpportunityResponse =
  buildOpportunityExperienceResponse(
    noOpportunityScan
  );

assertEqual(
  "No Opportunity State",
  noOpportunityResponse.state,
  "NO_OPPORTUNITY"
);

assertEqual(
  "No Opportunity Total",
  noOpportunityResponse.experience
    .totalOpportunities,
  0
);

assertEqual(
  "No Opportunity Trade Count",
  noOpportunityResponse.experience
    .tradeCount,
  0
);

assertEqual(
  "No Opportunity Watch Count",
  noOpportunityResponse.experience
    .watchCount,
  0
);

assertEqual(
  "No Opportunity Item Count",
  noOpportunityResponse.experience
    .opportunities.length,
  0
);

console.log("");

console.log(
  "ALL OPPORTUNITY EXPERIENCE RESPONSE CONTRACT CASES PASS"
);
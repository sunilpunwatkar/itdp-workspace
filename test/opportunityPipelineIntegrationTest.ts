import {
  seedHistoricalCacheForTest,
  clearHistoricalCacheForTest,
} from "../app/services/historicalDataCache";

import {
  getStockAnalysis,
} from "../services/stockAnalysisService";

import {
  buildOpportunityCandidateFromAnalysis,
} from "../app/services/opportunityAdapterService";

import {
  buildOpportunityDiscoveryResult,
  OpportunityDiscoveryInput,
} from "../app/services/opportunityDiscoveryService";

import {
  GOLDEN_BUY_SYMBOL,
  goldenBuyMarketProvider,
  buildGoldenBuyOHLC,
} from "./fixtures/goldenBuyFixture";

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

async function run() {
  console.log(
    "=== OPPORTUNITY PIPELINE INTEGRATION TEST ==="
  );

  clearHistoricalCacheForTest();

  seedHistoricalCacheForTest(
    GOLDEN_BUY_SYMBOL,
    buildGoldenBuyOHLC()
  );

  const analysis =
    await getStockAnalysis(
      GOLDEN_BUY_SYMBOL,
      goldenBuyMarketProvider
    );

  // ================================================
  // ANALYSIS CONTRACT
  // ================================================

  assertEqual(
    "Analysis Decision",
    analysis.decision,
    "BUY"
  );

  assertEqual(
    "Analysis Risk Gate",
    analysis.riskGate.status,
    "PASS"
  );

  assertEqual(
    "Analysis Entry Context",
    analysis.entryContext,
    "FAVORABLE"
  );

  // ================================================
  // ADAPTER CONTRACT
  // ================================================

  const candidate =
    buildOpportunityCandidateFromAnalysis(
      analysis
    );

  if (!candidate) {
    throw new Error(
      "Adapter FAILED | Candidate is null"
    );
  }

  assertEqual(
    "Candidate Symbol",
    candidate.symbol,
    GOLDEN_BUY_SYMBOL
  );

  assertEqual(
    "Candidate Decision",
    candidate.decision,
    "BUY"
  );

  assertEqual(
    "Candidate Entry",
    candidate.entry,
    1364
  );

  assertEqual(
    "Candidate Stop Loss",
    candidate.stopLoss,
    1354.29
  );

  assertEqual(
    "Candidate Target 1",
    candidate.target1,
    1378.57
  );

  assertEqual(
    "Candidate Target 2",
    candidate.target2,
    1383.42
  );

  assertEqual(
    "Candidate Risk Reward",
    candidate.riskRewardRatio,
    1.5
  );

  assertEqual(
    "Candidate Quantity",
    candidate.quantity,
    154
  );

  assertEqual(
    "Candidate Risk Gate",
    candidate.riskGateStatus,
    "PASS"
  );

  assertEqual(
    "Candidate Opportunity Score",
    candidate.opportunityScore,
    96
  );

  assertEqual(
    "Candidate Classification",
    candidate.classification,
    "PRIME"
  );

  // ================================================
  // DISCOVERY CONTRACT
  // ================================================

  const discoveryInput: OpportunityDiscoveryInput = {
    capital: 75000,
    horizon: "SHORT",
    riskProfile: "BALANCED",
    universe: "NIFTY_500",
    maxResults: 5,
  };

  const discovery =
    buildOpportunityDiscoveryResult(
      discoveryInput,
      [candidate]
    );

  assertEqual(
    "Discovery Scanned Count",
    discovery.scannedCount,
    1
  );

  assertEqual(
    "Discovery Analyzed Count",
    discovery.analyzedCount,
    1
  );

  assertEqual(
    "Discovery Eligible Count",
    discovery.eligibleCount,
    1
  );

  assertEqual(
    "Discovery Opportunity Count",
    discovery.opportunities.length,
    1
  );

  assertEqual(
    "Top Opportunity Symbol",
    discovery.opportunities[0]?.symbol,
    GOLDEN_BUY_SYMBOL
  );

  assertEqual(
    "Top Opportunity Classification",
    discovery.opportunities[0]?.classification,
    "PRIME"
  );

  assertEqual(
    "Top Opportunity Score",
    discovery.opportunities[0]?.opportunityScore,
    96
  );

  console.log("");
  console.log(
    "GOLDEN BUY OPPORTUNITY PIPELINE: PASSED"
  );

  console.log(
    "FULL DISCOVERY INTEGRATION CONTRACT: GREEN"
  );

  clearHistoricalCacheForTest();
}

run().catch((error) => {
  clearHistoricalCacheForTest();

  console.error("");
  console.error(
    "OPPORTUNITY PIPELINE INTEGRATION: FAILED"
  );

  console.error(error);

  process.exit(1);
});
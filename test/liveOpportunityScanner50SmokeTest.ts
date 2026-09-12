import {
  getStockUniverse,
} from "../app/services/stockUniverseService";

import {
  buildOpportunityScannerSources,
} from "../app/services/opportunityScannerSourceFactory";

import {
  scanOpportunities,
} from "../app/services/opportunityScannerService";

async function run() {
  console.log(
    "=== LIVE OPPORTUNITY SCANNER 50 SMOKE TEST ==="
  );

  const universe =
    getStockUniverse(
      "ITDP_REAL_50"
    );

  console.log(
    "Universe Size:",
    universe.symbols.length
  );

  const sources =
    buildOpportunityScannerSources(
      universe.symbols
    );

  const result =
    await scanOpportunities(
      sources,
      {
        capital: 75000,
        horizon: "SHORT",
        riskProfile: "BALANCED",
        universe: "NIFTY_500",
        maxResults: 10,
      },
      {
        concurrency: 3,
        batchSize: 10,
        batchDelayMs: 1000,
      }
    );

  console.log("");
  console.log(
    "=== SCAN SUMMARY ==="
  );

  console.log({
    scannedCount:
      result.scannedCount,

    analyzedCount:
      result.analyzedCount,

    failedCount:
      result.failedCount,

    candidateCount:
      result.candidateCount,

    eligibleCount:
      result.discovery.eligibleCount,
  });

  console.log("");
  console.log(
    "=== FAILURES ==="
  );

  console.log(
    result.failures
  );

  console.log("");
  console.log(
    "=== TOP OPPORTUNITIES ==="
  );

  console.log(
    result.discovery.opportunities.map(
      (item) => ({
        symbol:
          item.symbol,

        decision:
          item.decision,

        score:
          item.opportunityScore,

        classification:
          item.classification,

        entry:
          item.entry,

        stopLoss:
          item.stopLoss,

        target1:
          item.target1,

        target2:
          item.target2,

        riskReward:
          item.riskRewardRatio,

        quantity:
          item.quantity,

        riskGate:
          item.riskGateStatus,
      })
    )
  );

  console.log("");
  console.log(
    "LIVE OPPORTUNITY SCANNER 50 SMOKE TEST COMPLETE"
  );
}

run().catch((error) => {
  console.error("");
  console.error(
    "LIVE OPPORTUNITY SCANNER 50 SMOKE TEST FAILED"
  );

  console.error(error);

  process.exit(1);
});
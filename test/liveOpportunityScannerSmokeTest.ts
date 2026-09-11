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
    "=== LIVE OPPORTUNITY SCANNER SMOKE TEST ==="
  );

  const universe =
    getStockUniverse(
      "ITDP_REAL_5"
    );

  console.log(
    "Universe:",
    universe.symbols
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
        maxResults: 5,
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
    "LIVE OPPORTUNITY SCANNER SMOKE TEST COMPLETE"
  );
}

run().catch((error) => {
  console.error("");
  console.error(
    "LIVE OPPORTUNITY SCANNER SMOKE TEST FAILED"
  );

  console.error(error);

  process.exit(1);
});
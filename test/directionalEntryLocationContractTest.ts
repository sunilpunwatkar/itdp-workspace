import { calculatePriceLocationIntelligence } from "../app/services/priceLocationIntelligenceService";
import { calculateConflictEngine } from "../app/services/conflictEngineService";
import { calculateEntryContextIntelligence } from "../app/services/entryContextIntelligenceService";

const support1 = 1250;
const resistance1 = 1340;
const atr = 10;

const failures: string[] = [];

function check(
  decision: "BUY" | "SELL",
  price: number,
  expectedEntry:
    | "FAVORABLE"
    | "CAUTION"
    | "UNFAVORABLE"
) {
  const location = calculatePriceLocationIntelligence(
    price,
    support1,
    resistance1,
    atr
  );

  const direction =
    decision === "BUY" ? "STRONG_BULLISH" : "STRONG_BEARISH";

  const momentumDirection = direction;
  const momentumStrength = "STRONG" as const;
  const momentumAgreement = "AGREE" as const;

  const evidence =
    decision === "BUY" ? "BULLISH_EVIDENCE" : "BEARISH_EVIDENCE";

  const conflict = calculateConflictEngine(
    direction,
    "STRONG_ALIGNMENT",
    momentumDirection,
    momentumStrength,
    momentumAgreement,
    location.location,
    location.locationQuality,
    evidence,
    "STRONG",
    "STRONG_ALIGNMENT"
  );

  const entry = calculateEntryContextIntelligence({
    decision,
    decisionStrength: "STRONG",
    decisionQuality: "HIGH",
    location: location.location,
    locationQuality: location.locationQuality,
    conflictSeverity: conflict.conflictSeverity,
    reliability: conflict.reliabilityImpact,
  });

  const actual = entry.entryContext;
  const status = actual === expectedEntry ? "PASS" : "FAIL";

  console.log(
    `${status} | ${decision} + ${location.location.padEnd(18)} | ` +
    `Expected=${expectedEntry.padEnd(12)} | Actual=${actual.padEnd(12)} | ` +
    `Conflict=${conflict.conflictStatus.padEnd(11)} | ` +
    `Severity=${conflict.conflictSeverity.padEnd(8)} | ` +
    `Reliability=${conflict.reliabilityImpact}`
  );

  if (actual !== expectedEntry) {
    failures.push(
      `${decision} + ${location.location}: expected ${expectedEntry}, got ${actual}`
    );
  }
}

console.log("=== DIRECTIONAL ENTRY LOCATION CONTRACT ===");

check("BUY", 1260, "FAVORABLE");
check("BUY", 1330, "UNFAVORABLE");

check("SELL", 1260, "UNFAVORABLE");
check("SELL", 1330, "FAVORABLE");

check("BUY", 1310, "CAUTION");
check("SELL", 1310, "CAUTION");

console.log("");
console.log("=== CONTRACT DIAGNOSTIC SUMMARY ===");

if (failures.length === 0) {
  console.log("ALL CONTRACT CASES PASS");
} else {
  console.log(`FAILURES: ${failures.length}`);
  for (const failure of failures) {
    console.log(`- ${failure}`);
  }
}

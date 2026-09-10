import { calculateDirectionIntelligence } from "../app/services/directionIntelligenceService";
import { calculateMomentumIntelligence } from "../app/services/momentumIntelligenceService";
import { calculatePriceLocationIntelligence } from "../app/services/priceLocationIntelligenceService";
import { calculateEvidenceSynthesis } from "../app/services/evidenceSynthesisService";
import { calculateConflictEngine } from "../app/services/conflictEngineService";
import { calculateFinalDecision } from "../app/services/finalDecisionIntelligenceService";
import { calculateEntryContextIntelligence } from "../app/services/entryContextIntelligenceService";
import { buildRiskPlan } from "../app/services/riskEngine";
import { calculatePositionSize } from "../app/services/positionSizingService";
import { calculateRiskGateIntelligence } from "../app/services/riskGateIntelligenceService";

const atr = 10;

const support1 = 1250;
const support2 = 1240;

const resistance1 = 1340;
const resistance2 = 1380;

const capital = 75000;
const riskPercent = 2;

const testCases = [
  {
    label: "MID_RANGE",
    price: 1310,
  },
  {
    label: "NEAR_RESISTANCE",
    price: 1330,
  },
];

for (const testCase of testCases) {
  const price = testCase.price;

  const direction = calculateDirectionIntelligence(
    1250,
    1300,
    1350,
    atr
  );

  const momentum = calculateMomentumIntelligence(
    35,
    "SELL",
    -3
  );

  const location = calculatePriceLocationIntelligence(
    price,
    support1,
    resistance1,
    atr
  );

  const evidence = calculateEvidenceSynthesis(
    direction.direction,
    momentum.momentumDirection,
    momentum.momentumStrength,
    momentum.agreement,
    location.location,
    location.locationQuality
  );

  const conflict = calculateConflictEngine(
    direction.direction,
    direction.evidence,
    momentum.momentumDirection,
    momentum.momentumStrength,
    momentum.agreement,
    location.location,
    location.locationQuality,
    evidence.overallEvidence,
    evidence.evidenceStrength,
    evidence.evidenceAlignment
  );

  const finalDecision = calculateFinalDecision({
    direction: direction.direction,
    momentumDirection: momentum.momentumDirection,
    momentumStrength: momentum.momentumStrength,
    momentumAgreement: momentum.agreement,
    location: location.location,
    locationQuality: location.locationQuality,
    overallEvidence: evidence.overallEvidence,
    evidenceStrength: evidence.evidenceStrength,
    evidenceAlignment: evidence.evidenceAlignment,
    conflictStatus: conflict.conflictStatus,
    conflictSeverity: conflict.conflictSeverity,
    conflictCount: conflict.conflictCount,
    reliabilityImpact: conflict.reliabilityImpact,
  });

  const entryContext = calculateEntryContextIntelligence({
    decision: finalDecision.decision,
    decisionStrength: finalDecision.decisionStrength,
    decisionQuality: finalDecision.decisionQuality,
    location: location.location,
    locationQuality: location.locationQuality,
    conflictSeverity: conflict.conflictSeverity,
    reliability: conflict.reliabilityImpact,
  });

  const riskPlan = buildRiskPlan(
    price,
    atr,
    finalDecision.decision,
    support1,
    support2,
    resistance1,
    resistance2
  );

  const position =
    riskPlan.stopLoss !== null
      ? calculatePositionSize(
          capital,
          riskPercent,
          price,
          riskPlan.stopLoss
        )
      : {
          capital,
          riskPercent,
          maxRisk: capital * (riskPercent / 100),
          quantity: 0,
        };

  const riskGate =
    riskPlan.stopLoss !== null &&
    riskPlan.target1 !== null &&
    riskPlan.riskRewardRatio !== null
      ? calculateRiskGateIntelligence({
          decision: finalDecision.decision,
          entryContext: entryContext.entryContext,
          conflictSeverity: conflict.conflictSeverity,
          reliability: conflict.reliabilityImpact,
          decisionQuality: finalDecision.decisionQuality,
          entry: price,
          stopLoss: riskPlan.stopLoss,
          target1: riskPlan.target1,
          riskReward: riskPlan.riskRewardRatio,
          quantity: position.quantity,
        })
      : null;

  console.log("");
  console.log("==============================================");
  console.log(`       SELL RISK GATE CASE: ${testCase.label}`);
  console.log("==============================================");

  console.log("PRICE LOCATION");
  console.log(location);

  console.log("");
  console.log("CONFLICT");
  console.log(conflict);

  console.log("");
  console.log("FINAL DECISION");
  console.log(finalDecision);

  console.log("");
  console.log("ENTRY CONTEXT");
  console.log(entryContext);

  console.log("");
  console.log("RISK PLAN");
  console.log(riskPlan);

  console.log("");
  console.log("POSITION SIZE");
  console.log(position);

  console.log("");
  console.log("RISK GATE");
  console.log(riskGate);

  console.log("");
  console.log("FINAL CONTRACT");
  console.log({
    test: testCase.label,
    price,
    location: location.location,
    locationQuality: location.locationQuality,
    conflict: conflict.conflictStatus,
    conflictSeverity: conflict.conflictSeverity,
    reliability: conflict.reliabilityImpact,
    decision: finalDecision.decision,
    decisionStrength: finalDecision.decisionStrength,
    decisionQuality: finalDecision.decisionQuality,
    entryContext: entryContext.entryContext,
    stopLoss: riskPlan.stopLoss,
    target1: riskPlan.target1,
    target2: riskPlan.target2,
    riskReward: riskPlan.riskReward,
    quantity: position.quantity,
    riskGate: riskGate?.status,
    failures: riskGate?.failures,
    warnings: riskGate?.warnings,
  });
}

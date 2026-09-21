import assert from "node:assert/strict";

import type {
  AnalysisResult,
} from "../app/types/analysis";

import type {
  StockMetadata,
} from "../app/services/stockMetadataService";

import {
  buildAnalysisApiResponse,
} from "../app/services/analysisResponseService";

function buildAnalysis():
  AnalysisResult {
  return {
    symbol: "RELIANCE.NS",

    decision: "HOLD",
    confidence: 60,
    risk: "MEDIUM",

    entryContext:
      "UNFAVORABLE",

    decisionStrength:
      "MODERATE",

    decisionQuality:
      "NO_TRADE",

    decisionReliability:
      "MEDIUM",

    conflictSeverity:
      "MODERATE",

    entry: 1330,
    target: 0,
    target1: 0,

    support1: 1312.6,
    support2: 1298.1,

    resistance1: 1337,
    resistance2: 1344.9,

    target2: 0,
    stopLoss: 0,

    riskReward: "N/A",

    capital: 75000,
    riskPercent: 2,
    maxRisk: 1500,
    quantity: 0,

    tradeQuality:
      "NO TRADE",

    holdingPeriod:
      "WAIT",

    aiSummary:
      "No valid trade setup.",

    reasons: [
      "Conflicting evidence",
    ],

    invalidIf:
      "Market structure changes",

    riskGate: {
  status: "BLOCK",
  reason:
    "Critical risk conditions failed. Trade execution is blocked.",
  failures: [],
  warnings: [],
},
  };
}

function run(): void {
  console.log(
    "=== ANALYSIS RESPONSE ENRICHMENT CONTRACT ==="
  );

  const analysis =
    buildAnalysis();

  const metadata:
    StockMetadata = {
      symbol: "RELIANCE.NS",
      companyName:
        "Reliance Industries Limited",
      exchange: "NSE",
      instrumentType:
        "EQUITY",
      currency: "INR",
    };

  // ==========================================
  // 1. METADATA AVAILABLE
  // ==========================================

  const enriched =
    buildAnalysisApiResponse(
      analysis,
      metadata
    );

  assert.equal(
    enriched.symbol,
    "RELIANCE.NS",
    "Core analysis symbol must remain unchanged"
  );

  assert.equal(
    enriched.decision,
    analysis.decision,
    "Core decision must remain unchanged"
  );

  assert.deepEqual(
    enriched.metadata,
    metadata,
    "Available metadata must be attached unchanged"
  );

  assert.notStrictEqual(
    enriched,
    analysis,
    "Enrichment must not mutate the original analysis object"
  );

  assert.equal(
    "metadata" in analysis,
    false,
    "Core AnalysisResult must remain metadata-free"
  );

  console.log(
    "PASS: metadata enrichment"
  );

  // ==========================================
  // 2. METADATA UNAVAILABLE
  // ==========================================

  const withoutMetadata =
    buildAnalysisApiResponse(
      analysis,
      null
    );

  assert.equal(
    withoutMetadata.symbol,
    analysis.symbol,
    "Analysis must survive missing metadata"
  );

  assert.equal(
    withoutMetadata.decision,
    analysis.decision,
    "Decision must survive missing metadata"
  );

  assert.equal(
    withoutMetadata.metadata,
    undefined,
    "Missing metadata must not create fake metadata"
  );

  console.log(
    "PASS: metadata optional"
  );

  // ==========================================
  // 3. CORE RESULT IMMUTABILITY
  // ==========================================

  assert.equal(
    analysis.symbol,
    "RELIANCE.NS"
  );

  assert.equal(
    analysis.decision,
    "HOLD"
  );

  assert.equal(
    "metadata" in analysis,
    false
  );

  console.log(
    "PASS: core analysis untouched"
  );

  console.log("");

  console.log(
    "ANALYSIS RESPONSE ENRICHMENT CONTRACT: PASS"
  );
}

run();
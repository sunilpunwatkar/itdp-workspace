import {
  classifyProviderRetryDecision,
} from "../app/services/providerRetryPolicy";


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
  "=== PROVIDER RETRY POLICY CONTRACT TEST ==="
);

// ==================================================
// RETRYABLE
// ==================================================

assertEqual(
  "HTTP 429 Retryable",
  classifyProviderRetryDecision(
    "Yahoo rate limit (HTTP 429) for RELIANCE.NS."
  ),
  "RETRY"
);

assertEqual(
  "HTTP 500 Retryable",
  classifyProviderRetryDecision(
    "Yahoo historical HTTP 500 for RELIANCE.NS."
  ),
  "RETRY"
);

assertEqual(
  "HTTP 502 Retryable",
 classifyProviderRetryDecision(
    "Yahoo historical HTTP 502 for RELIANCE.NS."
  ),
  "RETRY"
);

assertEqual(
  "HTTP 503 Retryable",
  classifyProviderRetryDecision(
    "Yahoo historical HTTP 503 for RELIANCE.NS."
  ),
  "RETRY"
);

assertEqual(
  "Timeout Retryable",
  classifyProviderRetryDecision(
    "Yahoo OHLC request timed out after 12s for RELIANCE.NS"
  ),
  "RETRY"
);

// ==================================================
// DO NOT RETRY
// ==================================================

assertEqual(
  "HTTP 404 Not Retryable",
  classifyProviderRetryDecision(
    "Yahoo historical HTTP 404 for UNKNOWN.NS."
  ),
  "DO_NOT_RETRY"
);

assertEqual(
  "Empty Data Not Retryable",
  classifyProviderRetryDecision(
    "Yahoo returned empty data."
  ),
  "DO_NOT_RETRY"
);

assertEqual(
  "Invalid Price Not Retryable",
  classifyProviderRetryDecision(
    "Yahoo returned invalid price for RELIANCE.NS"
  ),
  "DO_NOT_RETRY"
);

assertEqual(
  "Unknown Error Not Retryable",
  classifyProviderRetryDecision(
    "Unexpected parsing failure"
  ),
  "DO_NOT_RETRY"
);

console.log("");
console.log(
  "ALL PROVIDER RETRY POLICY CONTRACT CASES PASS"
);
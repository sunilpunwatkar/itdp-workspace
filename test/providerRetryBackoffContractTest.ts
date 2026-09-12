import {
  calculateProviderRetryBackoffMs,
} from "../app/services/providerRetryBackoff";
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
  "=== PROVIDER RETRY BACKOFF CONTRACT TEST ==="
);

// ==================================================
// TRANSIENT 5xx / TIMEOUT
// ==================================================

assertEqual(
  "Transient Attempt 1",
  calculateProviderRetryBackoffMs(
    "TRANSIENT",
    1
  ),
  500
);

assertEqual(
  "Transient Attempt 2",
  calculateProviderRetryBackoffMs(
    "TRANSIENT",
    2
  ),
  1000
);

assertEqual(
  "Transient Attempt 3",
  calculateProviderRetryBackoffMs(
    "TRANSIENT",
    3
  ),
  2000
);

// ==================================================
// RATE LIMIT 429
// ==================================================

assertEqual(
  "Rate Limit Attempt 1",
  calculateProviderRetryBackoffMs(
    "RATE_LIMIT",
    1
  ),
  2000
);

assertEqual(
  "Rate Limit Attempt 2",
 calculateProviderRetryBackoffMs(
    "RATE_LIMIT",
    2
  ),
  4000
);

assertEqual(
  "Rate Limit Attempt 3",
  calculateProviderRetryBackoffMs(
    "RATE_LIMIT",
    3
  ),
  8000
);

// ==================================================
// INVALID ATTEMPT
// ==================================================

let invalidAttemptRejected = false;

try {
  calculateProviderRetryBackoffMs(
    "TRANSIENT",
    0
  );
} catch {
  invalidAttemptRejected = true;
}

assertEqual(
  "Invalid Attempt Rejected",
  invalidAttemptRejected,
  true
);

console.log("");
console.log(
  "ALL PROVIDER RETRY BACKOFF CONTRACT CASES PASS"
);
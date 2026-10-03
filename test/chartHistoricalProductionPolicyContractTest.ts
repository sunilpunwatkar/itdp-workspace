import {
  DEFAULT_CHART_PRIMARY_TIMEOUT_MS,
} from "../app/services/chartHistoricalRuntimeService";

function run() {
  console.log(
    "=== CHART PRODUCTION POLICY CONTRACT ==="
  );

  if (
    DEFAULT_CHART_PRIMARY_TIMEOUT_MS !==
    8_000
  ) {
    throw new Error(
      `Expected production Chart primary timeout 8000ms, received ${DEFAULT_CHART_PRIMARY_TIMEOUT_MS}`
    );
  }

  console.log(
    "PASS: Production Chart primary timeout policy is 8000ms"
  );
}

try {
  run();
} catch (error) {
  console.error(
    "CHART PRODUCTION POLICY CONTRACT: FAIL"
  );

  console.error(error);

  process.exit(1);
}

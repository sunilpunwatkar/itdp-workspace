import {
  runSharedScan,
} from "../app/services/scanInFlightCoordinatorService";

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
    "=== SCAN IN-FLIGHT COORDINATOR CONTRACT ==="
  );

  // ==========================================
  // CASE 1
  // SAME UNIVERSE SHARES ONE OPERATION
  // ==========================================

  let sameUniverseCalls = 0;

  let releaseSameUniverse:
    () => void =
      () => {};

  const sameUniverseGate =
    new Promise<void>(
      (resolve) => {
        releaseSameUniverse =
          resolve;
      }
    );

  const first =
    runSharedScan(
      "ITDP_REAL_100",
      async () => {
        sameUniverseCalls += 1;

        await sameUniverseGate;

        return "REAL_100_RESULT";
      }
    );

  const second =
    runSharedScan(
      "ITDP_REAL_100",
      async () => {
        sameUniverseCalls += 1;

        return "SHOULD_NOT_RUN";
      }
    );

  assertEqual(
    "Same Universe Operation Count Before Release",
    sameUniverseCalls,
    1
  );

  releaseSameUniverse();

  const [
    firstResult,
    secondResult,
  ] =
    await Promise.all([
      first,
      second,
    ]);

  assertEqual(
    "First Shared Result",
    firstResult,
    "REAL_100_RESULT"
  );

  assertEqual(
    "Second Shared Result",
    secondResult,
    "REAL_100_RESULT"
  );

  assertEqual(
    "Same Universe Operation Count",
    sameUniverseCalls,
    1
  );

  // ==========================================
  // CASE 2
  // DIFFERENT UNIVERSES RUN INDEPENDENTLY
  // ==========================================

  let differentUniverseCalls = 0;

  const real50 =
    runSharedScan(
      "ITDP_REAL_50",
      async () => {
        differentUniverseCalls += 1;

        return "REAL_50_RESULT";
      }
    );

  const real100 =
    runSharedScan(
      "ITDP_REAL_100",
      async () => {
        differentUniverseCalls += 1;

        return "REAL_100_RESULT_2";
      }
    );

  const [
    real50Result,
    real100Result,
  ] =
    await Promise.all([
      real50,
      real100,
    ]);

  assertEqual(
    "Different Universe Operation Count",
    differentUniverseCalls,
    2
  );

  assertEqual(
    "REAL 50 Result",
    real50Result,
    "REAL_50_RESULT"
  );

  assertEqual(
    "REAL 100 Result",
    real100Result,
    "REAL_100_RESULT_2"
  );

  // ==========================================
  // CASE 3
  // COMPLETED SCAN IS REMOVED
  // ==========================================

  let sequentialCalls = 0;

  await runSharedScan(
    "ITDP_REAL_20",
    async () => {
      sequentialCalls += 1;

      return "FIRST";
    }
  );

  await runSharedScan(
    "ITDP_REAL_20",
    async () => {
      sequentialCalls += 1;

      return "SECOND";
    }
  );

  assertEqual(
    "Sequential Operation Count",
    sequentialCalls,
    2
  );

  // ==========================================
  // CASE 4
  // FAILED SCAN IS REMOVED
  // ==========================================

  let failureCalls = 0;

  try {
    await runSharedScan(
      "ITDP_FAILURE_TEST",
      async () => {
        failureCalls += 1;

        throw new Error(
          "CONTROLLED_SCAN_FAILURE"
        );
      }
    );
  } catch {
    // Expected.
  }

  const recoveryResult =
    await runSharedScan(
      "ITDP_FAILURE_TEST",
      async () => {
        failureCalls += 1;

        return "RECOVERED";
      }
    );

  assertEqual(
    "Failure Cleanup Operation Count",
    failureCalls,
    2
  );

  assertEqual(
    "Failure Recovery Result",
    recoveryResult,
    "RECOVERED"
  );

  console.log("");

  console.log(
    "ALL SCAN IN-FLIGHT COORDINATOR CONTRACT CASES PASS"
  );
}

run().catch((error) => {
  console.error("");

  console.error(
    "SCAN IN-FLIGHT COORDINATOR CONTRACT: FAILED"
  );

  console.error(error);

  process.exit(1);
});
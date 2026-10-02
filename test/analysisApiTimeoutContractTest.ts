import {
  handleAnalysisApiRequest,
} from "../app/services/analysisApiHandlerService";

async function run() {
  console.log(
    "=== ANALYSIS API TIMEOUT CONTRACT ==="
  );

  const neverResolvingAnalysis =
    () =>
      new Promise<never>(
        () => {}
      );

  const startedAt =
    Date.now();

  const response =
    await handleAnalysisApiRequest({
      symbol: "RELIANCE",

      analyze:
        neverResolvingAnalysis,

      timeoutMs: 50,
    });

  const elapsedMs =
    Date.now() - startedAt;

  if (response.status !== 503) {
    throw new Error(
      `Expected HTTP 503, received ${response.status}`
    );
  }

  const body =
    response.body as {
      error?: string;
    };

  if (
    body.error !==
    "ANALYSIS_TEMPORARILY_UNAVAILABLE"
  ) {
    throw new Error(
      `Unexpected public error: ${body.error}`
    );
  }

  if (elapsedMs > 500) {
    throw new Error(
      `Analysis API was not bounded: ${elapsedMs} ms`
    );
  }

  console.log(
    "PASS: Analysis API has bounded user-facing timeout"
  );
}

run().catch((error) => {
  console.error(
    "ANALYSIS API TIMEOUT CONTRACT: FAIL"
  );

  console.error(error);

  process.exit(1);
});

export interface AnalysisApiResponse {
  status: number;
  body: unknown;
}

export interface AnalysisApiHandlerDependencies {
  symbol: string | null;

  analyze: (
    symbol: string
  ) => Promise<unknown>;

  timeoutMs?: number;
}

const DEFAULT_ANALYSIS_TIMEOUT_MS =
  8_000;

class AnalysisTimeoutError extends Error {
  constructor() {
    super(
      "ANALYSIS_REQUEST_TIMEOUT"
    );

    this.name =
      "AnalysisTimeoutError";
  }
}

async function withAnalysisDeadline<T>(
  operation: Promise<T>,
  timeoutMs: number
): Promise<T> {
  let timeout:
    ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise =
    new Promise<never>(
      (_resolve, reject) => {
        timeout =
          setTimeout(
            () => {
              reject(
                new AnalysisTimeoutError()
              );
            },
            timeoutMs
          );
      }
    );

  try {
    return await Promise.race([
      operation,
      timeoutPromise,
    ]);
  } finally {
    if (
      timeout !== undefined
    ) {
      clearTimeout(
        timeout
      );
    }
  }
}

export async function handleAnalysisApiRequest(
  dependencies:
    AnalysisApiHandlerDependencies
): Promise<AnalysisApiResponse> {
  const symbol =
    dependencies.symbol?.trim();

  if (!symbol) {
    return {
      status: 400,
      body: {
        error: "INVALID_SYMBOL",
      },
    };
  }

  const timeoutMs =
    dependencies.timeoutMs ??
    DEFAULT_ANALYSIS_TIMEOUT_MS;

  try {
    const result =
      await withAnalysisDeadline(
        dependencies.analyze(
          symbol
        ),
        timeoutMs
      );

    return {
      status: 200,
      body: result,
    };
  } catch (error) {
    if (
      error instanceof
        AnalysisTimeoutError
    ) {
      console.warn(
        `Analysis API timed out after ${timeoutMs}ms for ${symbol}`
      );

      return {
        status: 503,
        body: {
          error:
            "ANALYSIS_TEMPORARILY_UNAVAILABLE",
        },
      };
    }

    console.error(
      "Analysis API internal error:",
      error
    );

    return {
      status: 500,
      body: {
        error:
          "INTERNAL_SERVER_ERROR",
      },
    };
  }
}

export interface AnalysisApiResponse {
  status: number;
  body: unknown;
}

export interface AnalysisApiHandlerDependencies {
  symbol: string | null;
  analyze: (
    symbol: string
  ) => Promise<unknown>;
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

  try {
    const result =
      await dependencies.analyze(
        symbol
      );

    return {
      status: 200,
      body: result,
    };
  } catch (error) {
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
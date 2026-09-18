export interface HistoryApiResponse {
  status: number;
  body: unknown;
}

export interface HistoryApiHandlerDependencies {
  symbol: string | null;
  analyze: (
    symbol: string
  ) => Promise<unknown>;
}

export async function handleHistoryApiRequest(
  dependencies:
    HistoryApiHandlerDependencies
): Promise<HistoryApiResponse> {
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
      "History API internal error:",
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
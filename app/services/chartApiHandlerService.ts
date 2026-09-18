export interface ChartApiResponse {
  status: number;
  body: unknown;
}

export interface ChartApiHandlerDependencies {
  symbol: string | null;

  getChartData: (
    symbol: string
  ) => Promise<unknown>;
}

export async function handleChartApiRequest(
  dependencies: ChartApiHandlerDependencies
): Promise<ChartApiResponse> {
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
    const data =
      await dependencies.getChartData(
        symbol
      );

    return {
      status: 200,
      body: data,
    };
  } catch (error) {
    console.error(
      "Chart API internal error:",
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
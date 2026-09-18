import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getStockAnalysis,
} from "../../../services/stockAnalysisService";

import {
  handleAnalysisApiRequest,
} from "../../services/analysisApiHandlerService";

const NO_CACHE_HEADERS = {
  "Cache-Control":
    "no-store, no-cache, must-revalidate",
  Pragma:
    "no-cache",
  Expires:
    "0",
};

export async function GET(
  request: NextRequest
) {
  const { searchParams } =
    new URL(request.url);

  const symbol =
    searchParams.get("symbol");

  const response =
    await handleAnalysisApiRequest({
      symbol,

      analyze:
        async (
          normalizedSymbol
        ) => {
          console.log(
            "API Symbol Received:",
            normalizedSymbol
          );

          const result =
            await getStockAnalysis(
              normalizedSymbol
            );

          console.log(
            "API Result Symbol:",
            result.symbol
          );

          return result;
        },
    });

  return NextResponse.json(
    response.body,
    {
      status:
        response.status,

      headers:
        NO_CACHE_HEADERS,
    }
  );
}
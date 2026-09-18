import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getChartData,
} from "../../services/chartDataService";

import {
  handleChartApiRequest,
} from "../../services/chartApiHandlerService";

const NO_CACHE_HEADERS = {
  "Cache-Control":
    "no-store, no-cache, must-revalidate",
  Pragma:
    "no-cache",
  Expires:
    "0",
};

let chartApiCallCount = 0;

export async function GET(
  request: NextRequest
) {
  chartApiCallCount++;

  console.log(
    `CHART API CALL #${chartApiCallCount}`
  );

  const { searchParams } =
    new URL(request.url);

  const symbol =
    searchParams.get("symbol");

  const response =
    await handleChartApiRequest({
      symbol,

      getChartData:
        async (
          normalizedSymbol
        ) => {
          console.log(
            "Chart API Symbol:",
            normalizedSymbol
          );

          return getChartData(
            normalizedSymbol
          );
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
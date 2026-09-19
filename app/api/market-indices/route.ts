import { NextResponse } from "next/server";

import {
  getMarketIndices,
} from "../../services/marketIndicesService";

import {
  handleMarketIndicesApiRequest,
} from "../../services/marketIndicesApiHandlerService";

export async function GET() {
  const result =
    await handleMarketIndicesApiRequest({
      getMarketIndices,
    });

  return NextResponse.json(
    result.body,
    {
      status: result.status,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate",
      },
    }
  );
}
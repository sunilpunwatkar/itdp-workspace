import { NextRequest, NextResponse } from "next/server";
import { getStockAnalysis } from "../../../services/stockAnalysisService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const symbol = searchParams.get("symbol");

    if (!symbol) {
      return NextResponse.json(
        {
          error: "Symbol is required",
        },
        {
          status: 400,
        }
      );
    }

    console.log("API Symbol Received:", symbol);

    const result = await getStockAnalysis(symbol);

    console.log("API Result Symbol:", result.symbol);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown Error",
      },
      {
        status: 500,
      }
    );
  }
}
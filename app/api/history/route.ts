import { NextRequest, NextResponse } from "next/server";
import { getStockAnalysis } from "../../../services/stockAnalysisService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const symbol = searchParams.get("symbol");

    if (!symbol) {
      return NextResponse.json(
        { error: "Symbol is required" },
        { status: 400 }
      );
    }

    const result = await getStockAnalysis(symbol);

    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown Error",
      },
      { status: 500 }
    );
  }
}
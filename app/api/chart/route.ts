import { NextRequest, NextResponse } from "next/server";
import { getChartData } from "../../services/chartDataService";

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

    console.log("Chart API Symbol:", symbol);

    const data = await getChartData(symbol);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });

  } catch (error) {

    console.error("Chart API Error:", error);

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
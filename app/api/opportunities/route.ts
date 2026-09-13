import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  handleOpportunityApiRequest,
} from "../../services/opportunityApiHandlerService";

export async function POST(
  request: NextRequest
) {
  const response =
    await handleOpportunityApiRequest({
      readBody:
        () =>
          request.json(),
    });

  return NextResponse.json(
    response.body,
    {
      status:
        response.status,

      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate",

        Pragma:
          "no-cache",

        Expires:
          "0",
      },
    }
  );
}
import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  handleOpportunityExperienceApiRequest,
} from "../../services/opportunityExperienceApiHandlerService";

export async function POST(
  request: NextRequest
) {
  const response =
    await handleOpportunityExperienceApiRequest({
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
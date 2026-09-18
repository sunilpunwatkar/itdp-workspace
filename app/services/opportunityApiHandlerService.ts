import {
  parseOpportunityApiInput,
} from "./opportunityApiInputService";

import {
  scanOpportunityUniverse,
} from "./opportunityScanAccessService";

import type {
  OpportunityScanAccessInput,
} from "./opportunityScanAccessService";

import {
  OPPORTUNITY_PRODUCTION_SCANNER_OPTIONS,
} from "./opportunityProductionScannerPolicy";

export interface OpportunityApiResponse {
  status: number;
  body: unknown;
}

export interface OpportunityApiHandlerDependencies {
  readBody:
    () => Promise<unknown>;

  scan?:
    (
      input:
        OpportunityScanAccessInput
    ) => Promise<unknown>;
}

const validationErrors =
  new Set([
    "INVALID_REQUEST_BODY",
    "INVALID_STOCK_UNIVERSE",
    "INVALID_CAPITAL",
    "INVALID_HORIZON",
    "INVALID_RISK_PROFILE",
    "INVALID_MAX_RESULTS",
    "INVALID_FRESHNESS_TTL",
  ]);

export async function handleOpportunityApiRequest(
  dependencies:
    OpportunityApiHandlerDependencies
): Promise<OpportunityApiResponse> {
  let rawBody:
    unknown;

  try {
    rawBody =
      await dependencies.readBody();
  } catch {
    return {
      status:
        400,

      body: {
        error:
          "INVALID_JSON",
      },
    };
  }

  let parsed:
    ReturnType<
      typeof parseOpportunityApiInput
    >;

  try {
    parsed =
      parseOpportunityApiInput(
        rawBody
      );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "UNKNOWN_ERROR";

    if (
      validationErrors.has(
        message
      )
    ) {
      return {
        status:
          400,

        body: {
          error:
            message,
        },
      };
    }

    return {
      status:
        500,

      body: {
        error:
          "INTERNAL_SERVER_ERROR",
      },
    };
  }

  const scan =
    dependencies.scan ??
    scanOpportunityUniverse;

  try {
    const result =
      await scan(
        {
  stockUniverse:
    parsed.stockUniverse,

  discovery:
    parsed.discovery,

  freshnessTtlMs:
    parsed.freshnessTtlMs,

  scannerOptions:
    OPPORTUNITY_PRODUCTION_SCANNER_OPTIONS,
}
      );

    return {
      status:
        200,

      body:
        result,
    };
  } catch {
    return {
      status:
        500,

      body: {
        error:
          "INTERNAL_SERVER_ERROR",
      },
    };
  }
}
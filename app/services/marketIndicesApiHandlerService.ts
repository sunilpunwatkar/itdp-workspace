import {
  MarketIndex,
} from "./marketIndicesService";

type SuccessBody = {
  indices: MarketIndex[];
  updatedAt: string;
};

type ErrorBody = {
  error: "INTERNAL_SERVER_ERROR";
};

export type MarketIndicesApiResult =
  | {
      status: 200;
      body: SuccessBody;
    }
  | {
      status: 500;
      body: ErrorBody;
    };

type MarketIndicesApiDependencies = {
  getMarketIndices:
    () => Promise<MarketIndex[]>;

  now?: () => Date;
};

export async function handleMarketIndicesApiRequest({
  getMarketIndices,
  now = () => new Date(),
}: MarketIndicesApiDependencies):
  Promise<MarketIndicesApiResult> {
  try {
    const indices =
      await getMarketIndices();

    return {
      status: 200,
      body: {
        indices,
        updatedAt:
          now().toISOString(),
      },
    };
  } catch (error) {
    console.error(
      "Market Indices API Error:",
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
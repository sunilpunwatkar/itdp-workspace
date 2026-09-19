import assert from "node:assert/strict";

import {
  handleMarketIndicesApiRequest,
} from "../app/services/marketIndicesApiHandlerService";

async function run() {
  // =====================================================
  // 1. SUCCESS CONTRACT
  // =====================================================

  const mockIndices = [
    {
      name: "NIFTY 50",
      symbol: "^NSEI",
      price: 23346.4,
      previousClose: 23270.6,
      change: 75.8,
      changePercent: 0.3257,
    },
    {
      name: "SENSEX",
      symbol: "^BSESN",
      price: 74294.96,
      previousClose: 74336.5,
      change: -41.54,
      changePercent: -0.0559,
    },
    {
      name: "BANK NIFTY",
      symbol: "^NSEBANK",
      price: 56358.7,
      previousClose: 56055.75,
      change: 302.95,
      changePercent: 0.5404,
    },
  ];

  const success =
    await handleMarketIndicesApiRequest({
      getMarketIndices: async () =>
        mockIndices,
      now: () =>
        new Date(
          "2026-09-19T12:00:00.000Z"
        ),
    });

  assert.equal(
    success.status,
    200,
    "Success must return HTTP 200"
  );

  assert.deepEqual(
    success.body.indices,
    mockIndices,
    "Success must return indices unchanged"
  );

  assert.equal(
    success.body.updatedAt,
    "2026-09-19T12:00:00.000Z",
    "updatedAt must use successful server fetch time"
  );

  // =====================================================
  // 2. INTERNAL ERROR CONTRACT
  // =====================================================

  const failure =
    await handleMarketIndicesApiRequest({
      getMarketIndices: async () => {
        throw new Error(
          "Yahoo provider secret failure"
        );
      },
      now: () =>
        new Date(
          "2026-09-19T12:00:00.000Z"
        ),
    });

  assert.equal(
    failure.status,
    500,
    "Internal failure must return HTTP 500"
  );

  assert.deepEqual(
    failure.body,
    {
      error: "INTERNAL_SERVER_ERROR",
    },
    "Internal provider errors must not leak through API"
  );

  assert.equal(
    "indices" in failure.body,
    false,
    "Failure response must not contain stale indices"
  );

  console.log(
    "MARKET INDICES API HANDLER CONTRACT: PASS"
  );
}

run().catch((error) => {
  console.error(
    "MARKET INDICES API HANDLER CONTRACT: FAIL"
  );

  console.error(error);

  process.exit(1);
});
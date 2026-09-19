import {
  getMarketIndices,
} from "../app/services/marketIndicesService";

async function run() {
  console.log(
    "MARKET INDICES LIVE SMOKE: START"
  );

  const indices =
    await getMarketIndices();

  console.log(
    JSON.stringify(
      indices,
      null,
      2
    )
  );

  if (indices.length !== 3) {
    throw new Error(
      `Expected 3 market indices, received ${indices.length}`
    );
  }

  for (const index of indices) {
    if (
      !Number.isFinite(index.price) ||
      index.price <= 0
    ) {
      throw new Error(
        `Invalid price for ${index.name}`
      );
    }

    if (
      !Number.isFinite(index.previousClose) ||
      index.previousClose <= 0
    ) {
      throw new Error(
        `Invalid previousClose for ${index.name}`
      );
    }

    if (
      !Number.isFinite(index.change) ||
      !Number.isFinite(index.changePercent)
    ) {
      throw new Error(
        `Invalid change data for ${index.name}`
      );
    }
  }

  console.log(
    "MARKET INDICES LIVE SMOKE: PASS"
  );
}

run().catch((error) => {
  console.error(
    "MARKET INDICES LIVE SMOKE: FAIL"
  );

  console.error(error);

  process.exit(1);
});
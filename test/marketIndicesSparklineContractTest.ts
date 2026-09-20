import {
  buildMarketIndex,
} from "../app/services/marketIndicesService";

function assert(
  condition: boolean,
  message: string
) {
  if (!condition) {
    throw new Error(message);
  }
}

console.log(
  "=== MARKET INDICES SPARKLINE CONTRACT TEST ==="
);

const definition = {
  name: "NIFTY 50",
  symbol: "^NSEI",
};

const sparkline = [
  23323.95,
  23328.1,
  23301.05,
  23317.9,
  23346.4,
];

const result = buildMarketIndex(
  definition,
  23346.4,
  23270.6,
  sparkline
);

assert(
  result.name === "NIFTY 50",
  "Index name must be preserved"
);

assert(
  result.symbol === "^NSEI",
  "Index symbol must be preserved"
);

assert(
  result.price === 23346.4,
  "Price must be preserved"
);

assert(
  result.sparkline.length === 5,
  "Sparkline must preserve valid points"
);

assert(
  result.sparkline[0] === 23323.95,
  "Sparkline first point mismatch"
);

assert(
  result.sparkline[4] === 23346.4,
  "Sparkline last point mismatch"
);

assert(
  result.sparkline.every(
    (value) => Number.isFinite(value)
  ),
  "Sparkline must contain only finite values"
);

console.log(
  "PASS: Market index sparkline contract"
);
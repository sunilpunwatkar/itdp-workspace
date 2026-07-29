export const dummyAnalysis = {
  RELIANCE: {
    symbol: "RELIANCE",
    decision: "BUY",
    confidence: 91,
    risk: "LOW",
    target: 3250,
    stopLoss: 2980,
    reasons: [
      "Breakout Confirmed",
      "RSI Above 60",
      "Strong Volume",
    ],
    invalidIf: "Price closes below ₹2980",
  },

  TCS: {
    symbol: "TCS",
    decision: "HOLD",
    confidence: 84,
    risk: "MEDIUM",
    target: 4120,
    stopLoss: 3890,
    reasons: [
      "Sideways Trend",
      "Mixed Momentum",
      "Waiting for Breakout",
    ],
    invalidIf: "Price closes below ₹3890",
  },

  INFY: {
    symbol: "INFY",
    decision: "SELL",
    confidence: 88,
    risk: "HIGH",
    target: 1480,
    stopLoss: 1610,
    reasons: [
      "Weak Trend",
      "RSI Below 40",
      "Heavy Selling Pressure",
    ],
    invalidIf: "Price closes above ₹1610",
  },
};
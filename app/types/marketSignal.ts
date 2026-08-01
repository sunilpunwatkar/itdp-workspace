export type Signal = "BUY" | "SELL" | "HOLD";

export interface MarketSignal {
  ema20: number;
  ema50: number;
  ema200: number;

  emaSignal: "BUY" | "SELL";

  rsi: number;
  rsiSignal: "BUY" | "SELL" | "HOLD";

  atr: number;

  macd: number;
  signal: number;
  histogram: number;
  macdSignal: "BUY" | "SELL" | "HOLD";
}
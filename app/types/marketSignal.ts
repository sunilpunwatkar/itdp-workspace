export type Signal = "BUY" | "SELL" | "HOLD";

export interface MarketSignal {
  emaSignal: Signal;
  rsiSignal: Signal;
  
  ema20: number;
  ema50: number;
  ema200: number;

  rsi: number;
  
  atr: number;

}
export type CandleData = {
  time: string;

  open: number;
  high: number;
  low: number;
  close: number;

  volume: number;

  ema20?: number;
  ema50?: number;
  ema200?: number;
};
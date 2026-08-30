import { CandleData, MarketStats } from "./types";

const BTC_BASE_PRICE = 67500;

export function generateInitialCandles(count: number = 100): CandleData[] {
  const candles: CandleData[] = [];
  let price = BTC_BASE_PRICE;
  const now = Math.floor(Date.now() / 1000);

  for (let i = count; i > 0; i--) {
    const volatility = 0.008 + Math.random() * 0.012;
    const drift = (Math.random() - 0.48) * volatility;
    const open = price;
    const close = open * (1 + drift);
    const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
    const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
    const volume = Math.floor(50 + Math.random() * 200);

    candles.push({
      time: formatTime(now - i * 3),
      open: round(open),
      high: round(high),
      low: round(low),
      close: round(close),
      volume,
    });

    price = close;
  }

  return candles;
}

export function generateNextCandle(prevCandle: CandleData): CandleData {
  const volatility = 0.006 + Math.random() * 0.01;
  const drift = (Math.random() - 0.48) * volatility;
  const open = prevCandle.close;
  const close = open * (1 + drift);
  const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
  const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
  const volume = Math.floor(50 + Math.random() * 200);

  return {
    time: formatTime(Math.floor(Date.now() / 1000)),
    open: round(open),
    high: round(high),
    low: round(low),
    close: round(close),
    volume,
  };
}

export function getMarketStats(candles: CandleData[]): MarketStats {
  const current = candles[candles.length - 1];
  const dayAgo = candles[Math.max(0, candles.length - 60)];

  const recent24 = candles.slice(-60);
  const high24h = Math.max(...recent24.map((c) => c.high));
  const low24h = Math.min(...recent24.map((c) => c.low));
  const volume24h = recent24.reduce((sum, c) => sum + c.volume, 0);

  const change = current.close - dayAgo.close;
  const changePercent = (change / dayAgo.close) * 100;

  return {
    currentPrice: current.close,
    priceChange24h: round(change),
    priceChangePercent: round(changePercent),
    volume24h,
    high24h: round(high24h),
    low24h: round(low24h),
  };
}

function formatTime(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toISOString().replace("T", " ").substring(0, 19);
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

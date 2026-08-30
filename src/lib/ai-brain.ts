import { TechnicalIndicators, TradeSignal, AIAnalysisStep, CandleData } from "./types";

let stepCounter = 0;

export function generateAIAnalysis(
  indicators: TechnicalIndicators,
  candles: CandleData[],
  lastSignal?: TradeSignal
): { steps: AIAnalysisStep[]; signal: TradeSignal } {
  stepCounter++;
  const steps: AIAnalysisStep[] = [];
  const currentPrice = candles[candles.length - 1].close;
  const now = new Date().toISOString().replace("T", " ").substring(0, 19);

  steps.push({
    id: `${stepCounter}-1`,
    text: `Scanning BTC/USD at $${currentPrice.toLocaleString()}... analyzing 14-period RSI, MACD, and moving averages.`,
    type: "info",
    timestamp: now,
  });

  const rsiStatus =
    indicators.rsi < 30
      ? `RSI is at ${indicators.rsi} (Oversold territory) — potential reversal zone detected.`
      : indicators.rsi > 70
        ? `RSI is at ${indicators.rsi} (Overbought territory) — potential pullback risk.`
        : `RSI is at ${indicators.rsi} (Neutral zone) — no extreme readings.`;

  steps.push({
    id: `${stepCounter}-2`,
    text: rsiStatus,
    type: "indicator",
    timestamp: now,
  });

  const macdDir = indicators.macd.histogram > 0 ? "bullish" : "bearish";
  const macdCross =
    Math.abs(indicators.macd.histogram) < 1
      ? "MACD is near zero line — potential crossover imminent."
      : `MACD histogram is ${macdDir} at ${indicators.macd.histogram.toFixed(2)}.`;

  steps.push({
    id: `${stepCounter}-3`,
    text: macdCross,
    type: "indicator",
    timestamp: now,
  });

  const trend =
    currentPrice > indicators.sma50
      ? "Price is above SMA50 — macro trend is bullish."
      : "Price is below SMA50 — macro trend is bearish.";

  steps.push({
    id: `${stepCounter}-4`,
    text: trend,
    type: "pattern",
    timestamp: now,
  });

  if (indicators.sma20 > indicators.sma50 && currentPrice > indicators.sma20) {
    steps.push({
      id: `${stepCounter}-5`,
      text: "Golden alignment: SMA20 > SMA50 with price above both. Strong bullish structure.",
      type: "pattern",
      timestamp: now,
    });
  } else if (indicators.sma20 < indicators.sma50 && currentPrice < indicators.sma20) {
    steps.push({
      id: `${stepCounter}-5`,
      text: "Death cross alignment: SMA20 < SMA50 with price below both. Strong bearish structure.",
      type: "pattern",
      timestamp: now,
    });
  }

  const signal = evaluateSignal(indicators, candles);

  steps.push({
    id: `${stepCounter}-6`,
    text: `Generating signal: ${signal.type} with ${signal.confidence}% confidence. Risk rating: ${signal.riskRating}.`,
    type: "signal",
    timestamp: now,
  });

  signal.reasoning.forEach((reason, i) => {
    steps.push({
      id: `${stepCounter}-${7 + i}`,
      text: reason,
      type: "risk",
      timestamp: now,
    });
  });

  return { steps, signal };
}

function evaluateSignal(indicators: TechnicalIndicators, candles: CandleData[]): TradeSignal {
  let score = 0;
  const reasons: string[] = [];
  const price = candles[candles.length - 1].close;

  if (indicators.rsi < 35) {
    score += 25;
    reasons.push("RSI oversold — high probability bounce setup.");
  } else if (indicators.rsi > 65) {
    score -= 25;
    reasons.push("RSI overbought — elevated reversal risk.");
  }

  if (indicators.macd.histogram > 0 && indicators.macd.macd > indicators.macd.signal) {
    score += 20;
    reasons.push("MACD bullish crossover confirmed — momentum shifting up.");
  } else if (indicators.macd.histogram < 0 && indicators.macd.macd < indicators.macd.signal) {
    score -= 20;
    reasons.push("MACD bearish crossover — momentum shifting down.");
  }

  if (price > indicators.sma50) {
    score += 15;
    reasons.push("Price above 50-SMA — bullish macro trend support.");
  } else {
    score -= 15;
    reasons.push("Price below 50-SMA — bearish macro trend pressure.");
  }

  if (indicators.sma20 > indicators.sma50) {
    score += 10;
    reasons.push("SMA20 above SMA50 — short-term trend bullish.");
  } else {
    score -= 10;
    reasons.push("SMA20 below SMA50 — short-term trend bearish.");
  }

  const recentCandles = candles.slice(-5);
  const recentRange = recentCandles.reduce((sum, c) => sum + (c.high - c.low), 0) / 5;
  if (recentRange < indicators.atr * 0.5) {
    reasons.push("Low volatility squeeze detected — breakout likely.");
  }

  const confidence = Math.min(95, Math.max(15, 50 + score));
  const riskRating: "Low" | "Medium" | "High" =
    confidence > 70 ? "Low" : confidence > 45 ? "Medium" : "High";

  let type: "BUY" | "SELL" | "HOLD";
  if (score >= 20) {
    type = "BUY";
    reasons.push("Multiple bullish confluences aligned — executing LONG entry.");
  } else if (score <= -20) {
    type = "SELL";
    reasons.push("Multiple bearish confluences aligned — executing SHORT entry.");
  } else {
    type = "HOLD";
    reasons.push("Mixed signals — maintaining current position. Waiting for clearer setup.");
  }

  return {
    type,
    confidence,
    riskRating,
    reasoning: reasons,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
  };
}

export function generateTradeLesson(
  type: "LONG" | "SHORT",
  entryPrice: number,
  exitPrice: number,
  closeReason: string
): { setup: string; riskManagement: string; technicalContext: string } {
  const isProfit = (type === "LONG" ? exitPrice > entryPrice : exitPrice < entryPrice);

  return {
    setup: `${type === "LONG" ? "Long" : "Short"} entry at $${entryPrice.toFixed(2)} based on confluence of RSI, MACD, and moving average alignment. The AI identified a ${isProfit ? "high-probability" : "failed"} ${type.toLowerCase()} setup with multiple confirming indicators.`,
    riskManagement: `Position sized with 1-2% risk model. Stop loss placed ${closeReason === "SL" ? "and triggered" : "below key support/resistance"} using ATR-based distance. ${closeReason === "TP" ? "Take profit target hit at predetermined level." : closeReason === "TRAILING" ? "Trailing stop locked in profits." : "Risk parameters managed exposure effectively."}`,
    technicalContext: `The trade ${isProfit ? "succeeded" : "failed"} in a market where RSI divergence and MACD momentum ${isProfit ? "confirmed" : "did not sustain"} the directional bias. Key learning: ${isProfit ? "Multiple indicator confluence increases win probability significantly." : "Even high-confidence setups can fail — strict risk management is essential."}`,
  };
}

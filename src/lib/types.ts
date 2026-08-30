export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: { macd: number; signal: number; histogram: number };
  sma20: number;
  sma50: number;
  ema12: number;
  ema26: number;
  atr: number;
}

export type SignalType = "BUY" | "SELL" | "HOLD";
export type RiskRating = "Low" | "Medium" | "High";

export interface TradeSignal {
  type: SignalType;
  confidence: number;
  riskRating: RiskRating;
  reasoning: string[];
  timestamp: string;
}

export interface AIAnalysisStep {
  id: string;
  text: string;
  type: "indicator" | "pattern" | "signal" | "risk" | "info";
  timestamp: string;
}

export interface Position {
  id: string;
  type: "LONG" | "SHORT";
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  stopLoss: number;
  takeProfit: number;
  trailingStop: number;
  pnl: number;
  pnlPercent: number;
  openTime: string;
  status: "OPEN" | "CLOSED";
  closeTime?: string;
  closePrice?: number;
  closeReason?: "TP" | "SL" | "TRAILING" | "SIGNAL";
}

export interface Trade {
  id: string;
  type: "LONG" | "SHORT";
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  openTime: string;
  closeTime: string;
  closeReason: "TP" | "SL" | "TRAILING" | "SIGNAL";
  lesson: {
    setup: string;
    riskManagement: string;
    technicalContext: string;
  };
}

export interface Portfolio {
  balance: number;
  startingBalance: number;
  totalPnl: number;
  totalPnlPercent: number;
  openPositions: Position[];
  tradeHistory: Trade[];
  winCount: number;
  lossCount: number;
  winRate: number;
  totalTrades: number;
  activeStrategy: string;
}

export interface MarketStats {
  currentPrice: number;
  priceChange24h: number;
  priceChangePercent: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

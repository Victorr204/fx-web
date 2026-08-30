import { Portfolio, Position, Trade, TradeSignal, CandleData } from "./types";
import { generateTradeLesson } from "./ai-brain";

export function createInitialPortfolio(): Portfolio {
  return {
    balance: 10000,
    startingBalance: 10000,
    totalPnl: 0,
    totalPnlPercent: 0,
    openPositions: [],
    tradeHistory: [],
    winCount: 0,
    lossCount: 0,
    winRate: 0,
    totalTrades: 0,
    activeStrategy: "AI Momentum",
  };
}

let posCounter = 0;

export function executeSignal(
  portfolio: Portfolio,
  signal: TradeSignal,
  currentPrice: number,
  atr: number
): Portfolio {
  if (signal.type === "HOLD") return portfolio;

  const hasOpenPosition = portfolio.openPositions.length > 0;

  if (hasOpenPosition) {
    const pos = portfolio.openPositions[0];
    const shouldClose =
      (signal.type === "BUY" && pos.type === "SHORT") ||
      (signal.type === "SELL" && pos.type === "LONG");

    if (shouldClose) {
      return closePosition(portfolio, pos.id, currentPrice, "SIGNAL");
    }
    return portfolio;
  }

  posCounter++;
  const isLong = signal.type === "BUY";
  const riskAmount = portfolio.balance * 0.02;
  const stopDistance = atr * 1.5;
  const tpDistance = atr * 3;

  const stopLoss = isLong ? currentPrice - stopDistance : currentPrice + stopDistance;
  const takeProfit = isLong ? currentPrice + tpDistance : currentPrice - tpDistance;
  const trailingStop = isLong ? currentPrice - atr * 1.2 : currentPrice + atr * 1.2;

  const quantity = riskAmount / stopDistance;

  const newPosition: Position = {
    id: `pos-${posCounter}`,
    type: isLong ? "LONG" : "SHORT",
    entryPrice: currentPrice,
    currentPrice,
    quantity,
    stopLoss,
    takeProfit,
    trailingStop,
    pnl: 0,
    pnlPercent: 0,
    openTime: new Date().toISOString().replace("T", " ").substring(0, 19),
    status: "OPEN",
  };

  return {
    ...portfolio,
    openPositions: [...portfolio.openPositions, newPosition],
    balance: portfolio.balance - quantity * currentPrice * 0.001,
  };
}

export function updatePositions(
  portfolio: Portfolio,
  currentPrice: number,
  atr: number
): Portfolio {
  let closedAny = false;
  const updatedPositions = portfolio.openPositions.map((pos) => {
    const pnl = pos.type === "LONG"
      ? (currentPrice - pos.entryPrice) * pos.quantity
      : (pos.entryPrice - currentPrice) * pos.quantity;
    const pnlPercent = (pnl / (pos.entryPrice * pos.quantity)) * 100;

    let newTrailingStop = pos.trailingStop;
    if (pos.type === "LONG") {
      newTrailingStop = Math.max(pos.trailingStop, currentPrice - atr * 1.2);
    } else {
      newTrailingStop = Math.min(pos.trailingStop, currentPrice + atr * 1.2);
    }

    return { ...pos, currentPrice, pnl, pnlPercent, trailingStop: newTrailingStop };
  });

  const stillOpen: Position[] = [];
  const toClose: { pos: Position; reason: "TP" | "SL" | "TRAILING" }[] = [];

  for (const pos of updatedPositions) {
    if (pos.type === "LONG") {
      if (pos.currentPrice >= pos.takeProfit) toClose.push({ pos, reason: "TP" });
      else if (pos.currentPrice <= pos.stopLoss) toClose.push({ pos, reason: "SL" });
      else if (pos.currentPrice <= pos.trailingStop && pos.trailingStop > pos.stopLoss)
        toClose.push({ pos, reason: "TRAILING" });
      else stillOpen.push(pos);
    } else {
      if (pos.currentPrice <= pos.takeProfit) toClose.push({ pos, reason: "TP" });
      else if (pos.currentPrice >= pos.stopLoss) toClose.push({ pos, reason: "SL" });
      else if (pos.currentPrice >= pos.trailingStop && pos.trailingStop < pos.stopLoss)
        toClose.push({ pos, reason: "TRAILING" });
      else stillOpen.push(pos);
    }
  }

  let newPortfolio = { ...portfolio, openPositions: stillOpen };
  for (const { pos, reason } of toClose) {
    closedAny = true;
    newPortfolio = closePosition(newPortfolio, pos.id, currentPrice, reason);
  }

  return newPortfolio;
}

function closePosition(
  portfolio: Portfolio,
  positionId: string,
  currentPrice: number,
  reason: "TP" | "SL" | "TRAILING" | "SIGNAL"
): Portfolio {
  const pos = portfolio.openPositions.find((p) => p.id === positionId);
  if (!pos) return portfolio;

  const pnl = pos.type === "LONG"
    ? (currentPrice - pos.entryPrice) * pos.quantity
    : (pos.entryPrice - currentPrice) * pos.quantity;
  const pnlPercent = (pnl / (pos.entryPrice * pos.quantity)) * 100;

  const trade: Trade = {
    id: pos.id,
    type: pos.type,
    entryPrice: pos.entryPrice,
    exitPrice: currentPrice,
    quantity: pos.quantity,
    pnl,
    pnlPercent,
    openTime: pos.openTime,
    closeTime: new Date().toISOString().replace("T", " ").substring(0, 19),
    closeReason: reason,
    lesson: generateTradeLesson(pos.type, pos.entryPrice, currentPrice, reason),
  };

  const winCount = portfolio.winCount + (pnl > 0 ? 1 : 0);
  const lossCount = portfolio.lossCount + (pnl <= 0 ? 1 : 0);
  const totalTrades = portfolio.totalTrades + 1;

  return {
    ...portfolio,
    balance: portfolio.balance + pnl,
    totalPnl: portfolio.totalPnl + pnl,
    totalPnlPercent: ((portfolio.totalPnl + pnl) / portfolio.startingBalance) * 100,
    openPositions: portfolio.openPositions.filter((p) => p.id !== positionId),
    tradeHistory: [...portfolio.tradeHistory, trade],
    winCount,
    lossCount,
    winRate: totalTrades > 0 ? Math.round((winCount / totalTrades) * 100) : 0,
    totalTrades,
  };
}

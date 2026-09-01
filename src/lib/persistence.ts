import { insforge } from "@/lib/insforge";
import { Portfolio, Trade, Position } from "@/lib/types";

async function getCurrentUserId(): Promise<string | null> {
  const { data, error } = await insforge.auth.getCurrentUser();
  if (error || !data?.user) return null;
  return data.user.id;
}

export async function ensurePortfolio(): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const { data: existing } = await insforge.database
    .from("user_portfolios")
    .select("id")
    .eq("user_id", userId)
    .limit(1);

  if (existing && existing.length > 0) return;

  const { error } = await insforge.database.from("user_portfolios").insert([
    {
      user_id: userId,
      balance: 10000,
      starting_balance: 10000,
      total_pnl: 0,
      win_count: 0,
      loss_count: 0,
      total_trades: 0,
      active_strategy: "AI Momentum",
    },
  ]);

  if (error) {
    console.error("Failed to create portfolio:", error.message);
  }
}

export async function loadPortfolio(): Promise<Portfolio | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const { data: portfolio, error: portfolioError } = await insforge.database
    .from("user_portfolios")
    .select("*")
    .eq("user_id", userId)
    .limit(1);

  if (portfolioError || !portfolio || portfolio.length === 0) return null;

  const p = portfolio[0];

  const { data: trades } = await insforge.database
    .from("user_trades")
    .select("*")
    .eq("user_id", userId)
    .order("close_time", { ascending: false });

  const { data: positions } = await insforge.database
    .from("user_positions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "OPEN");

  const tradeHistory: Trade[] = (trades || []).map((t) => ({
    id: t.position_id,
    type: t.type,
    entryPrice: t.entry_price,
    exitPrice: t.exit_price,
    quantity: t.quantity,
    pnl: t.pnl,
    pnlPercent: t.pnl_percent,
    openTime: t.open_time,
    closeTime: t.close_time,
    closeReason: t.close_reason,
    lesson: t.lesson,
  }));

  const openPositions: Position[] = (positions || []).map((p) => ({
    id: p.position_id,
    type: p.type,
    entryPrice: p.entry_price,
    currentPrice: p.current_price,
    quantity: p.quantity,
    stopLoss: p.stop_loss,
    takeProfit: p.take_profit,
    trailingStop: p.trailing_stop,
    pnl: p.pnl,
    pnlPercent: p.pnl_percent,
    openTime: p.open_time,
    status: "OPEN",
  }));

  return {
    balance: p.balance,
    startingBalance: p.starting_balance,
    totalPnl: p.total_pnl,
    totalPnlPercent: p.starting_balance > 0
      ? ((p.balance - p.starting_balance) / p.starting_balance) * 100
      : 0,
    openPositions,
    tradeHistory,
    winCount: p.win_count,
    lossCount: p.loss_count,
    winRate: p.total_trades > 0
      ? (p.win_count / p.total_trades) * 100
      : 0,
    totalTrades: p.total_trades,
    activeStrategy: p.active_strategy,
  };
}

export async function savePortfolio(portfolio: Portfolio): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const { error } = await insforge.database.from("user_portfolios").upsert(
    [
      {
        user_id: userId,
        balance: portfolio.balance,
        starting_balance: portfolio.startingBalance,
        total_pnl: portfolio.totalPnl,
        win_count: portfolio.winCount,
        loss_count: portfolio.lossCount,
        total_trades: portfolio.totalTrades,
        active_strategy: portfolio.activeStrategy,
        updated_at: new Date().toISOString(),
      },
    ],
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("Failed to save portfolio:", error.message);
  }
}

export async function saveTrade(trade: Trade): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const { error } = await insforge.database.from("user_trades").insert([
    {
      user_id: userId,
      position_id: trade.id,
      type: trade.type,
      entry_price: trade.entryPrice,
      exit_price: trade.exitPrice,
      quantity: trade.quantity,
      pnl: trade.pnl,
      pnl_percent: trade.pnlPercent,
      open_time: trade.openTime,
      close_time: trade.closeTime,
      close_reason: trade.closeReason,
      lesson: trade.lesson,
    },
  ]);

  if (error) {
    console.error("Failed to save trade:", error.message);
  }
}

export async function saveOpenPositions(positions: Position[]): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const { error: closeError } = await insforge.database
    .from("user_positions")
    .update({ status: "CLOSED", updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("status", "OPEN");

  if (closeError) {
    console.error("Failed to close positions:", closeError.message);
    return;
  }

  if (positions.length > 0) {
    const { error: insertError } = await insforge.database.from("user_positions").insert(
      positions.map((p) => ({
        user_id: userId,
        position_id: p.id,
        type: p.type,
        entry_price: p.entryPrice,
        current_price: p.currentPrice,
        quantity: p.quantity,
        stop_loss: p.stopLoss,
        take_profit: p.takeProfit,
        trailing_stop: p.trailingStop,
        pnl: p.pnl,
        pnl_percent: p.pnlPercent,
        open_time: p.openTime,
        status: "OPEN",
      }))
    );

    if (insertError) {
      console.error("Failed to insert positions:", insertError.message);
    }
  }
}

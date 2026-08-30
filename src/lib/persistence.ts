import { insforge } from "@/lib/insforge";
import { Portfolio, Trade, Position } from "@/lib/types";

export async function loadPortfolio(): Promise<Portfolio | null> {
  const { data: user } = await insforge.auth.getCurrentUser();
  if (!user?.user) return null;

  const { data: portfolio } = await insforge.database
    .from("user_portfolios")
    .select("*")
    .eq("user_id", user.user.id)
    .single();

  if (!portfolio) return null;

  const { data: trades } = await insforge.database
    .from("user_trades")
    .select("*")
    .eq("user_id", user.user.id)
    .order("close_time", { ascending: false });

  const { data: positions } = await insforge.database
    .from("user_positions")
    .select("*")
    .eq("user_id", user.user.id)
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
    balance: portfolio.balance,
    startingBalance: portfolio.starting_balance,
    totalPnl: portfolio.total_pnl,
    totalPnlPercent: portfolio.starting_balance > 0
      ? ((portfolio.balance - portfolio.starting_balance) / portfolio.starting_balance) * 100
      : 0,
    openPositions,
    tradeHistory,
    winCount: portfolio.win_count,
    lossCount: portfolio.loss_count,
    winRate: portfolio.total_trades > 0
      ? (portfolio.win_count / portfolio.total_trades) * 100
      : 0,
    totalTrades: portfolio.total_trades,
    activeStrategy: portfolio.active_strategy,
  };
}

export async function savePortfolio(portfolio: Portfolio): Promise<void> {
  const { data: user } = await insforge.auth.getCurrentUser();
  if (!user?.user) return;

  await insforge.database.from("user_portfolios").upsert(
    [
      {
        user_id: user.user.id,
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
}

export async function saveTrade(trade: Trade): Promise<void> {
  const { data: user } = await insforge.auth.getCurrentUser();
  if (!user?.user) return;

  await insforge.database.from("user_trades").insert([
    {
      user_id: user.user.id,
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
}

export async function saveOpenPositions(positions: Position[]): Promise<void> {
  const { data: user } = await insforge.auth.getCurrentUser();
  const userId = user?.user?.id;
  if (!userId) return;

  await insforge.database
    .from("user_positions")
    .update({ status: "CLOSED", updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("status", "OPEN");

  if (positions.length > 0) {
    await insforge.database.from("user_positions").insert(
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
  }
}

"use client";

import { MarketStats } from "@/lib/types";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils";

interface StatsBarProps {
  stats: MarketStats;
  activeStrategy: string;
  winRate: number;
}

export function StatsBar({ stats, activeStrategy, winRate }: StatsBarProps) {
  const isPositive = stats.priceChangePercent >= 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <div className="bg-[#111118] border border-[#1e1e2a] rounded-lg p-3">
        <div className="text-[10px] text-[#737373] uppercase tracking-wider mb-1">BTC/USD Price</div>
        <div className="text-lg font-bold font-mono">{formatCurrency(stats.currentPrice)}</div>
      </div>

      <div className="bg-[#111118] border border-[#1e1e2a] rounded-lg p-3">
        <div className="text-[10px] text-[#737373] uppercase tracking-wider mb-1">24h Change</div>
        <div className={`text-lg font-bold font-mono ${isPositive ? "text-[#10b981]" : "text-[#ef4444]"}`}>
          {formatPercent(stats.priceChangePercent)}
        </div>
      </div>

      <div className="bg-[#111118] border border-[#1e1e2a] rounded-lg p-3">
        <div className="text-[10px] text-[#737373] uppercase tracking-wider mb-1">Volume 24h</div>
        <div className="text-lg font-bold font-mono">{formatNumber(stats.volume24h)}</div>
      </div>

      <div className="bg-[#111118] border border-[#1e1e2a] rounded-lg p-3">
        <div className="text-[10px] text-[#737373] uppercase tracking-wider mb-1">AI Strategy</div>
        <div className="text-lg font-bold font-mono text-[#10b981]">{activeStrategy}</div>
      </div>

      <div className="bg-[#111118] border border-[#1e1e2a] rounded-lg p-3">
        <div className="text-[10px] text-[#737373] uppercase tracking-wider mb-1">Win Rate</div>
        <div className="text-lg font-bold font-mono">{winRate}%</div>
      </div>
    </div>
  );
}

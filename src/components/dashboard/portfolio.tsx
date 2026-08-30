"use client";

import { Portfolio } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface PortfolioPanelProps {
  portfolio: Portfolio;
}

export function PortfolioPanel({ portfolio }: PortfolioPanelProps) {
  const performanceVsStart = portfolio.balance - portfolio.startingBalance;
  const isPositive = performanceVsStart >= 0;

  return (
    <div className="bg-[#111118] border border-[#1e1e2a] rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span className="text-sm font-semibold">Portfolio</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#16161f] rounded-lg p-3">
          <div className="text-[10px] text-[#737373] uppercase tracking-wider mb-1">Balance</div>
          <div className="text-xl font-bold font-mono">{formatCurrency(portfolio.balance)}</div>
        </div>
        <div className="bg-[#16161f] rounded-lg p-3">
          <div className="text-[10px] text-[#737373] uppercase tracking-wider mb-1">Total P&L</div>
          <div className={`text-xl font-bold font-mono ${isPositive ? "text-[#10b981]" : "text-[#ef4444]"}`}>
            {isPositive ? "+" : ""}{formatCurrency(performanceVsStart)}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#737373]">Starting Balance</span>
          <span className="font-mono text-[#e5e5e5]">{formatCurrency(portfolio.startingBalance)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#737373]">Performance</span>
          <span className={`font-mono ${isPositive ? "text-[#10b981]" : "text-[#ef4444]"}`}>
            {formatPercent(portfolio.totalPnlPercent)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#737373]">Total Trades</span>
          <span className="font-mono text-[#e5e5e5]">{portfolio.totalTrades}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#737373]">Win / Loss</span>
          <span className="font-mono">
            <span className="text-[#10b981]">{portfolio.winCount}</span>
            <span className="text-[#737373]"> / </span>
            <span className="text-[#ef4444]">{portfolio.lossCount}</span>
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#737373]">Win Rate</span>
          <span className="font-mono text-[#e5e5e5]">{portfolio.winRate}%</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-[#737373]">Portfolio Performance vs Starting</span>
          <span className={`text-[10px] font-mono ${isPositive ? "text-[#10b981]" : "text-[#ef4444]"}`}>
            {formatPercent(portfolio.totalPnlPercent)}
          </span>
        </div>
        <div className="w-full bg-[#1e1e2a] rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, Math.max(5, 50 + portfolio.totalPnlPercent * 2))}%`,
              backgroundColor: isPositive ? "#10b981" : "#ef4444",
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-[#737373]">$0</span>
          <span className="text-[9px] text-[#737373]">{formatCurrency(portfolio.startingBalance)}</span>
          <span className="text-[9px] text-[#737373]">$20K</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Position } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface PositionTrackerProps {
  positions: Position[];
}

export function PositionTracker({ positions }: PositionTrackerProps) {
  return (
    <div className="bg-[#111118] border border-[#1e1e2a] rounded-lg">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e1e2a]">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-semibold">Open Positions</span>
        </div>
        <span className="text-[10px] text-[#737373] bg-[#1e1e2a] px-2 py-0.5 rounded">
          {positions.length} active
        </span>
      </div>

      <div className="p-3">
        {positions.length === 0 ? (
          <div className="text-center py-6 text-[#737373] text-xs space-y-1">
            <p>No open positions</p>
            <p className="text-[10px]">AI is scanning for entry signals...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {positions.map((pos) => (
              <div key={pos.id} className="bg-[#16161f] rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        pos.type === "LONG"
                          ? "bg-[#10b981]/20 text-[#10b981]"
                          : "bg-[#ef4444]/20 text-[#ef4444]"
                      }`}
                    >
                      {pos.type}
                    </span>
                    <span className="text-xs text-[#e5e5e5] font-mono">
                      BTC/USD
                    </span>
                  </div>
                  <span className={`text-xs font-bold font-mono ${pos.pnl >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                    {pos.pnl >= 0 ? "+" : ""}{formatCurrency(pos.pnl)}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-[10px]">
                  <div>
                    <div className="text-[#737373]">Entry</div>
                    <div className="font-mono text-[#e5e5e5]">{formatCurrency(pos.entryPrice)}</div>
                  </div>
                  <div>
                    <div className="text-[#737373]">Current</div>
                    <div className="font-mono text-[#e5e5e5]">{formatCurrency(pos.currentPrice)}</div>
                  </div>
                  <div>
                    <div className="text-[#737373]">Stop Loss</div>
                    <div className="font-mono text-[#ef4444]">{formatCurrency(pos.stopLoss)}</div>
                  </div>
                  <div>
                    <div className="text-[#737373]">Take Profit</div>
                    <div className="font-mono text-[#10b981]">{formatCurrency(pos.takeProfit)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#1e1e2a] rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, Math.abs(pos.pnlPercent) * 10)}%`,
                        backgroundColor: pos.pnl >= 0 ? "#10b981" : "#ef4444",
                      }}
                    />
                  </div>
                  <span className={`text-[10px] font-mono ${pos.pnl >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                    {formatPercent(pos.pnlPercent)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

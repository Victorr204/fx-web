"use client";

import { useState } from "react";
import { Trade } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface TradeHistoryProps {
  trades: Trade[];
}

export function TradeHistory({ trades }: TradeHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="bg-[#111118] border border-[#1e1e2a] rounded-lg">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e1e2a]">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#f59e0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-sm font-semibold">Trade History & Lessons</span>
        </div>
        <span className="text-[10px] text-[#737373] bg-[#1e1e2a] px-2 py-0.5 rounded">
          {trades.length} trades
        </span>
      </div>

      <div className="p-3 max-h-[400px] overflow-y-auto">
        {trades.length === 0 ? (
          <div className="text-center py-6 text-[#737373] text-xs space-y-1">
            <p>No completed trades yet</p>
            <p className="text-[10px]">Completed trades will appear here with learning breakdowns.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...trades].reverse().map((trade) => (
              <div key={trade.id} className="bg-[#16161f] rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedId(expandedId === trade.id ? null : trade.id)}
                  className="w-full p-3 flex items-center justify-between hover:bg-[#1e1e2a]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        trade.type === "LONG"
                          ? "bg-[#10b981]/20 text-[#10b981]"
                          : "bg-[#ef4444]/20 text-[#ef4444]"
                      }`}
                    >
                      {trade.type}
                    </span>
                    <div className="text-left">
                      <div className="text-xs text-[#e5e5e5]">
                        {formatCurrency(trade.entryPrice)} → {formatCurrency(trade.exitPrice)}
                      </div>
                      <div className="text-[10px] text-[#737373]">{trade.closeTime}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-xs font-bold font-mono ${trade.pnl >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                        {trade.pnl >= 0 ? "+" : ""}{formatCurrency(trade.pnl)}
                      </div>
                      <div className={`text-[10px] font-mono ${trade.pnl >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                        {formatPercent(trade.pnlPercent)}
                      </div>
                    </div>
                    <svg
                      className={`w-4 h-4 text-[#737373] transition-transform ${expandedId === trade.id ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {expandedId === trade.id && (
                  <div className="px-3 pb-3 border-t border-[#1e1e2a]">
                    <div className="pt-3 space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-[#f59e0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="text-xs font-semibold text-[#f59e0b]">Why This Trade Was Made</span>
                      </div>

                      <div className="space-y-2">
                        <div className="bg-[#111118] rounded p-2.5">
                          <div className="text-[10px] text-[#10b981] font-semibold uppercase tracking-wider mb-1">Setup</div>
                          <p className="text-[11px] text-[#a3a3a3] leading-relaxed">{trade.lesson.setup}</p>
                        </div>
                        <div className="bg-[#111118] rounded p-2.5">
                          <div className="text-[10px] text-[#f59e0b] font-semibold uppercase tracking-wider mb-1">Risk Management</div>
                          <p className="text-[11px] text-[#a3a3a3] leading-relaxed">{trade.lesson.riskManagement}</p>
                        </div>
                        <div className="bg-[#111118] rounded p-2.5">
                          <div className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider mb-1">Technical Context</div>
                          <p className="text-[11px] text-[#a3a3a3] leading-relaxed">{trade.lesson.technicalContext}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

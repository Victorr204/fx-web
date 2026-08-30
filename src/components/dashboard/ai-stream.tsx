"use client";

import { useEffect, useRef } from "react";
import { AIAnalysisStep, TradeSignal } from "@/lib/types";

interface AIStreamProps {
  steps: AIAnalysisStep[];
  currentSignal: TradeSignal | null;
}

export function AIStream({ steps, currentSignal }: AIStreamProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [steps]);

  const getStepIcon = (type: string) => {
    switch (type) {
      case "indicator":
        return (
          <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case "pattern":
        return (
          <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        );
      case "signal":
        return (
          <svg className="w-3.5 h-3.5 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case "risk":
        return (
          <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-3.5 h-3.5 text-[#737373]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-[#111118] border border-[#1e1e2a] rounded-lg flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e1e2a]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#10b981]/20 flex items-center justify-center">
            <svg className="w-3 h-3 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-sm font-semibold">AI Reasoning Stream</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-glow-pulse"></div>
          <span className="text-[10px] text-[#10b981]">Processing</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0" style={{ maxHeight: "320px" }}>
        {steps.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[#737373] text-xs">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#1e1e2a] flex items-center justify-center mx-auto">
                <svg className="w-4 h-4 text-[#10b981] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p>Initializing AI analysis...</p>
            </div>
          </div>
        ) : (
          steps.map((step) => (
            <div key={step.id} className="flex gap-2 items-start">
              <div className="mt-0.5 shrink-0">{getStepIcon(step.type)}</div>
              <div className="text-xs text-[#a3a3a3] leading-relaxed">{step.text}</div>
            </div>
          ))
        )}
      </div>

      {currentSignal && (
        <div className="border-t border-[#1e1e2a] p-3">
          <div className="bg-[#16161f] rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#737373] uppercase tracking-wider">Latest Signal</span>
              <span className="text-[10px] text-[#737373]">{currentSignal.timestamp}</span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded ${
                  currentSignal.type === "BUY"
                    ? "bg-[#10b981]/20 text-[#10b981]"
                    : currentSignal.type === "SELL"
                      ? "bg-[#ef4444]/20 text-[#ef4444]"
                      : "bg-[#737373]/20 text-[#737373]"
                }`}
              >
                {currentSignal.type}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[#737373]">Confidence</span>
                  <span className="text-[10px] font-mono text-[#e5e5e5]">{currentSignal.confidence}%</span>
                </div>
                <div className="w-full bg-[#1e1e2a] rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${currentSignal.confidence}%`,
                      backgroundColor:
                        currentSignal.confidence > 70
                          ? "#10b981"
                          : currentSignal.confidence > 45
                            ? "#f59e0b"
                            : "#ef4444",
                    }}
                  />
                </div>
              </div>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                  currentSignal.riskRating === "Low"
                    ? "bg-[#10b981]/10 text-[#10b981]"
                    : currentSignal.riskRating === "Medium"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-[#ef4444]/10 text-[#ef4444]"
                }`}
              >
                {currentSignal.riskRating} Risk
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

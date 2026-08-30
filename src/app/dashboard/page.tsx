"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/layout/header";
import { StatsBar } from "@/components/dashboard/stats-bar";
import { CandlestickChart } from "@/components/dashboard/candlestick-chart";
import { AIStream } from "@/components/dashboard/ai-stream";
import { PositionTracker } from "@/components/dashboard/position-tracker";
import { TradeHistory } from "@/components/dashboard/trade-history";
import { PortfolioPanel } from "@/components/dashboard/portfolio";
import { useTradingEngine } from "@/hooks/use-trading-engine";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const {
    candles,
    stats,
    portfolio,
    currentSignal,
    aiSteps,
    isRunning,
    setIsRunning,
  } = useTradingEngine();

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-[#737373] text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Header />

      <main className="flex-1 p-4 lg:p-6 space-y-4 max-w-[1600px] mx-auto w-full">
        {stats && (
          <StatsBar
            stats={stats}
            activeStrategy={portfolio.activeStrategy}
            winRate={portfolio.winRate}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <CandlestickChart candles={candles} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PositionTracker positions={portfolio.openPositions} />
              <PortfolioPanel portfolio={portfolio} />
            </div>
          </div>

          <div className="space-y-4">
            <AIStream steps={aiSteps} currentSignal={currentSignal} />

            <div className="bg-[#111118] border border-[#1e1e2a] rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#737373]">Simulation</span>
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`text-[10px] font-medium px-3 py-1 rounded-full transition-colors ${
                    isRunning
                      ? "bg-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/30"
                      : "bg-[#ef4444]/20 text-[#ef4444] hover:bg-[#ef4444]/30"
                  }`}
                >
                  {isRunning ? "⏸ Pause" : "▶ Resume"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <TradeHistory trades={portfolio.tradeHistory} />
      </main>

      <footer className="border-t border-[#1e1e2a] py-3 px-4 text-center">
        <p className="text-[10px] text-[#3a3a4a]">
          TradeLearn AI &middot; Simulated paper trading for educational purposes only &middot; Not financial advice &middot; BTC/USD simulated data
        </p>
      </footer>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-[#737373] text-sm">Loading...</div>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Trade<span className="text-[#10b981]">Learn</span> AI
            </h1>
          </div>

          <p className="text-[#737373] text-lg max-w-xl mx-auto">
            Watch an AI model analyze live market data, explain its reasoning
            step-by-step, and execute simulated paper trades in real time.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="bg-[#111118] border border-[#1e1e2a] rounded-lg p-4">
            <div className="text-[#10b981] text-2xl font-bold font-mono">
              AI
            </div>
            <div className="text-[#737373] text-xs mt-1">Live Analysis</div>
          </div>
          <div className="bg-[#111118] border border-[#1e1e2a] rounded-lg p-4">
            <div className="text-[#10b981] text-2xl font-bold font-mono">
              $10K
            </div>
            <div className="text-[#737373] text-xs mt-1">Paper Balance</div>
          </div>
          <div className="bg-[#111118] border border-[#1e1e2a] rounded-lg p-4">
            <div className="text-[#10b981] text-2xl font-bold font-mono">
              24/7
            </div>
            <div className="text-[#737373] text-xs mt-1">Market Scan</div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/signup")}
            className="w-full max-w-sm mx-auto block bg-[#10b981] hover:bg-[#059669] text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            Start Live AI Trading Room
          </button>
          <p className="text-[#737373] text-sm">
            Free account &middot; $10,000 paper balance &middot; No real money
            at risk
          </p>
        </div>

        <div className="border-t border-[#1e1e2a] pt-6 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#10b981] animate-glow-pulse"></div>
            <span className="text-[#737373] text-sm">
              Powered by AI Technical Analysis
            </span>
          </div>
          <p className="text-[#3a3a4a] text-xs">
            BTC/USD simulated data &middot; RSI, MACD, Moving Averages &middot;
            Not financial advice
          </p>
        </div>
      </div>
    </div>
  );
}

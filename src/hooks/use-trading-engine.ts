"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  CandleData,
  MarketStats,
  Portfolio,
  TradeSignal,
  AIAnalysisStep,
} from "@/lib/types";
import { generateInitialCandles, generateNextCandle, getMarketStats } from "@/lib/simulated-market";
import { calculateIndicators } from "@/lib/technical-indicators";
import { generateAIAnalysis } from "@/lib/ai-brain";
import {
  createInitialPortfolio,
  executeSignal,
  updatePositions,
} from "@/lib/paper-trading-engine";
import { loadPortfolio, savePortfolio, saveTrade, saveOpenPositions } from "@/lib/persistence";
import { useAuth } from "@/lib/auth-context";

export function useTradingEngine() {
  const { user, loading: authLoading } = useAuth();
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [stats, setStats] = useState<MarketStats | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio>(createInitialPortfolio());
  const [currentSignal, setCurrentSignal] = useState<TradeSignal | null>(null);
  const [aiSteps, setAiSteps] = useState<AIAnalysisStep[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const tickRef = useRef(0);
  const lastAiTick = useRef(0);
  const lastSaveRef = useRef(0);

  useEffect(() => {
    const initial = generateInitialCandles(100);
    setCandles(initial);
    setStats(getMarketStats(initial));
  }, []);

  useEffect(() => {
    if (authLoading || !user || loaded) return;

    async function load() {
      const saved = await loadPortfolio();
      if (saved) {
        setPortfolio(saved);
      }
      setLoaded(true);
    }

    load();
  }, [user, authLoading, loaded]);

  const persistPortfolio = useCallback(async (p: Portfolio) => {
    if (!user) return;
    await savePortfolio(p);
  }, [user]);

  const persistNewTrades = useCallback(async (oldP: Portfolio, newP: Portfolio) => {
    if (!user) return;
    const newTrades = newP.tradeHistory.slice(oldP.tradeHistory.length);
    for (const trade of newTrades) {
      await saveTrade(trade);
    }
  }, [user]);

  const tick = useCallback(() => {
    setCandles((prev) => {
      if (prev.length === 0) return prev;

      const lastCandle = prev[prev.length - 1];
      const newCandle = generateNextCandle(lastCandle);
      const updated = [...prev.slice(-99), newCandle];

      const indicators = calculateIndicators(updated);
      const newStats = getMarketStats(updated);
      setStats(newStats);

      setPortfolio((p) => {
        const prevPortfolio = p;
        let updatedP = updatePositions(p, newCandle.close, indicators.atr);

        tickRef.current++;
        if (tickRef.current - lastAiTick.current >= 5) {
          lastAiTick.current = tickRef.current;
          const { steps, signal } = generateAIAnalysis(indicators, updated, currentSignal ?? undefined);
          setCurrentSignal(signal);
          setAiSteps((prevSteps) => [...prevSteps.slice(-30), ...steps]);

          if (signal.type !== "HOLD") {
            updatedP = executeSignal(updatedP, signal, newCandle.close, indicators.atr);
          }
        }

        const positionsChanged =
          updatedP.openPositions.length !== prevPortfolio.openPositions.length ||
          updatedP.tradeHistory.length !== prevPortfolio.tradeHistory.length;

        if (positionsChanged) {
          persistNewTrades(prevPortfolio, updatedP);
          saveOpenPositions(updatedP.openPositions);
        }

        if (tickRef.current - lastSaveRef.current >= 10) {
          lastSaveRef.current = tickRef.current;
          persistPortfolio(updatedP);
        }

        return updatedP;
      });

      return updated;
    });
  }, [currentSignal, user, persistPortfolio, persistNewTrades]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(tick, 3000);
    return () => clearInterval(interval);
  }, [isRunning, tick]);

  useEffect(() => {
    return () => {
      if (user) {
        persistPortfolio(portfolio);
      }
    };
  }, [user, portfolio, persistPortfolio]);

  return {
    candles,
    stats,
    portfolio,
    currentSignal,
    aiSteps,
    isRunning,
    setIsRunning,
  };
}

"use client";

import { useEffect, useRef } from "react";
import { CandleData } from "@/lib/types";
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData, HistogramData, Time } from "lightweight-charts";

interface CandlestickChartProps {
  candles: CandleData[];
}

export function CandlestickChart({ candles }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#111118" },
        textColor: "#737373",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#1e1e2a" },
        horzLines: { color: "#1e1e2a" },
      },
      crosshair: {
        vertLine: { color: "#10b98140", width: 1, style: 2 },
        horzLine: { color: "#10b98140", width: 1, style: 2 },
      },
      rightPriceScale: {
        borderColor: "#1e1e2a",
      },
      timeScale: {
        borderColor: "#1e1e2a",
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#10b981",
      downColor: "#ef4444",
      borderUpColor: "#10b981",
      borderDownColor: "#ef4444",
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    const formattedData: CandlestickData<Time>[] = candles.map((c) => ({
      time: c.time as unknown as Time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    const volumeData: HistogramData<Time>[] = candles.map((c) => ({
      time: c.time as unknown as Time,
      value: c.volume,
      color: c.close >= c.open ? "#10b98130" : "#ef444430",
    }));

    candleSeries.setData(formattedData);
    volumeSeries.setData(volumeData);
    chart.timeScale().fitContent();

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!candleSeriesRef.current || candles.length === 0) return;

    const lastCandle = candles[candles.length - 1];

    candleSeriesRef.current.update({
      time: lastCandle.time as unknown as Time,
      open: lastCandle.open,
      high: lastCandle.high,
      low: lastCandle.low,
      close: lastCandle.close,
    });
  }, [candles]);

  return (
    <div className="bg-[#111118] border border-[#1e1e2a] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e1e2a]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">BTC/USD</span>
          <span className="text-[10px] text-[#737373] bg-[#1e1e2a] px-1.5 py-0.5 rounded">3s candles</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
          <span className="text-[10px] text-[#737373]">Bullish</span>
          <div className="w-2 h-2 rounded-full bg-[#ef4444] ml-1"></div>
          <span className="text-[10px] text-[#737373]">Bearish</span>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}

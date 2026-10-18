"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { LineChart as ChartIcon, RefreshCw } from "lucide-react";
import { SensorReading, SensorStatus } from "@/lib/types";

interface SeismicHistoryChartProps {
  history: SensorReading[];
  status: SensorStatus;
  currentVibration: number;
}

export const SeismicHistoryChart: React.FC<SeismicHistoryChartProps> = ({
  history,
  status,
  currentVibration,
}) => {
  const [dataPoints, setDataPoints] = useState<number>(30);

  const displayedHistory = history.slice(-dataPoints);

  const isDanger = status === "BAHAYA";
  const isWarn = status === "WASPADA";
  const lineColor = isDanger ? "#FF2E63" : isWarn ? "#FFB703" : "#00FF99";

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: SensorReading = payload[0].payload;
      return (
        <div className="bg-[#0D0F12]/95 border border-nerv-surfaceBorder p-2.5 rounded-lg shadow-xl font-mono text-xs text-white">
          <div className="text-nerv-subtle text-[10px]">{data.formattedTime}</div>
          <div className="text-sm font-bold flex items-center gap-1.5 mt-0.5" style={{ color: lineColor }}>
            <span>{data.nilai_getaran} m/s²</span>
            <span className="text-[10px] px-1 rounded bg-[#161B22] text-nerv-cyan">
              震度 {data.shindoScale}
            </span>
          </div>
          <div className="text-[10px] mt-1 text-gray-300">
            Status: <span className="font-bold">{data.status}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col p-6 bg-[#161B22] rounded-2xl border border-nerv-surfaceBorder shadow-xl relative overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <ChartIcon className="w-4 h-4 text-nerv-cyan" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-white">
            LIVE SEISMOGRAM STREAM (WAVEFORM MONITOR)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Points Window Selector */}
          <div className="flex items-center text-[11px] font-mono bg-[#0D0F12] rounded-lg p-1 border border-nerv-surfaceBorder">
            <span className="px-2 text-nerv-subtle">Window:</span>
            {[15, 30, 50].map((pts) => (
              <button
                key={pts}
                onClick={() => setDataPoints(pts)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  dataPoints === pts
                    ? "bg-nerv-cyan/20 text-nerv-cyan font-bold border border-nerv-cyan/40"
                    : "text-nerv-subtle hover:text-white"
                }`}
              >
                {pts}s
              </button>
            ))}
          </div>

          <div className="text-[11px] font-mono text-nerv-subtle hidden sm:flex items-center gap-1 bg-[#0D0F12] px-2.5 py-1 rounded border border-nerv-surfaceBorder">
            <RefreshCw className="w-3 h-3 text-nerv-safe animate-spin" />
            <span>REAL-TIME STREAM</span>
          </div>
        </div>
      </div>

      {/* Threshold Reference Legends */}
      <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-nerv-subtle mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 bg-[#FF2E63] inline-block" />
          <span>Garis Bahaya (&ge; 300 m/s²)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 bg-[#FFB703] inline-block" />
          <span>Garis Waspada (&ge; 100 m/s²)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 bg-[#00FF99] inline-block" />
          <span>Batas Tenang Seismik (&lt; 100 m/s²)</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayedHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="seismicGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#272E3B" vertical={false} opacity={0.6} />

            <XAxis
              dataKey="formattedTime"
              stroke="#6B7280"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: "#272E3B" }}
            />

            <YAxis
              stroke="#6B7280"
              fontSize={10}
              domain={[0, (dataMax: number) => Math.max(400, Math.ceil(dataMax * 1.25))]}
              tickLine={false}
              axisLine={{ stroke: "#272E3B" }}
              unit=""
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Threshold Reference Lines */}
            <ReferenceLine
              y={300}
              stroke="#FF2E63"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: "AMBANG BAHAYA (300)",
                fill: "#FF2E63",
                fontSize: 9,
                position: "insideTopRight",
              }}
            />

            <ReferenceLine
              y={100}
              stroke="#FFB703"
              strokeDasharray="4 4"
              strokeWidth={1.2}
              label={{
                value: "AMBANG WASPADA (100)",
                fill: "#FFB703",
                fontSize: 9,
                position: "insideTopRight",
              }}
            />

            <Area
              type="monotone"
              dataKey="nilai_getaran"
              stroke={lineColor}
              strokeWidth={2.5}
              fill="url(#seismicGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono text-nerv-subtle mt-3 pt-2 border-t border-nerv-surfaceBorder">
        <span>SAMPEL: {history.length} TITIK TELEMETRI</span>
        <span className="text-white font-mono">
          NILAI SAAT INI: <span className="font-bold" style={{ color: lineColor }}>{currentVibration} m/s²</span>
        </span>
      </div>
    </div>
  );
};

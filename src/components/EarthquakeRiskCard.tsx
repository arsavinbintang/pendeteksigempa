"use client";

import React from "react";
import { AlertOctagon, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { SensorStatus } from "@/lib/types";

interface EarthquakeRiskCardProps {
  riskPercentage: number;
  status: SensorStatus;
  currentVibration: number;
  peakValue: number;
}

export const EarthquakeRiskCard: React.FC<EarthquakeRiskCardProps> = ({
  riskPercentage,
  status,
  currentVibration,
  peakValue,
}) => {
  const isDanger = status === "BAHAYA" || riskPercentage >= 80;
  const isWarn = !isDanger && (status === "WASPADA" || riskPercentage >= 50);

  const activeColor = isDanger ? "#FF2E63" : isWarn ? "#FFB703" : "#00FF99";

  // Dynamic solid color based on risk percentage:
  // Solid Hijau (< 50%), Solid Kuning (50% - 79%), Solid Merah (>= 80%)
  const progressBarColor =
    riskPercentage >= 80
      ? "bg-nerv-danger shadow-[0_0_8px_rgba(255,46,99,0.45)]"
      : riskPercentage >= 50
      ? "bg-nerv-warn shadow-[0_0_8px_rgba(255,183,3,0.35)]"
      : "bg-nerv-safe shadow-[0_0_8px_rgba(0,255,153,0.25)]";

  return (
    <div className="flex flex-col justify-between p-6 bg-[#161B22] rounded-2xl border border-nerv-surfaceBorder shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-nerv-cyan" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-white">
            EARTHQUAKE RISK INDEX (%)
          </span>
        </div>
        <span className="text-[10px] font-mono text-nerv-subtle">
          地震発生ポテンシャル
        </span>
      </div>

      {/* Main Risk Display */}
      <div className="flex items-center justify-between bg-[#0D0F12] p-4 rounded-xl border border-nerv-surfaceBorder my-1">
        <div>
          <div className="text-xs font-mono text-nerv-subtle uppercase">
            ESTIMASI PROBABILITAS RISIKO
          </div>
          <div
            className="text-4xl font-black font-mono tracking-tight mt-0.5 flex items-baseline"
            style={{ color: activeColor }}
          >
            {riskPercentage}
            <span className="text-xl font-normal ml-0.5">%</span>
          </div>
          <div className="text-xs font-medium text-gray-300 mt-0.5">
            {isDanger
              ? "Tingkat Risiko Ekstrem (Anomali Kritis)"
              : isWarn
              ? "Tingkat Risiko Sedang (Peningkatan Frekuensi)"
              : "Tingkat Risiko Rendah (Kondisi Mikro Stabil)"}
          </div>
        </div>

        {/* Status Icon */}
        <div
          className="p-3 rounded-xl border flex items-center justify-center"
          style={{
            borderColor: `${activeColor}40`,
            backgroundColor: `${activeColor}15`,
            color: activeColor,
          }}
        >
          {isDanger ? (
            <Zap className="w-8 h-8 animate-bounce" />
          ) : isWarn ? (
            <TrendingUp className="w-8 h-8 animate-pulse" />
          ) : (
            <ShieldCheck className="w-8 h-8" />
          )}
        </div>
      </div>

      {/* Dynamic Solid Progress Bar */}
      <div className="w-full my-3">
        <div className="flex justify-between text-[10px] font-mono text-nerv-subtle mb-1">
          <span>0% (Stabil)</span>
          <span>50% (Waspada)</span>
          <span>100% (Bahaya)</span>
        </div>

        <div className="w-full h-3 bg-[#0D0F12] rounded-full overflow-hidden border border-nerv-surfaceBorder p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
            style={{ width: `${Math.min(100, Math.max(2, riskPercentage))}%` }}
          />
        </div>
      </div>

      {/* Diagnostics Readout */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2 rounded-lg bg-[#0D0F12] border border-nerv-surfaceBorder">
          <span className="text-[10px] text-nerv-subtle block">RESPONS STRUKTUR</span>
          <span className="font-bold text-white">
            {currentVibration >= 300 ? "Getaran Merusak" : currentVibration >= 100 ? "Getaran Nyata" : "Mikro Tremor"}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-[#0D0F12] border border-nerv-surfaceBorder">
          <span className="text-[10px] text-nerv-subtle block">MAX PEAK AMPLITUDE</span>
          <span className="font-bold text-nerv-cyan">{peakValue} m/s²</span>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full flex items-center justify-between text-[10px] font-mono text-nerv-subtle mt-3 pt-2 border-t border-nerv-surfaceBorder">
        <span>MODEL: RECURRENT SPECTRUM ANALYSIS</span>
        <span style={{ color: activeColor }}>STATUS: {status}</span>
      </div>
    </div>
  );
};

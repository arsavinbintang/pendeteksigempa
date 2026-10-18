"use client";

import React from "react";
import { AlertTriangle, ShieldCheck, Flame, Activity } from "lucide-react";
import { SensorStatus } from "@/lib/types";

interface StatusBannerProps {
  status: SensorStatus;
  vibration: number;
  shindoScale: string;
  shindoLabel: string;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  status,
  vibration,
  shindoScale,
  shindoLabel,
}) => {
  const isSafe = status === "AMAN";
  const isWarn = status === "WASPADA";
  const isDanger = status === "BAHAYA";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-500 ${
        isDanger
          ? "border-nerv-danger bg-gradient-to-r from-nerv-danger/25 via-[#161B22] to-nerv-danger/20 shadow-[0_0_40px_rgba(255,46,99,0.35)]"
          : isWarn
          ? "border-nerv-warn bg-gradient-to-r from-nerv-warn/15 via-[#161B22] to-nerv-warn/10 shadow-[0_0_30px_rgba(255,183,3,0.2)]"
          : "border-nerv-safe/50 bg-gradient-to-r from-nerv-safe/10 via-[#161B22] to-nerv-safe/5 shadow-[0_0_25px_rgba(0,255,153,0.1)]"
      }`}
    >
      {/* Dynamic Hazard Stripe Indicator Bar */}
      <div
        className={`h-2.5 w-full ${
          isDanger
            ? "hazard-stripe-red animate-pulse"
            : isWarn
            ? "hazard-stripe-amber"
            : "hazard-stripe-green"
        }`}
      />

      <div className="p-4 sm:p-6 lg:p-7">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Status Label & Japanese EEW Title */}
          <div className="flex items-start gap-4 sm:gap-5">
            <div
              className={`p-3.5 sm:p-4 rounded-2xl border flex items-center justify-center flex-shrink-0 transition-transform ${
                isDanger
                  ? "bg-nerv-danger/20 border-nerv-danger text-nerv-danger animate-bounce shadow-lg shadow-nerv-danger/40"
                  : isWarn
                  ? "bg-nerv-warn/20 border-nerv-warn text-nerv-warn animate-pulse"
                  : "bg-nerv-safe/20 border-nerv-safe text-nerv-safe"
              }`}
            >
              {isDanger ? (
                <Flame className="w-8 h-8 sm:w-10 sm:h-10" />
              ) : isWarn ? (
                <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" />
              ) : (
                <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className={`text-xs font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${
                    isDanger
                      ? "bg-nerv-danger text-black border-nerv-danger"
                      : isWarn
                      ? "bg-nerv-warn text-black border-nerv-warn"
                      : "bg-nerv-safe text-black border-nerv-safe"
                  }`}
                >
                  {isDanger
                    ? "緊急地震速報 (EMERGENCY)"
                    : isWarn
                    ? "地震注意報 (ADVISORY)"
                    : "正常観測 (NORMAL)"}
                </span>

                <span className="text-xs font-mono text-nerv-subtle flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Ambang Batas: &lt;100 Aman | 100-299 Waspada | &ge;300 Bahaya</span>
                </span>
              </div>

              {/* Main Status Text */}
              <div className="flex items-baseline gap-3">
                <h1
                  className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase ${
                    isDanger
                      ? "text-nerv-danger animate-danger-pulse-text drop-shadow-[0_0_15px_rgba(255,46,99,0.8)]"
                      : isWarn
                      ? "text-nerv-warn"
                      : "text-nerv-safe"
                  }`}
                >
                  STATUS: {status}
                </h1>
                <span className="text-sm sm:text-lg font-mono text-nerv-subtle font-semibold">
                  {isDanger ? "⚠️ PERINGATAN DARURAT!" : isWarn ? "⚡ WASPADA GETARAN" : "🟢 KONDISI STABIL"}
                </span>
              </div>

              {/* Japanese Description */}
              <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl">
                {isDanger
                  ? "PERINGATAN DINI AKTIF: Getaran seismik melebihi batas aman! Segera lakukan prosedur penyelamatan darurat!"
                  : isWarn
                  ? "PERINGATAN AWAL: Aktivitas seismik sedang terdeteksi. Harap waspada dan perhatikan sekeliling Anda."
                  : "Sistem seismograf memantau dalam kondisi normal. Tidak ada ancaman gempa signifikan terdeteksi."}
              </p>
            </div>
          </div>

          {/* Right Data Pill: Shindo Scale & Vibration Numerical Display */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            {/* Shindo Scale Badge */}
            <div className="flex-1 lg:flex-initial flex flex-col items-center justify-center px-4 py-3 rounded-xl bg-[#0D0F12]/80 border border-nerv-surfaceBorder text-center min-w-[110px]">
              <span className="text-[10px] font-mono text-nerv-subtle tracking-wider uppercase">
                震度階級
              </span>
              <div
                className={`text-2xl sm:text-3xl font-black font-mono mt-0.5 ${
                  isDanger ? "text-nerv-danger" : isWarn ? "text-nerv-warn" : "text-nerv-safe"
                }`}
              >
                震度 {shindoScale}
              </div>
              <span className="text-[10px] font-mono text-gray-400 truncate max-w-[100px]">
                {shindoLabel}
              </span>
            </div>

            {/* Live Vibration Readout */}
            <div className="flex-1 lg:flex-initial flex flex-col items-center justify-center px-4 py-3 rounded-xl bg-[#0D0F12]/80 border border-nerv-surfaceBorder text-center min-w-[130px]">
              <span className="text-[10px] font-mono text-nerv-subtle tracking-wider uppercase">
                VIBRATION VALUE
              </span>
              <div
                className={`text-2xl sm:text-3xl font-black font-mono mt-0.5 ${
                  isDanger ? "text-nerv-danger" : isWarn ? "text-nerv-warn" : "text-white"
                }`}
              >
                {vibration}
                <span className="text-xs text-nerv-subtle ml-1 font-normal">m/s²</span>
              </div>
              <span className="text-[10px] font-mono text-nerv-cyan">
                {vibration >= 300 ? "Level Kritis" : vibration >= 100 ? "Level Sedang" : "Level Mikro"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Radio, Crosshair } from "lucide-react";
import { SensorStatus } from "@/lib/types";

interface SeismicRadarProps {
  status: SensorStatus;
  vibration: number;
}

export const SeismicRadar: React.FC<SeismicRadarProps> = ({ status, vibration }) => {
  const isDanger = status === "BAHAYA";
  const isWarn = status === "WASPADA";

  const themeColor = isDanger ? "#FF2E63" : isWarn ? "#FFB703" : "#00FF99";
  const glowColor = isDanger
    ? "rgba(255, 46, 99, 0.4)"
    : isWarn
    ? "rgba(255, 183, 3, 0.3)"
    : "rgba(0, 255, 153, 0.25)";

  // Pulse speed based on vibration
  const pulseDuration = isDanger ? 0.9 : isWarn ? 1.8 : 3.0;

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-[#161B22] rounded-2xl border border-nerv-surfaceBorder overflow-hidden shadow-2xl">
      {/* Top HUD Tag */}
      <div className="w-full flex items-center justify-between mb-4 z-10">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-nerv-cyan" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-white">
            SEISMIC RADAR & WAVE TELEMETRY
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-nerv-subtle bg-[#0D0F12] px-2.5 py-1 rounded border border-nerv-surfaceBorder">
          <span className="inline-block w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: themeColor }} />
          <span>地震波解析 (RADAR PULSE)</span>
        </div>
      </div>

      {/* Center Radar Visual Area */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center my-2">
        {/* Radar Background Grid Rings */}
        <div className="absolute inset-0 rounded-full border border-nerv-surfaceBorder/60" />
        <div className="absolute inset-8 rounded-full border border-nerv-surfaceBorder/50" />
        <div className="absolute inset-16 rounded-full border border-nerv-surfaceBorder/40" />
        <div className="absolute inset-24 rounded-full border border-nerv-surfaceBorder/30" />

        {/* Crosshair Grids */}
        <div className="absolute w-full h-[1px] bg-nerv-surfaceBorder/70" />
        <div className="absolute h-full w-[1px] bg-nerv-surfaceBorder/70" />
        <div className="absolute w-full h-[1px] bg-nerv-cyan/20 rotate-45" />
        <div className="absolute w-full h-[1px] bg-nerv-cyan/20 -rotate-45" />

        {/* Animated Radar Sweep Scanner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: isDanger ? 2 : 4.5, ease: "linear" }}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, transparent 270deg, ${glowColor} 360deg)`,
          }}
        />

        {/* Seismic Wave Pulse Rings (Framer Motion) */}
        {[0, 0.4, 0.8].map((delayFactor, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0.2, opacity: 0.9 }}
            animate={{ scale: [0.2, 1.35, 1.6], opacity: [0.9, 0.4, 0] }}
            transition={{
              repeat: Infinity,
              duration: pulseDuration,
              delay: delayFactor * pulseDuration,
              ease: "easeOut",
            }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "100%",
              height: "100%",
              border: `2px solid ${themeColor}`,
              boxShadow: `0 0 20px ${themeColor}`,
            }}
          />
        ))}

        {/* Center Node: Epicenter / ESP32 Sensor */}
        <div
          className="relative z-10 flex flex-col items-center justify-center w-20 h-20 rounded-full border-2 bg-[#0D0F12] shadow-2xl transition-transform duration-300"
          style={{
            borderColor: themeColor,
            boxShadow: `0 0 25px ${glowColor}`,
          }}
        >
          <Radio className="w-6 h-6 animate-pulse" style={{ color: themeColor }} />
          <span className="text-[10px] font-mono font-bold mt-0.5 text-white">ESP32</span>
          <span className="text-[8px] font-mono" style={{ color: themeColor }}>
            {vibration} m/s²
          </span>
        </div>

        {/* Hazard Watermark in Danger Mode */}
        {isDanger && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            className="absolute z-20 pointer-events-none text-center"
          >
            <div className="text-3xl sm:text-4xl font-black text-nerv-danger/80 tracking-widest font-mono select-none drop-shadow-md">
              警報発令
            </div>
            <div className="text-xs font-mono font-bold text-nerv-danger uppercase tracking-wider">
              SEISMIC SHOCKWAVE ACTIVE
            </div>
          </motion.div>
        )}
      </div>

      {/* Radar Bottom Metadata */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono text-nerv-subtle border-t border-nerv-surfaceBorder/80 pt-3 mt-2">
        <span>LOC: -6.9932° S, 110.4203° E (SEMARANG)</span>
        <span className="text-nerv-cyan font-semibold">RANGE: 50 KM</span>
        <span style={{ color: themeColor }}>
          STATUS: {status}
        </span>
      </div>
    </div>
  );
};

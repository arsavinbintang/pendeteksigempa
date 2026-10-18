"use client";

import React from "react";
import { Gauge, ShieldAlert } from "lucide-react";
import { SensorStatus } from "@/lib/types";

interface SeismicGaugeProps {
  vibration: number;
  status: SensorStatus;
  peakValue: number;
}

export const SeismicGauge: React.FC<SeismicGaugeProps> = ({
  vibration,
  status,
  peakValue,
}) => {
  // Clamp value between 0 and 1000
  const clamped = Math.min(1000, Math.max(0, vibration));
  // Angle for 240 degree gauge arc (-120deg to +120deg)
  const angle = -120 + (clamped / 1000) * 240;

  // Arc stroke dash calculations for 240 degree arc (r = 80 -> circumference = 2 * PI * 80 * (240/360) = ~335)
  const radius = 80;
  const arcLength = 2 * Math.PI * radius * (240 / 360);
  const strokeOffset = arcLength - (clamped / 1000) * arcLength;

  const isDanger = status === "BAHAYA";
  const isWarn = status === "WASPADA";
  const activeColor = isDanger ? "#FF2E63" : isWarn ? "#FFB703" : "#00FF99";

  return (
    <div className="flex flex-col items-center justify-between p-6 bg-[#161B22] rounded-2xl border border-nerv-surfaceBorder shadow-xl relative overflow-hidden">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-nerv-cyan" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-white">
            SEISMIC INTENSITY GAUGE
          </span>
        </div>
        <span className="text-[10px] font-mono text-nerv-subtle">
          震度メーター (0 - 1000 m/s²)
        </span>
      </div>

      {/* SVG Arc Gauge */}
      <div className="relative w-56 h-48 flex items-center justify-center">
        <svg viewBox="0 0 200 160" className="w-full h-full">
          {/* Background Track Arc */}
          <path
            d="M 30.7 130 A 80 80 0 1 1 169.3 130"
            fill="none"
            stroke="#272E3B"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Color Segments Indicator Dots/Ticks */}
          {/* Safe Zone (0 - 99: ~10% of 240deg = 24deg) */}
          <path
            d="M 30.7 130 A 80 80 0 0 1 45 92"
            fill="none"
            stroke="rgba(0, 255, 153, 0.3)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Warning Zone (100 - 299: ~20% of 240deg = 48deg) */}
          <path
            d="M 46 88 A 80 80 0 0 1 95 40"
            fill="none"
            stroke="rgba(255, 183, 3, 0.3)"
            strokeWidth="14"
          />
          {/* Danger Zone (300 - 1000: ~70% of 240deg) */}
          <path
            d="M 100 40 A 80 80 0 0 1 169.3 130"
            fill="none"
            stroke="rgba(255, 46, 99, 0.3)"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Active Level Arc */}
          <path
            d="M 30.7 130 A 80 80 0 1 1 169.3 130"
            fill="none"
            stroke={activeColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeOffset}
            style={{
              transition: "stroke-dashoffset 0.4s ease-out, stroke 0.3s ease",
              filter: `drop-shadow(0 0 6px ${activeColor})`,
            }}
          />

          {/* Needle Center Pin */}
          <circle cx="100" cy="120" r="7" fill="#E6EDF3" />
          <circle cx="100" cy="120" r="3" fill="#0D0F12" />

          {/* Rotating Needle Indicator */}
          <g
            transform={`rotate(${angle} 100 120)`}
            style={{ transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
          >
            <line
              x1="100"
              y1="120"
              x2="100"
              y2="52"
              stroke="#FFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <polygon points="100,46 97,55 103,55" fill={activeColor} />
          </g>
        </svg>

        {/* Digital Readout Inside Gauge */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <div
            className="text-3xl font-black font-mono tracking-tight"
            style={{ color: activeColor }}
          >
            {vibration}
          </div>
          <span className="text-[10px] font-mono text-nerv-subtle uppercase">
            m/s² Getaran
          </span>
        </div>
      </div>

      {/* Threshold Zone Indicators */}
      <div className="w-full grid grid-cols-3 gap-1.5 mt-2 text-center text-[10px] font-mono">
        <div
          className={`py-1.5 px-1 rounded border transition-all ${
            status === "AMAN"
              ? "bg-nerv-safe/20 border-nerv-safe text-nerv-safe font-bold"
              : "bg-[#0D0F12] border-nerv-surfaceBorder text-gray-400"
          }`}
        >
          <span>AMAN</span>
          <div className="text-[9px] text-nerv-subtle">&lt; 100</div>
        </div>

        <div
          className={`py-1.5 px-1 rounded border transition-all ${
            status === "WASPADA"
              ? "bg-nerv-warn/20 border-nerv-warn text-nerv-warn font-bold"
              : "bg-[#0D0F12] border-nerv-surfaceBorder text-gray-400"
          }`}
        >
          <span>WASPADA</span>
          <div className="text-[9px] text-nerv-subtle">100 - 299</div>
        </div>

        <div
          className={`py-1.5 px-1 rounded border transition-all ${
            status === "BAHAYA"
              ? "bg-nerv-danger/20 border-nerv-danger text-nerv-danger font-bold animate-pulse"
              : "bg-[#0D0F12] border-nerv-surfaceBorder text-gray-400"
          }`}
        >
          <span>BAHAYA</span>
          <div className="text-[9px] text-nerv-subtle">&ge; 300</div>
        </div>
      </div>

      {/* Peak 24h Readout */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono text-nerv-subtle mt-3 pt-2.5 border-t border-nerv-surfaceBorder">
        <div className="flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-nerv-cyan" />
          <span>Puncak 24 Jam:</span>
        </div>
        <span className="font-bold text-white font-mono">{peakValue} m/s²</span>
      </div>
    </div>
  );
};

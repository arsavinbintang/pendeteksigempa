"use client";

import React from "react";
import { motion } from "framer-motion";
import { Home, Layers, AlertCircle, CheckCircle, ShieldAlert } from "lucide-react";
import { SensorStatus } from "@/lib/types";

interface SoilHouseVisualizerProps {
  status: SensorStatus;
  vibration: number;
}

export const SoilHouseVisualizer: React.FC<SoilHouseVisualizerProps> = ({
  status,
  vibration,
}) => {
  const isDanger = status === "BAHAYA";
  const isWarn = status === "WASPADA";

  const themeColor = isDanger ? "#FF2E63" : isWarn ? "#FFB703" : "#00FF99";

  // Dynamic shaking animation parameters for the house
  const houseShakeVariants = {
    AMAN: {
      x: 0,
      rotate: 0,
      transition: { duration: 0.5 },
    },
    WASPADA: {
      x: [-1.5, 1.5, -1.5, 1.5, 0],
      rotate: [-0.4, 0.4, -0.4, 0.4, 0],
      transition: {
        repeat: Infinity,
        duration: 0.35,
        ease: "easeInOut",
      },
    },
    BAHAYA: {
      x: [-5, 5, -4, 4, -5, 5, 0],
      y: [-2, 2, -1, 1, 0],
      rotate: [-1.8, 1.8, -1.5, 1.5, 0],
      transition: {
        repeat: Infinity,
        duration: 0.18,
        ease: "easeInOut",
      },
    },
  };

  // Soil seismic wave pulse animation
  const waveShakeVariants = {
    AMAN: { x: 0 },
    WASPADA: {
      x: [-2, 2, -2],
      transition: { repeat: Infinity, duration: 0.5 },
    },
    BAHAYA: {
      x: [-6, 6, -6],
      transition: { repeat: Infinity, duration: 0.2 },
    },
  };

  return (
    <div className="flex flex-col p-6 bg-[#161B22] rounded-2xl border border-nerv-surfaceBorder shadow-xl relative overflow-hidden">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-nerv-cyan" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-white">
            GEOLOGICAL STRATA & STRUCTURAL INTEGRITY
          </span>
        </div>
        <span className="text-[10px] font-mono text-nerv-subtle">
          地盤・建築物応答 (SOIL-HOUSE RESPONSE)
        </span>
      </div>

      {/* SVG Diagram Section */}
      <div className="relative w-full h-56 bg-[#0D0F12] rounded-xl border border-nerv-surfaceBorder/80 p-2 overflow-hidden flex flex-col justify-end">
        {/* Dynamic Warning Watermark in Danger Mode */}
        {isDanger && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded bg-nerv-danger/20 border border-nerv-danger text-nerv-danger text-[10px] font-mono font-bold animate-pulse z-20">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>CRITICAL DISPLACEMENT</span>
          </div>
        )}

        {/* Ambient Grid Background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* 1. House Structural Model (Animated with Framer Motion) */}
        <div className="relative z-10 flex flex-col items-center justify-center mb-0">
          <motion.div
            variants={houseShakeVariants}
            animate={status}
            className="flex flex-col items-center"
          >
            {/* House Vector Art */}
            <svg width="120" height="85" viewBox="0 0 120 85" className="overflow-visible">
              {/* Roof */}
              <polygon
                points="60,5 110,38 10,38"
                fill="#1C2331"
                stroke={themeColor}
                strokeWidth="2.5"
                style={{ filter: `drop-shadow(0 0 6px ${themeColor})` }}
              />

              {/* Chimney */}
              <rect x="80" y="14" width="10" height="18" fill="#272E3B" stroke={themeColor} strokeWidth="1" />

              {/* Main Body Walls */}
              <rect
                x="22"
                y="38"
                width="76"
                height="44"
                fill="#161B22"
                stroke={themeColor}
                strokeWidth="2.5"
              />

              {/* Windows */}
              <rect
                x="30"
                y="46"
                width="16"
                height="16"
                fill={isDanger ? "rgba(255,46,99,0.3)" : isWarn ? "rgba(255,183,3,0.3)" : "rgba(0,255,153,0.2)"}
                stroke={themeColor}
                strokeWidth="1.5"
              />
              <line x1="38" y1="46" x2="38" y2="62" stroke={themeColor} strokeWidth="1" />
              <line x1="30" y1="54" x2="46" y2="54" stroke={themeColor} strokeWidth="1" />

              <rect
                x="74"
                y="46"
                width="16"
                height="16"
                fill={isDanger ? "rgba(255,46,99,0.3)" : isWarn ? "rgba(255,183,3,0.3)" : "rgba(0,255,153,0.2)"}
                stroke={themeColor}
                strokeWidth="1.5"
              />
              <line x1="82" y1="46" x2="82" y2="62" stroke={themeColor} strokeWidth="1" />
              <line x1="74" y1="54" x2="90" y2="54" stroke={themeColor} strokeWidth="1" />

              {/* Door */}
              <rect x="52" y="52" width="16" height="30" fill="#0D0F12" stroke={themeColor} strokeWidth="1.5" />
              <circle cx="64" cy="67" r="1.5" fill={themeColor} />

              {/* Cracks / Strain lines if BAHAYA */}
              {isDanger && (
                <>
                  <path d="M 45 40 L 48 55 L 43 65" fill="none" stroke="#FF2E63" strokeWidth="2" />
                  <path d="M 70 42 L 67 52 L 72 60" fill="none" stroke="#FF2E63" strokeWidth="2" />
                </>
              )}
            </svg>
          </motion.div>
        </div>

        {/* 2. Foundation Beam */}
        <div
          className="relative z-10 w-full h-3 border-y flex items-center justify-around transition-colors"
          style={{
            borderColor: themeColor,
            backgroundColor: `${themeColor}22`,
          }}
        >
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }} />
          ))}
        </div>

        {/* 3. Soil Geological Strata Layers */}
        <motion.div variants={waveShakeVariants} animate={status} className="w-full flex flex-col">
          {/* Surface Layer (Lapisan Tanah Permukaan / Alluvium) */}
          <div className="h-8 bg-[#18202A] border-b border-nerv-surfaceBorder/60 px-3 flex items-center justify-between text-[9px] font-mono text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              Tanah Aluvial Permukaan (0 - 5m)
            </span>
            <span className="text-nerv-subtle">Vs = 180 m/s</span>
          </div>

          {/* Subsoil Layer (Lapisan Pasir & Lempung Padat) */}
          <div className="h-8 bg-[#131922] border-b border-nerv-surfaceBorder/60 px-3 flex items-center justify-between text-[9px] font-mono text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-700" />
              Lapisan Sedimen Keras (5 - 25m)
            </span>
            <span className="text-nerv-subtle">Vs = 350 m/s</span>
          </div>

          {/* Bedrock Layer (Batuan Dasar Seismik) */}
          <div className="h-9 bg-[#0E131A] px-3 flex items-center justify-between text-[9px] font-mono text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
              Batuan Dasar Seismik / Bedrock (&gt; 25m)
            </span>
            <span className="text-nerv-cyan font-bold">Vs &gt; 800 m/s</span>
          </div>
        </motion.div>

        {/* Seismic Fault Propagation Vectors (P & S Waves) */}
        {isDanger && (
          <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none flex items-center justify-around z-20">
            {[...Array(5)].map((_, idx) => (
              <motion.div
                key={idx}
                animate={{ y: [20, -40], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: idx * 0.12 }}
                className="text-xs font-bold text-nerv-danger flex flex-col items-center"
              >
                <span>▲</span>
                <span className="text-[8px] font-mono">S-WAVE</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Structural Diagnostics Message */}
      <div className="mt-3 p-2.5 rounded-xl bg-[#0D0F12] border border-nerv-surfaceBorder flex items-center gap-2.5">
        {isDanger ? (
          <AlertCircle className="w-5 h-5 text-nerv-danger flex-shrink-0 animate-bounce" />
        ) : isWarn ? (
          <AlertCircle className="w-5 h-5 text-nerv-warn flex-shrink-0 animate-pulse" />
        ) : (
          <CheckCircle className="w-5 h-5 text-nerv-safe flex-shrink-0" />
        )}
        <div className="text-xs font-mono">
          <div className="font-bold text-white">
            {isDanger
              ? "DEFORMASI STRUKTUR TINGGI - ANCAMAN RETAK / ROBOH"
              : isWarn
              ? "GETARAN TERDETEKSI - RESONANSI STRUKTUR RINGAN"
              : "STRUKTUR BANGUNAN & TANAH KONDISI STABIL"}
          </div>
          <div className="text-[10px] text-nerv-subtle">
            {isDanger
              ? "Gelombang geser S-Wave memicu percepatan tanah tinggi. Segera evakuasi!"
              : isWarn
              ? "Fondasi merespons getaran seismik minor. Pantau kestabilan barang gantung."
              : "Tanah dasar dalam batas elastisitas normal tanpa indikasi likuifaksi."}
          </div>
        </div>
      </div>
    </div>
  );
};

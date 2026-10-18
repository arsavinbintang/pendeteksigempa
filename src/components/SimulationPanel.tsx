"use client";

import React, { useState, useEffect } from "react";
import { Sliders, Play, Pause, Send, Sparkles, AlertTriangle, ShieldCheck, Flame } from "lucide-react";
import { SensorStatus } from "@/lib/types";

interface SimulationPanelProps {
  onDataSent?: () => void;
  status: SensorStatus;
  currentVibration: number;
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({
  onDataSent,
  status,
  currentVibration,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [sliderVal, setSliderVal] = useState<number>(currentVibration || 24);
  const [isAutoSimulating, setIsAutoSimulating] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  // Send POST to /api/sensor
  const sendReading = React.useCallback(async (value: number, manualStatus?: SensorStatus) => {
    setIsSending(true);
    try {
      let stat: SensorStatus = "AMAN";
      if (manualStatus) {
        stat = manualStatus;
      } else {
        if (value >= 300) stat = "BAHAYA";
        else if (value >= 100) stat = "WASPADA";
        else stat = "AMAN";
      }

      await fetch("/api/sensor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: stat,
          nilai_getaran: value,
          deviceId: "ESP32-SIMULATOR",
        }),
      });

      if (onDataSent) onDataSent();
    } catch (e) {
      console.error("Gagal mengirim simulasi:", e);
    } finally {
      setIsSending(false);
    }
  }, [onDataSent]);

  // Auto-simulation ticker
  useEffect(() => {
    if (!isAutoSimulating) return;

    const interval = setInterval(() => {
      // Generate natural fluctuations with random small peaks
      const base = 20;
      const variation = Math.floor(Math.random() * 25);
      const randomSpike = Math.random() < 0.08 ? Math.floor(110 + Math.random() * 80) : 0;
      const finalVal = randomSpike > 0 ? randomSpike : base + variation;

      sendReading(finalVal);
      setSliderVal(finalVal);
    }, 2500);

    return () => clearInterval(interval);
  }, [isAutoSimulating, sendReading]);

  return (
    <div className="flex flex-col p-6 bg-[#161B22] rounded-2xl border border-nerv-surfaceBorder shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-nerv-cyan" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-white">
            ESP32 HARDWARE EMULATOR & TEST DECK
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto-sim toggle */}
          <button
            onClick={() => setIsAutoSimulating(!isAutoSimulating)}
            className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-lg border transition-all ${
              isAutoSimulating
                ? "bg-nerv-safe/20 text-nerv-safe border-nerv-safe animate-pulse"
                : "bg-[#0D0F12] text-nerv-subtle border-nerv-surfaceBorder hover:text-white"
            }`}
          >
            {isAutoSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoSimulating ? "Auto-Stream: ON" : "Auto-Stream: OFF"}</span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs font-mono text-nerv-subtle hover:text-white px-2 py-1 rounded bg-[#0D0F12] border border-nerv-surfaceBorder"
          >
            {isOpen ? "Tutup" : "Buka"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-4 pt-1">
          <p className="text-xs text-nerv-subtle leading-relaxed">
            Gunakan panel ini untuk menguji respon sistem (Sirine Titut-Titut, Notifikasi Browser & Modal Evakuasi)
            tanpa harus menunggu gempa fisik atau hardware ESP32 terhubung.
          </p>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* AMAN preset */}
            <button
              onClick={() => {
                setSliderVal(24);
                sendReading(24, "AMAN");
              }}
              disabled={isSending}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-nerv-safe/10 hover:bg-nerv-safe/20 border border-nerv-safe/40 text-nerv-safe font-mono text-xs font-bold transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Kirim: AMAN (24 m/s²)</span>
            </button>

            {/* WASPADA preset */}
            <button
              onClick={() => {
                setSliderVal(185);
                sendReading(185, "WASPADA");
              }}
              disabled={isSending}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-nerv-warn/10 hover:bg-nerv-warn/20 border border-nerv-warn/40 text-nerv-warn font-mono text-xs font-bold transition-all"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Kirim: WASPADA (185 m/s²)</span>
            </button>

            {/* BAHAYA preset */}
            <button
              onClick={() => {
                setSliderVal(450);
                sendReading(450, "BAHAYA");
              }}
              disabled={isSending}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-nerv-danger/15 hover:bg-nerv-danger/30 border border-nerv-danger text-nerv-danger font-mono text-xs font-bold transition-all shadow-md shadow-nerv-danger/20"
            >
              <Flame className="w-4 h-4 animate-bounce" />
              <span>🚨 PICU BAHAYA (450 m/s²)</span>
            </button>
          </div>

          {/* Manual Vibration Slider */}
          <div className="bg-[#0D0F12] p-4 rounded-xl border border-nerv-surfaceBorder">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-nerv-subtle flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-nerv-cyan" />
                <span>Slider Tingkat Getaran Kustom:</span>
              </span>
              <span className="text-white font-bold text-sm">{sliderVal} m/s²</span>
            </div>

            <input
              type="range"
              min="0"
              max="900"
              step="5"
              value={sliderVal}
              onChange={(e) => setSliderVal(Number(e.target.value))}
              className="w-full h-2 bg-[#161B22] rounded-lg appearance-none cursor-pointer accent-nerv-cyan"
            />

            <div className="flex justify-between text-[10px] font-mono text-nerv-subtle mt-2">
              <span className="text-nerv-safe font-semibold">0 - 99: AMAN</span>
              <span className="text-nerv-warn font-semibold">100 - 299: WASPADA</span>
              <span className="text-nerv-danger font-semibold">300+: BAHAYA</span>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                onClick={() => sendReading(sliderVal)}
                disabled={isSending}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-nerv-cyan hover:bg-teal-400 text-black font-bold font-mono text-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? "Mengirim..." : `Kirim Nilai ${sliderVal} m/s² ke API`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

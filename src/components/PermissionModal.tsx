"use client";

import React, { useState } from "react";
import { ShieldCheck, Volume2, Bell, Radio, CheckCircle2 } from "lucide-react";
import { audioSystem } from "@/lib/audio-synthesizer";
import { requestNotificationPermission } from "@/lib/notification-service";

interface PermissionModalProps {
  isOpen: boolean;
  onActivated: () => void;
  onDismiss: () => void;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  isOpen,
  onActivated,
  onDismiss,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleActivate = async () => {
    setIsProcessing(true);
    try {
      // 1. Initialize AudioContext via user interaction gesture
      audioSystem.init();
      audioSystem.playTestSound();

      // 2. Request Notification Permission
      await requestNotificationPermission();

      onActivated();
    } catch (e) {
      console.error("Activation failed:", e);
      onActivated();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative max-w-lg w-full bg-[#161B22] border-2 border-nerv-cyan/50 rounded-2xl shadow-2xl p-6 sm:p-8 text-white overflow-hidden">
        {/* Japanese Hazard Stripe Header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-nerv-safe via-nerv-cyan to-nerv-warn" />

        {/* Japanese Subheader Badge */}
        <div className="flex items-center justify-between mb-4 mt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-nerv-cyan/20 text-nerv-cyan border border-nerv-cyan/40 uppercase font-semibold">
              防災システム認可 (SYSTEM AUTHORIZATION)
            </span>
          </div>
          <span className="text-xs font-mono text-nerv-subtle">PT MUSANG SEISMIC</span>
        </div>

        {/* Modal Title */}
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
          <ShieldCheck className="w-7 h-7 text-nerv-cyan flex-shrink-0" />
          <span>Aktifkan Sistem Peringatan Dini & Alarm Suara</span>
        </h2>

        {/* Explanation text */}
        <p className="text-sm text-nerv-subtle mt-3 leading-relaxed">
          Sesuai standar protokol peringatan gempa bumi (NERV / JMA), sistem membutuhkan otorisasi Anda
          untuk membunyikan sirine darurat otomatis dan menyiarkan notifikasi bahaya secara real-time.
        </p>

        {/* Feature List */}
        <div className="mt-5 space-y-3 bg-[#0D0F12]/80 p-4 rounded-xl border border-nerv-surfaceBorder">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-nerv-safe/10 border border-nerv-safe/30 text-nerv-safe">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Alarm Darurat Frekuensi Tinggi</h4>
              <p className="text-xs text-nerv-subtle">
                Membunyikan nada sirine &quot;titut-titut&quot; saat sensor ESP32 mendeteksi getaran &ge; 300.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-nerv-cyan/10 border border-nerv-cyan/30 text-nerv-cyan">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Web Push Notification</h4>
              <p className="text-xs text-nerv-subtle">
                Mengirimkan peringatan evakuasi pop-up pada layar komputer/ponsel seketika saat gempa terjadi.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-nerv-warn/10 border border-nerv-warn/30 text-nerv-warn">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Sinkronisasi Sensor ESP32</h4>
              <p className="text-xs text-nerv-subtle">
                Menerima telemetri live streaming getaran dari modul IoT secara kontinu.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleActivate}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-nerv-cyan via-teal-400 to-nerv-safe text-black font-black text-sm tracking-wide shadow-lg hover:shadow-nerv-cyan/30 hover:scale-[1.02] transition-all duration-200"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isProcessing ? "Menginisialisasi..." : "Aktifkan Sistem Sekarang"}</span>
          </button>

          <button
            onClick={onDismiss}
            className="px-4 py-3 rounded-xl bg-nerv-surface hover:bg-nerv-surfaceHover border border-nerv-surfaceBorder text-nerv-subtle hover:text-white font-mono text-xs transition-colors"
          >
            Nanti Saja
          </button>
        </div>

        <div className="mt-3 text-center">
          <span className="text-[10px] font-mono text-nerv-subtle">
            Tombol ini akan memainkan nada uji singkat untuk memverifikasi audio speaker Anda.
          </span>
        </div>
      </div>
    </div>
  );
};

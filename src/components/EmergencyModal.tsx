"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  VolumeX,
  Volume2,
  Shield,
  EyeOff,
  Ban,
  Footprints,
  PhoneCall,
  XCircle,
} from "lucide-react";
import { audioSystem } from "@/lib/audio-synthesizer";

interface EmergencyModalProps {
  isOpen: boolean;
  vibration: number;
  shindoScale: string;
  onDismiss: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  vibration,
  shindoScale,
  onDismiss,
}) => {
  const [isSilenced, setIsSilenced] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(30);

  useEffect(() => {
    if (isOpen) {
      setIsSilenced(false);
      setCountdown(30);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleSilence = () => {
    if (!isSilenced) {
      audioSystem.stopEmergencySiren();
      setIsSilenced(true);
    } else {
      audioSystem.startEmergencySiren();
      setIsSilenced(false);
    }
  };

  const handleDismissModal = () => {
    audioSystem.stopEmergencySiren();
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-emergency-flash overflow-y-auto">
      <div className="relative max-w-3xl w-full my-auto bg-[#161B22] border-4 border-nerv-danger rounded-3xl shadow-[0_0_80px_rgba(255,46,99,0.7)] text-white overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Danger Bar */}
        <div className="w-full h-4 hazard-stripe-red animate-pulse" />

        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-nerv-surfaceBorder bg-gradient-to-b from-nerv-danger/30 to-transparent">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-nerv-danger text-black font-black font-mono text-xs uppercase tracking-widest animate-pulse">
                緊急地震速報 (EARTHQUAKE ALERT)
              </span>
              <span className="text-xs font-mono text-white/80">PT MUSANG SEISMIC SYSTEM</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleSilence}
                className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
                  isSilenced
                    ? "bg-nerv-surface text-nerv-subtle border-nerv-surfaceBorder hover:text-white"
                    : "bg-nerv-danger text-black font-bold border-nerv-danger shadow-lg shadow-nerv-danger/50"
                }`}
              >
                {isSilenced ? (
                  <>
                    <Volume2 className="w-4 h-4 text-white" />
                    <span>Nyalakan Sirine</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-black animate-bounce" />
                    <span>Senyapkan Sirine (&quot;Titut-Titut&quot;)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDismissModal}
                className="p-1.5 rounded-lg bg-nerv-surface hover:bg-nerv-surfaceHover text-nerv-subtle hover:text-white border border-nerv-surfaceBorder"
                title="Tutup Peringatan"
              >
                <XCircle className="w-5 h-5 text-gray-300 hover:text-white" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mt-3">
            <div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-nerv-danger uppercase drop-shadow-[0_0_20px_rgba(255,46,99,0.9)] animate-pulse">
                🚨 PERINGATAN GEMPA BUMI!
              </h2>
              <p className="text-sm sm:text-base text-gray-200 mt-1">
                Sensor mendeteksi getaran seismik kuat <span className="font-bold text-nerv-danger">({vibration} m/s² - 震度 {shindoScale})</span>. Segera selamatkan diri!
              </p>
            </div>

            <div className="flex items-center gap-3 bg-[#0D0F12] px-4 py-2.5 rounded-2xl border-2 border-nerv-danger/70 self-start sm:self-auto">
              <AlertTriangle className="w-7 h-7 text-nerv-danger animate-bounce" />
              <div className="text-right font-mono">
                <div className="text-2xl font-black text-nerv-danger leading-none">{vibration} m/s²</div>
                <div className="text-[10px] text-gray-400">AMBANG KRITIS &ge; 300</div>
              </div>
            </div>
          </div>
        </div>

        {/* Evacuation Safety Action Plan Steps */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black tracking-wide text-white uppercase flex items-center gap-2 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-nerv-danger inline-block animate-ping" />
              <span>ARAHAN KESELAMATAN SEGERA (SAFETY ACTION PLAN)</span>
            </h3>
            <span className="text-xs font-mono text-nerv-cyan">PROTOKOL NERV / JMA</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-[#0D0F12] border-2 border-nerv-danger/60 hover:border-nerv-danger transition-all">
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-xl bg-nerv-danger/20 border border-nerv-danger text-nerv-danger flex-shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-nerv-danger bg-nerv-danger/10 px-1.5 py-0.5 rounded">
                      LANGKAH 01
                    </span>
                    <h4 className="text-sm font-bold text-white">Lindungi Kepala</h4>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    Berlindunglah segera di bawah meja yang kokoh. Lindungi kepala dan leher dengan tas, bantal, atau tangan Anda (Drop, Cover, Hold On).
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-[#0D0F12] border-2 border-nerv-danger/60 hover:border-nerv-danger transition-all">
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-xl bg-nerv-warn/20 border border-nerv-warn text-nerv-warn flex-shrink-0">
                  <EyeOff className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-nerv-warn bg-nerv-warn/10 px-1.5 py-0.5 rounded">
                      LANGKAH 02
                    </span>
                    <h4 className="text-sm font-bold text-white">Jauhi Kaca & Jendela</h4>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    Menjauhlah dari jendela kaca, cermin besar, lemari tinggi, dan benda gantung yang berpotensi pecah atau roboh menimpa Anda.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-[#0D0F12] border-2 border-nerv-danger/60 hover:border-nerv-danger transition-all">
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500 text-red-400 flex-shrink-0">
                  <Ban className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-red-400 bg-red-950/40 px-1.5 py-0.5 rounded">
                      LANGKAH 03
                    </span>
                    <h4 className="text-sm font-bold text-white">Jangan Gunakan Lift!</h4>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    Dilarang keras memakai elevator/lift karena risiko listrik padam atau kabel macet. Selalu gunakan tangga darurat gedung.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl bg-[#0D0F12] border-2 border-nerv-danger/60 hover:border-nerv-danger transition-all">
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-xl bg-nerv-safe/20 border border-nerv-safe text-nerv-safe flex-shrink-0">
                  <Footprints className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-nerv-safe bg-nerv-safe/10 px-1.5 py-0.5 rounded">
                      LANGKAH 04
                    </span>
                    <h4 className="text-sm font-bold text-white">Evakuasi ke Tanah Lapang</h4>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    Setelah getaran utama reda, matikan kompor/listrik jika memungkinkan, lalu bergerak tenang menuju lapangan terbuka jauh dari tiang listrik.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Emergency Hotlines */}
          <div className="p-4 rounded-2xl bg-[#0D0F12] border border-nerv-surfaceBorder flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-nerv-cyan" />
              <span className="text-xs font-mono text-nerv-subtle">NOMOR DARURAT CEPAT (INDONESIA):</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2 py-1 rounded bg-nerv-surface border border-nerv-surfaceBorder font-bold text-white">
                SAR: 115
              </span>
              <span className="px-2 py-1 rounded bg-nerv-surface border border-nerv-surfaceBorder font-bold text-white">
                BNPB: 117
              </span>
              <span className="px-2 py-1 rounded bg-nerv-surface border border-nerv-surfaceBorder font-bold text-white">
                Ambulans: 119
              </span>
              <span className="px-2 py-1 rounded bg-nerv-surface border border-nerv-surfaceBorder font-bold text-white">
                Polisi: 110
              </span>
            </div>
          </div>

          {/* Dismiss Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleDismissModal}
              className="flex-1 py-3.5 px-6 rounded-xl bg-nerv-danger hover:bg-nerv-dangerDark text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-nerv-danger/40 transition-all text-center"
            >
              Saya Sudah Mengamankan Diri (Lanjutkan Monitor)
            </button>
            <button
              onClick={handleToggleSilence}
              className="py-3.5 px-5 rounded-xl bg-nerv-surface hover:bg-nerv-surfaceHover border border-nerv-surfaceBorder text-gray-300 hover:text-white font-mono text-xs transition-colors"
            >
              {isSilenced ? "Suara Alarm Hening" : "Hentikan Suara Alarm Saja"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

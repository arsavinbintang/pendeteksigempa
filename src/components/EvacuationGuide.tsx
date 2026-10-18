"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Shield,
  EyeOff,
  Ban,
  Footprints,
  Package,
  PhoneCall,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export const EvacuationGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"steps" | "kit">("steps");

  const checklistItems = [
    { title: "Air Minum Bersih (Minimal 3 Liter per orang untuk 3 hari)", icon: "💧" },
    { title: "Makanan Siap Saji Tahan Lama (Biskuit, Makanan Kaleng)", icon: "🥫" },
    { title: "Kotak P3K Lengkap & Obat-obatan Pribadi Darurat", icon: "🩹" },
    { title: "Senter LED + Baterai Cadangan & Peluit Penyelamat", icon: "🔦" },
    { title: "Powerbank Terisi Penuh & Radio Portable FM/AM", icon: "📻" },
    { title: "Salinan Dokumen Penting (KTP, KK, Ijazah) dalam plastik kedap air", icon: "📄" },
    { title: "Uang Tunai Pecahan Kecil", icon: "💵" },
    { title: "Masker N95 & Selimut Termal Darurat", icon: "😷" },
  ];

  return (
    <div className="flex flex-col p-6 bg-[#161B22] rounded-2xl border border-nerv-surfaceBorder shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-nerv-warn" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-white">
            SAFETY ACTION PLAN & DISASTER PREPAREDNESS
          </span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded bg-[#0D0F12] text-nerv-subtle hover:text-white border border-nerv-surfaceBorder transition-colors flex items-center gap-1 text-[11px] font-mono px-2"
        >
          <span>{isOpen ? "Sembunyikan" : "Tampilkan"}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-3 border-t border-nerv-surfaceBorder/80">
          {/* Subheader & Tabs */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-nerv-subtle">
              避難手順・安全行動計画 (Protokol Keselamatan Seismik)
            </span>

            <div className="flex gap-1 bg-[#0D0F12] p-1 rounded-lg border border-nerv-surfaceBorder text-xs font-mono">
              <button
                onClick={() => setActiveTab("steps")}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTab === "steps"
                    ? "bg-nerv-warn/20 text-nerv-warn font-bold border border-nerv-warn/40"
                    : "text-nerv-subtle hover:text-white"
                }`}
              >
                4 Langkah Evakuasi
              </button>
              <button
                onClick={() => setActiveTab("kit")}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTab === "kit"
                    ? "bg-nerv-cyan/20 text-nerv-cyan font-bold border border-nerv-cyan/40"
                    : "text-nerv-subtle hover:text-white"
                }`}
              >
                Tas Siaga Bencana (72 Jam)
              </button>
            </div>
          </div>

          {activeTab === "steps" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Step 1 */}
              <div className="p-4 rounded-xl bg-[#0D0F12] border border-nerv-surfaceBorder hover:border-nerv-safe/60 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-nerv-safe bg-nerv-safe/10 px-2 py-0.5 rounded border border-nerv-safe/30">
                      STEP 01
                    </span>
                    <Shield className="w-5 h-5 text-nerv-safe" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Lindungi Kepala</h4>
                  <p className="text-xs text-nerv-subtle leading-relaxed">
                    Segera berlutut dan berlindung di bawah meja yang kokoh. Pegang kaki meja kuat-kuat hingga guncangan mereda (Drop, Cover, Hold On).
                  </p>
                </div>
                <div className="text-[10px] font-mono text-nerv-safe mt-3 pt-2 border-t border-nerv-surfaceBorder/50">
                  ⚠️ Jangan berlari saat gempa sedang berlangsung!
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl bg-[#0D0F12] border border-nerv-surfaceBorder hover:border-nerv-warn/60 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-nerv-warn bg-nerv-warn/10 px-2 py-0.5 rounded border border-nerv-warn/30">
                      STEP 02
                    </span>
                    <EyeOff className="w-5 h-5 text-nerv-warn" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Jauhi Kaca & Jendela</h4>
                  <p className="text-xs text-nerv-subtle leading-relaxed">
                    Jauhi partisi kaca, jendela luar, cermin, dan rak lemari gantung yang rentan pecah atau runtuh akibat percepatan tanah.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-nerv-warn mt-3 pt-2 border-t border-nerv-surfaceBorder/50">
                  ⚠️ Waspadai serpihan kaca tajam berterbangan!
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl bg-[#0D0F12] border border-nerv-surfaceBorder hover:border-red-500/60 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/30">
                      STEP 03
                    </span>
                    <Ban className="w-5 h-5 text-red-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Jangan Gunakan Lift</h4>
                  <p className="text-xs text-nerv-subtle leading-relaxed">
                    Gunakan selalu tangga darurat. Lift berisiko terjebak akibat pemadaman listrik darurat otomatis (power blackout) atau kabel terpelintir.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-red-400 mt-3 pt-2 border-t border-nerv-surfaceBorder/50">
                  ⚠️ Jika terjebak di lift, tekan tombol alarm darurat!
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl bg-[#0D0F12] border border-nerv-surfaceBorder hover:border-nerv-cyan/60 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-nerv-cyan bg-nerv-cyan/10 px-2 py-0.5 rounded border border-nerv-cyan/30">
                      STEP 04
                    </span>
                    <Footprints className="w-5 h-5 text-nerv-cyan" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Evakuasi ke Tanah Lapang</h4>
                  <p className="text-xs text-nerv-subtle leading-relaxed">
                    Setelah getaran utama reda, matikan kompor dan gas, lalu keluar gedung menuju ruang terbuka yang jauh dari papan reklame dan tiang listrik.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-nerv-cyan mt-3 pt-2 border-t border-nerv-surfaceBorder/50">
                  ⚠️ Tetap tenang, hindari saling dorong saat evakuasi.
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {checklistItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#0D0F12] border border-nerv-surfaceBorder flex items-start gap-2.5"
                >
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <h5 className="text-xs font-bold text-white">{item.title}</h5>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Contact Banner */}
          <div className="mt-4 p-3 rounded-xl bg-[#0D0F12] border border-nerv-surfaceBorder flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-nerv-subtle">
              <PhoneCall className="w-4 h-4 text-nerv-warn" />
              <span>CALL CENTER DARURAT NASIONAL:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded bg-[#161B22] border border-nerv-surfaceBorder text-nerv-cyan font-bold">
                BASARNAS: 115
              </span>
              <span className="px-2.5 py-1 rounded bg-[#161B22] border border-nerv-surfaceBorder text-nerv-safe font-bold">
                BNPB: 117
              </span>
              <span className="px-2.5 py-1 rounded bg-[#161B22] border border-nerv-surfaceBorder text-nerv-warn font-bold">
                AMBULANS: 119
              </span>
              <span className="px-2.5 py-1 rounded bg-[#161B22] border border-nerv-surfaceBorder text-red-400 font-bold">
                POLISI: 110
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

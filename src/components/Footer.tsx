"use client";

import React, { useState } from "react";
import { ShieldCheck, Lock, Award, Heart, Cpu } from "lucide-react";
import { LegalModals } from "./LegalModals";

export const Footer: React.FC = () => {
  const [legalModal, setLegalModal] = useState<"privacy" | "license" | null>(null);

  return (
    <>
      <footer className="border-t border-nerv-surfaceBorder bg-[#0D0F12] py-8 text-nerv-subtle text-xs font-mono relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Subtitle */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5 text-center sm:text-left">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#161B22] border border-nerv-surfaceBorder text-nerv-cyan font-black text-lg">
              M
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-white font-black tracking-wider uppercase">
                  POWERED BY PT MUSANG
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-nerv-safe/10 text-nerv-safe border border-nerv-safe/30 font-semibold">
                  OFFICIAL
                </span>
              </div>
              <p className="text-[11px] text-nerv-subtle mt-0.5">
                Integrated IoT Seismological Network & Disaster Early Warning System (NERV-EEW)
              </p>
            </div>
          </div>

          {/* Quick Hardware Specs Info */}
          <div className="flex items-center gap-3 text-[11px] bg-[#161B22] px-3.5 py-1.5 rounded-lg border border-nerv-surfaceBorder text-gray-300">
            <Cpu className="w-3.5 h-3.5 text-nerv-cyan" />
            <span>ESP32 Wi-Fi IoT Core</span>
            <span className="text-nerv-surfaceBorder">|</span>
            <span>Next.js App Router (Vercel)</span>
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setLegalModal("privacy")}
              className="flex items-center gap-1.5 text-nerv-subtle hover:text-nerv-cyan transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </button>

            <span className="text-nerv-surfaceBorder">•</span>

            <button
              onClick={() => setLegalModal("license")}
              className="flex items-center gap-1.5 text-nerv-subtle hover:text-nerv-safe transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>License Agreement</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-4 border-t border-nerv-surfaceBorder/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
          <div>
            &copy; {new Date().getFullYear()} PT Musang. Seluruh Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-1">
            <span>緊急地震速報システム • Dirancang untuk Keselamatan Jiwa</span>
          </div>
        </div>
      </footer>

      {/* Render Legal Modals */}
      <LegalModals type={legalModal} onClose={() => setLegalModal(null)} />
    </>
  );
};

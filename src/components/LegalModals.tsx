"use client";

import React from "react";
import { X, ShieldCheck, FileText, Lock, Award } from "lucide-react";

interface LegalModalProps {
  type: "privacy" | "license" | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative max-w-2xl w-full bg-[#161B22] border border-nerv-surfaceBorder rounded-2xl shadow-2xl p-6 sm:p-8 text-white max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-nerv-surfaceBorder">
          <div className="flex items-center gap-2.5">
            {type === "privacy" ? (
              <Lock className="w-5 h-5 text-nerv-cyan" />
            ) : (
              <Award className="w-5 h-5 text-nerv-safe" />
            )}
            <h3 className="text-lg font-black tracking-tight text-white uppercase font-mono">
              {type === "privacy" ? "KEBIJAKAN PRIVASI (PRIVACY POLICY)" : "LISENSI & KETENTUAN PENGGUNAAN"}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#0D0F12] text-nerv-subtle hover:text-white border border-nerv-surfaceBorder"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto py-4 space-y-4 text-xs text-gray-300 leading-relaxed font-sans pr-1">
          {type === "privacy" ? (
            <>
              <div className="p-3 rounded-xl bg-[#0D0F12] border border-nerv-surfaceBorder">
                <span className="font-mono text-nerv-cyan font-bold block mb-1">
                  1. PENGUMPULAN DATA TELEMETRI SENSOR
                </span>
                <p>
                  Sistem Sistem Peringatan Dini Gempa (EEW) yang dikembangkan oleh <strong>PT Musang</strong>
                  hanya mengumpulkan data telemetri getaran fisik (akselerasi tanah, frekuensi getaran, dan status ambang batas)
                  yang dikirimkan dari mikrokontroler sensor ESP32. Sistem tidak mengumpulkan data pribadi atau informasi identifikasi personal pengguna.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0D0F12] border border-nerv-surfaceBorder">
                <span className="font-mono text-nerv-cyan font-bold block mb-1">
                  2. PENGGUNAAN FITUR WEB AUDIO API & NOTIFIKASI
                </span>
                <p>
                  Izin audio (Web Audio API) dan Web Notifications yang diminta oleh browser hanya digunakan
                  secara eksklusif untuk membunyikan sirine peringatan dini (&quot;titut-titut&quot;) dan menampilkan jendela evakuasi saat
                  nilai getaran sensor mencapai ambang bahaya (&ge; 300 m/s²). Browser Anda tidak merekam suara lingkungan maupun melacak aktivitas penjelajahan.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0D0F12] border border-nerv-surfaceBorder">
                <span className="font-mono text-nerv-cyan font-bold block mb-1">
                  3. KEAMANAN & PENYIMPANAN DATA
                </span>
                <p>
                  Seluruh komunikasi data antara modul ESP32, API server Vercel, dan klien peramban dilindungi
                  dengan enkripsi standar TLS/SSL. Log historis getaran disimpan sementara dalam memori server untuk
                  keperluan analisis grafik waktu-nyata dan secara berkala diperbarui.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0D0F12] border border-nerv-surfaceBorder">
                <span className="font-mono text-nerv-cyan font-bold block mb-1">
                  4. KONTAK PERLINDUNGAN DATA
                </span>
                <p>
                  Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini, silakan hubungi tim teknik PT Musang
                  melalui saluran resmi departemen mitigasi bencana seismik.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 rounded-xl bg-[#0D0F12] border border-nerv-surfaceBorder">
                <span className="font-mono text-nerv-safe font-bold block mb-1">
                  1. HAK CIPTA & KEPEMILIKAN INTELEKTUAL
                </span>
                <p>
                  Seluruh kode program, arsitektur firmware ESP32, dan desain antarmuka sistem peringatan dini
                  NERV Disaster Prevention Style ini dilindungi oleh hak cipta dan dikembangkan secara resmi oleh
                  <strong> PT Musang</strong>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0D0F12] border border-nerv-surfaceBorder">
                <span className="font-mono text-nerv-safe font-bold block mb-1">
                  2. LISENSI PENGGUNAAN PUBLIK & PENANGGULANGAN BENCANA
                </span>
                <p>
                  Sistem ini diperuntukkan bagi edukasi, mitigasi risiko bencana alam, dan penelitian pemantauan getaran seismik gedung/tanah.
                  Penggunaan komersial skala industri wajib mencantumkan atribusi resmi: <em>&quot;Powered by PT Musang&quot;</em>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0D0F12] border border-nerv-surfaceBorder">
                <span className="font-mono text-nerv-safe font-bold block mb-1">
                  3. BATASAN TANGGUNG JAWAB (DISCLAIMER)
                </span>
                <p>
                  Sistem peringatan dini ini dirancang sebagai instrumen pendukung peringatan awal keselamatan.
                  Meskipun dirancang dengan toleransi tinggi, pengguna tetap diwajibkan selalu merujuk pada arahan resmi
                  Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) serta Badan Nasional Penanggulangan Bencana (BNPB).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0D0F12] border border-nerv-surfaceBorder">
                <span className="font-mono text-nerv-safe font-bold block mb-1">
                  4. KETENTUAN PENGOPERASIAN IOT ESP32
                </span>
                <p>
                  Pengguna bertanggung jawab penuh atas pemasangan fisik modul sensor, catu daya listrik stabil,
                  serta kalibrasi sensor mekanik pada substrat tanah atau kolom gedung yang dipantau.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-nerv-surfaceBorder flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-nerv-cyan hover:bg-teal-400 text-black font-bold font-mono text-xs transition-colors"
          >
            Tutup Dokumen
          </button>
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Bell, BellOff, Radio, ShieldAlert } from "lucide-react";
import { audioSystem } from "@/lib/audio-synthesizer";
import { requestNotificationPermission, getNotificationPermission } from "@/lib/notification-service";

interface HeaderProps {
  isAudioActive: boolean;
  setIsAudioActive: (active: boolean) => void;
  status: "AMAN" | "WASPADA" | "BAHAYA";
  onOpenActionPlan?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAudioActive,
  setIsAudioActive,
  status,
  onOpenActionPlan,
}) => {
  const [timeStr, setTimeStr] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");
  const [timezone, setTimezone] = useState<string>("WIB");
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    setNotifPermission(getNotificationPermission());

    const updateClock = () => {
      const now = new Date();
      let tzOffset = 7; // default WIB (UTC+7)
      if (timezone === "WITA") tzOffset = 8;
      if (timezone === "WIT") tzOffset = 9;
      if (timezone === "JST") tzOffset = 9;

      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      const targetTime = new Date(utcTime + 3600000 * tzOffset);

      const hours = String(targetTime.getHours()).padStart(2, "0");
      const minutes = String(targetTime.getMinutes()).padStart(2, "0");
      const seconds = String(targetTime.getSeconds()).padStart(2, "0");
      setTimeStr(`${hours}:${minutes}:${seconds}`);

      const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      setDateStr(`${days[targetTime.getDay()]}, ${targetTime.getDate()} ${months[targetTime.getMonth()]} ${targetTime.getFullYear()}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  const toggleAudio = () => {
    if (!isAudioActive) {
      audioSystem.init();
      audioSystem.playTestSound();
      setIsAudioActive(true);
    } else {
      audioSystem.stopEmergencySiren();
      setIsAudioActive(false);
    }
  };

  const handleRequestNotif = async () => {
    const res = await requestNotificationPermission();
    setNotifPermission(res);
  };

  return (
    <header className="border-b border-nerv-surfaceBorder bg-[#0D0F12]/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Warning Strip for Japanese EEW Style */}
      <div
        className={`h-1.5 w-full transition-colors duration-500 ${
          status === "BAHAYA"
            ? "bg-nerv-danger animate-pulse"
            : status === "WASPADA"
            ? "bg-nerv-warn"
            : "bg-nerv-safe"
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Branding & Japanese Sub-label */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            {/* PT Musang Custom Logo */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#1C2331] to-[#0D0F12] border border-nerv-surfaceBorder shadow-inner group">
              <span className="text-xl font-black text-nerv-cyan tracking-tighter">M</span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nerv-safe opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-nerv-safe"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-wider text-white uppercase">
                  PT MUSANG SEISMIC
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-nerv-surface text-nerv-cyan border border-nerv-surfaceBorder font-semibold">
                  NERV-SYSTEM
                </span>
              </div>
              <div className="text-[11px] font-mono text-nerv-subtle flex items-center gap-1.5">
                <span className="text-nerv-safe font-medium">緊急地震速報</span>
                <span>•</span>
                <span>Earthquake Early Warning v2.5</span>
              </div>
            </div>
          </div>

          {/* Quick Action Plan Trigger for Mobile */}
          {onOpenActionPlan && (
            <button
              onClick={onOpenActionPlan}
              className="md:hidden flex items-center gap-1 text-xs px-2.5 py-1.5 rounded bg-nerv-surface border border-nerv-surfaceBorder text-nerv-warn hover:bg-nerv-surfaceHover"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Panduan</span>
            </button>
          )}
        </div>

        {/* Real-time Clock & Timezone Selector */}
        <div className="flex items-center gap-3 font-mono bg-nerv-surface/80 px-3.5 py-1.5 rounded-lg border border-nerv-surfaceBorder shadow-inner">
          <div className="text-right">
            <div className="text-base font-bold text-white tracking-widest leading-none">
              {timeStr || "00:00:00"}
              <span className="text-xs text-nerv-cyan ml-1">{timezone}</span>
            </div>
            <div className="text-[10px] text-nerv-subtle mt-0.5">
              {dateStr || "Memuat waktu..."}
            </div>
          </div>

          <div className="flex border-l border-nerv-surfaceBorder pl-2 gap-1 text-[11px]">
            {(["WIB", "WITA", "WIT", "JST"] as const).map((tz) => (
              <button
                key={tz}
                onClick={() => setTimezone(tz)}
                className={`px-1.5 py-0.5 rounded transition-all font-semibold ${
                  timezone === tz
                    ? "bg-nerv-cyan/20 text-nerv-cyan border border-nerv-cyan/40"
                    : "text-nerv-subtle hover:text-white"
                }`}
              >
                {tz}
              </button>
            ))}
          </div>
        </div>

        {/* Permission Badges: Audio & Notifications */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Audio State Button */}
          <button
            onClick={toggleAudio}
            title={isAudioActive ? "Suara Alarm Aktif (Klik untuk Matikan/Mute)" : "Suara Alarm Belum Aktif (Klik untuk Mengaktifkan)"}
            className={`flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
              isAudioActive
                ? "bg-nerv-safe/10 text-nerv-safe border-nerv-safe/40 hover:bg-nerv-safe/20"
                : "bg-nerv-surface text-nerv-subtle border-nerv-surfaceBorder hover:text-white hover:border-nerv-subtle"
            }`}
          >
            {isAudioActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-nerv-safe animate-pulse" />
                <span>🔊 Alarm: Aktif</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-nerv-warn" />
                <span>🔇 Alarm: Muted</span>
              </>
            )}
          </button>

          {/* Browser Notification State Button */}
          <button
            onClick={handleRequestNotif}
            title={notifPermission === "granted" ? "Notifikasi Browser Diizinkan" : "Klik untuk Izinkan Notifikasi Gempa"}
            className={`flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
              notifPermission === "granted"
                ? "bg-nerv-cyan/10 text-nerv-cyan border-nerv-cyan/40 hover:bg-nerv-cyan/20"
                : "bg-nerv-surface text-nerv-warn border-nerv-surfaceBorder hover:text-white"
            }`}
          >
            {notifPermission === "granted" ? (
              <>
                <Bell className="w-3.5 h-3.5 text-nerv-cyan" />
                <span>🔔 Notif: Diizinkan</span>
              </>
            ) : (
              <>
                <BellOff className="w-3.5 h-3.5 text-nerv-warn animate-bounce" />
                <span>⚠️ Izinkan Notif</span>
              </>
            )}
          </button>

          {/* Live Node Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1.5 rounded-lg bg-nerv-surface border border-nerv-surfaceBorder text-nerv-subtle">
            <Radio className="w-3 h-3 text-nerv-safe animate-pulse" />
            <span>ESP32 LINK</span>
          </div>
        </div>
      </div>
    </header>
  );
};

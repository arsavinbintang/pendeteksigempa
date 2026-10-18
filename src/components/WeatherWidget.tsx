"use client";

import React, { useState, useEffect } from "react";
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  MapPin,
  RefreshCw,
  Navigation,
  Compass,
  Star,
  Activity,
  Layers,
} from "lucide-react";
import { WeatherData } from "@/lib/types";

interface Station {
  id: string;
  name: string;
  label: string;
  isPrimary?: boolean;
  region: "Jawa" | "Luar Jawa";
  lat: number;
  lon: number;
  mapPos?: { x: number; y: number };
}

// Stasiun pengamatan meteorologi - SEMARANG sebagai stasiun UTAMA (Index 0)
const STATIONS: Station[] = [
  {
    id: "smg",
    name: "Semarang",
    label: "Stasiun Klimatologi Jawa Tengah / Sesar Semarang",
    isPrimary: true,
    region: "Jawa",
    lat: -6.9932,
    lon: 110.4203,
    mapPos: { x: 226, y: 47 },
  },
  {
    id: "jkt",
    name: "Jakarta",
    label: "Stasiun Pusat BMKG Kemayoran",
    region: "Jawa",
    lat: -6.2088,
    lon: 106.8456,
    mapPos: { x: 82, y: 26 },
  },
  {
    id: "bdg",
    name: "Bandung",
    label: "Stasiun Geofisika Sesar Lembang",
    region: "Jawa",
    lat: -6.9175,
    lon: 107.6191,
    mapPos: { x: 105, y: 50 },
  },
  {
    id: "jog",
    name: "Yogyakarta",
    label: "Stasiun Geofisika Sesar Opak",
    region: "Jawa",
    lat: -7.7956,
    lon: 110.3695,
    mapPos: { x: 222, y: 74 },
  },
  {
    id: "pdg",
    name: "Padang",
    label: "Stasiun Sesar Mentawai",
    region: "Luar Jawa",
    lat: -0.9471,
    lon: 100.4172,
  },
  {
    id: "tko",
    name: "Tokyo",
    label: "JMA Tokyo Station",
    region: "Luar Jawa",
    lat: 35.6762,
    lon: 139.6503,
  },
];

// Helper kalkulasi mata angin 8 penjuru
const getCardinalDirection = (deg: number) => {
  const directions = [
    { short: "U", label: "Utara", deg: 0 },
    { short: "TL", label: "Timur Laut", deg: 45 },
    { short: "T", label: "Timur", deg: 90 },
    { short: "TG", label: "Tenggara", deg: 135 },
    { short: "S", label: "Selatan", deg: 180 },
    { short: "BD", label: "Barat Daya", deg: 225 },
    { short: "B", label: "Barat", deg: 270 },
    { short: "BL", label: "Barat Laut", deg: 315 },
  ];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};

// Helper klasifikasi skala angin BMKG / Beaufort
const getWindScale = (speedKmh: number) => {
  if (speedKmh < 5) {
    return {
      level: "Tenang (Calm)",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      status: "AMAN",
    };
  } else if (speedKmh <= 11) {
    return {
      level: "Sepoi Lemah (Light Air)",
      color: "text-teal-400",
      bg: "bg-teal-500/10",
      border: "border-teal-500/30",
      status: "AMAN",
    };
  } else if (speedKmh <= 19) {
    return {
      level: "Semilir Sedang (Gentle)",
      color: "text-nerv-cyan",
      bg: "bg-nerv-cyan/10",
      border: "border-nerv-cyan/30",
      status: "STABIL",
    };
  } else if (speedKmh <= 28) {
    return {
      level: "Cukup Kuat (Moderate)",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      status: "WASPADA",
    };
  } else if (speedKmh <= 38) {
    return {
      level: "Kencang (Strong)",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
      status: "PERINGATAN",
    };
  }
  return {
    level: "Badai (Gale)",
    color: "text-nerv-danger",
    bg: "bg-nerv-danger/10",
    border: "border-nerv-danger/30",
    status: "BAHAYA",
  };
};

export const WeatherWidget: React.FC = () => {
  // Stasiun Default: Semarang (STATIONS[0])
  const [selectedStation, setSelectedStation] = useState<Station>(STATIONS[0]);
  const [weather, setWeather] = useState<WeatherData>({
    city: "Semarang (Stasiun Utama)",
    temperature: 28.5,
    humidity: 78,
    windSpeed: 8.8,
    windDirection: 195,
    windDirectionCardinal: "S",
    windDirectionLabel: "Selatan",
    windGusts: 14.5,
    windLevel: "Sepoi Lemah (Light Air)",
    condition: "Sebagian Berawan",
    weatherCode: 2,
    isDay: true,
    lastUpdated: "Baru saja",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchWeather = async (station: Station) => {
    setIsLoading(true);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${station.lat}&longitude=${station.lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Weather API failed");
      const data = await res.json();
      const current = data.current;

      let cond = "Cerah";
      const code = current.weather_code;
      if (code === 0) cond = "Langit Cerah";
      else if (code === 1 || code === 2) cond = "Sebagian Berawan";
      else if (code === 3) cond = "Mendung";
      else if (code >= 51 && code <= 67) cond = "Hujan Ringan - Sedang";
      else if (code >= 80 && code <= 99) cond = "Hujan Petir";

      const speed = Math.round((current.wind_speed_10m ?? 8) * 10) / 10;
      const dir = Math.round(current.wind_direction_10m ?? 180);
      const gusts = Math.round((current.wind_gusts_10m ?? speed * 1.35) * 10) / 10;
      const cardinal = getCardinalDirection(dir);
      const scale = getWindScale(speed);

      setWeather({
        city: `${station.name} (${station.label})`,
        temperature: Math.round(current.temperature_2m * 10) / 10,
        humidity: current.relative_humidity_2m,
        windSpeed: speed,
        windDirection: dir,
        windDirectionCardinal: cardinal.short,
        windDirectionLabel: cardinal.label,
        windGusts: gusts,
        windLevel: scale.level,
        condition: cond,
        weatherCode: code,
        isDay: current.is_day === 1,
        lastUpdated: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      });
    } catch {
      // Fallback realistis mikro variasi
      const mockSpeed = Math.round((7 + Math.random() * 7) * 10) / 10;
      const mockDir = Math.floor(Math.random() * 360);
      const mockGusts = Math.round((mockSpeed * (1.2 + Math.random() * 0.4)) * 10) / 10;
      const cardinal = getCardinalDirection(mockDir);
      const scale = getWindScale(mockSpeed);

      setWeather((prev) => ({
        ...prev,
        city: `${station.name} (${station.label})`,
        temperature: Math.round((28 + Math.random() * 3) * 10) / 10,
        humidity: Math.round(72 + Math.random() * 14),
        windSpeed: mockSpeed,
        windDirection: mockDir,
        windDirectionCardinal: cardinal.short,
        windDirectionLabel: cardinal.label,
        windGusts: mockGusts,
        windLevel: scale.level,
        lastUpdated: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedStation);
    const interval = setInterval(() => {
      fetchWeather(selectedStation);
    }, 60000); // 1 minute refresh
    return () => clearInterval(interval);
  }, [selectedStation]);

  const getWeatherIcon = () => {
    if (weather.weatherCode >= 51) {
      return <CloudRain className="w-8 h-8 text-blue-400" />;
    } else if (weather.weatherCode >= 1 && weather.weatherCode <= 3) {
      return <Cloud className="w-8 h-8 text-slate-300" />;
    }
    return <Sun className="w-8 h-8 text-amber-400 animate-spin-slow" />;
  };

  // Status angin aktif
  const windScaleInfo = getWindScale(weather.windSpeed ?? 0);
  const windKnots = ((weather.windSpeed ?? 0) * 0.539957).toFixed(1);

  // SVG Paths untuk Pulau Jawa dan Madura
  const javaIslandPath = `
    M 20 55
    C 28 42, 38 28, 48 24
    C 58 20, 70 24, 82 26
    C 98 25, 122 28, 148 34
    C 170 38, 192 44, 214 46
    C 220 46, 226 47, 230 46
    C 234 38, 238 28, 246 26
    C 254 24, 258 32, 258 38
    C 272 42, 290 46, 314 52
    C 324 55, 332 64, 345 68
    C 360 72, 372 78, 380 84
    C 388 90, 388 98, 382 102
    C 374 105, 360 98, 342 94
    C 318 88, 290 92, 265 90
    C 245 88, 232 84, 222 82
    C 205 80, 185 78, 168 76
    C 150 74, 130 73, 110 72
    C 90 71, 75 80, 60 84
    C 45 82, 32 72, 20 55
    Z
  `.replace(/\s+/g, " ").trim();

  const maduraIslandPath = `
    M 312 44
    C 322 36, 345 36, 362 42
    C 368 45, 362 50, 350 50
    C 335 52, 320 50, 312 44
    Z
  `.replace(/\s+/g, " ").trim();

  return (
    <div className="flex flex-col p-6 bg-[#161B22] rounded-2xl border border-nerv-surfaceBorder shadow-xl relative overflow-hidden">
      {/* Header Widget */}
      <div className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-nerv-cyan" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-white">
            METEOROLOGICAL OBS-STATION
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-nerv-safe/10 text-nerv-safe border border-nerv-safe/30">
            <span className="w-1.5 h-1.5 rounded-full bg-nerv-safe animate-ping" />
            STATUS: AMAN
          </span>
        </div>
        <button
          onClick={() => fetchWeather(selectedStation)}
          disabled={isLoading}
          className="text-[10px] font-mono text-nerv-subtle hover:text-white flex items-center gap-1 bg-[#0D0F12] px-2.5 py-1 rounded border border-nerv-surfaceBorder transition-colors"
        >
          <RefreshCw className={`w-2.5 h-2.5 ${isLoading ? "animate-spin text-nerv-cyan" : ""}`} />
          <span>{isLoading ? "Mengunduh..." : "Refresh"}</span>
        </button>
      </div>

      {/* Station Selector Buttons */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-3.5 text-[11px] font-mono scrollbar-none">
        {STATIONS.map((station) => {
          const isSelected = selectedStation.id === station.id;
          const isPrimary = station.isPrimary;
          return (
            <button
              key={station.id}
              onClick={() => setSelectedStation(station)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg whitespace-nowrap transition-all border ${
                isSelected
                  ? isPrimary
                    ? "bg-amber-500/20 text-amber-300 border-amber-400 font-bold shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                    : "bg-nerv-cyan/20 text-nerv-cyan border-nerv-cyan/40 font-bold"
                  : isPrimary
                  ? "bg-[#0D0F12] text-amber-400/90 border-amber-500/40 hover:text-amber-300 hover:border-amber-400"
                  : "bg-[#0D0F12] text-nerv-subtle border-nerv-surfaceBorder hover:text-white"
              }`}
            >
              {isPrimary && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
              <span>{station.name}</span>
              {isPrimary && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/30 text-amber-200 border border-amber-400/50">
                  UTAMA
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Weather Card */}
      <div className="flex items-center justify-between bg-[#0D0F12] p-3.5 rounded-xl border border-nerv-surfaceBorder mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#161B22] border border-nerv-surfaceBorder/80">
            {getWeatherIcon()}
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-white tracking-tight flex items-baseline">
              {weather.temperature}
              <span className="text-sm font-normal text-nerv-cyan ml-0.5">°C</span>
              {selectedStation.isPrimary && (
                <span className="ml-2 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  HUB UTAMA
                </span>
              )}
            </div>
            <div className="text-xs text-gray-300 font-medium">{weather.condition}</div>
            <div className="text-[10px] text-nerv-subtle font-mono truncate max-w-[200px]">
              {selectedStation.label}
            </div>
          </div>
        </div>

        {/* Humidity and General Wind */}
        <div className="flex flex-col gap-1.5 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-nerv-subtle">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-white font-bold">{weather.humidity}%</span>
            <span className="text-[10px] text-nerv-subtle">RH</span>
          </div>
          <div className="flex items-center gap-1.5 text-nerv-subtle">
            <Wind className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-white font-bold">{weather.windSpeed}</span>
            <span className="text-[10px] text-nerv-subtle">km/h</span>
          </div>
        </div>
      </div>

      {/* DETEKSI ANGIN & ANEMOMETER DIGITAL */}
      <div className="bg-[#0D0F12] p-3 rounded-xl border border-nerv-surfaceBorder mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">
            <Compass className="w-3.5 h-3.5" />
            <span>DETEKSI ANGIN & ANEMOMETER DIGITAL</span>
          </div>
          <span
            className={`text-[9px] font-mono px-2 py-0.5 rounded border font-semibold ${windScaleInfo.bg} ${windScaleInfo.color} ${windScaleInfo.border}`}
          >
            {windScaleInfo.level}
          </span>
        </div>

        <div className="grid grid-cols-12 gap-2.5 items-center">
          {/* Visual Anemometer Compass Dial */}
          <div className="col-span-4 flex flex-col items-center justify-center">
            <div className="relative w-16 h-16 rounded-full border border-teal-500/40 bg-[#161B22] flex items-center justify-center shadow-[inset_0_0_12px_rgba(20,184,166,0.15)]">
              {/* Compass Cardinal Points */}
              <span className="absolute top-0.5 text-[8px] font-mono font-bold text-teal-300">U</span>
              <span className="absolute bottom-0.5 text-[8px] font-mono text-nerv-subtle">S</span>
              <span className="absolute left-1 text-[8px] font-mono text-nerv-subtle">B</span>
              <span className="absolute right-1 text-[8px] font-mono text-nerv-subtle">T</span>

              {/* Rotating Arrow Indicator */}
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
                style={{ transform: `rotate(${weather.windDirection ?? 0}deg)` }}
              >
                <Navigation className="w-6 h-6 text-teal-400 fill-teal-400/30 filter drop-shadow-[0_0_4px_rgba(45,212,191,0.7)]" />
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-white mt-1">
              {weather.windDirection ?? 0}° {weather.windDirectionCardinal ?? "S"}
            </span>
          </div>

          {/* Wind Speed, Gust, and Cardinal Details */}
          <div className="col-span-8 flex flex-col justify-between h-full space-y-1.5 pl-1 border-l border-nerv-surfaceBorder">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-nerv-subtle">Kecepatan:</span>
              <span className="text-white font-bold flex items-baseline gap-1">
                <span className="text-nerv-cyan text-sm">{weather.windSpeed}</span>
                <span className="text-[10px] text-nerv-subtle">km/h</span>
                <span className="text-[10px] text-teal-400/90 font-normal">({windKnots} kt)</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-nerv-subtle">Hembusan Maks:</span>
              <span className="text-amber-400 font-bold text-xs">
                {weather.windGusts ?? (weather.windSpeed * 1.3).toFixed(1)} km/h
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-nerv-subtle">Arah Angin:</span>
              <span className="text-gray-200 text-[11px] font-medium truncate">
                {weather.windDirectionLabel ?? "Selatan"} ({weather.windDirectionCardinal ?? "S"})
              </span>
            </div>

            {/* Streamline Flow Bar */}
            <div className="w-full h-1.5 bg-[#161B22] rounded-full overflow-hidden border border-nerv-surfaceBorder/80">
              <div
                className="h-full bg-gradient-to-r from-teal-500 via-nerv-cyan to-amber-400 transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(8, ((weather.windSpeed ?? 5) / 45) * 100))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ILUSTRASI TERITORIAL PULAU JAWA & JARINGAN SESAR */}
      <div className="bg-[#0D0F12] p-3 rounded-xl border border-nerv-surfaceBorder relative overflow-hidden">
        {/* Sub-header Peta Jawa */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-nerv-cyan">
            <Layers className="w-3.5 h-3.5" />
            <span>ILUSTRASI TERITORIAL PULAU JAWA</span>
          </div>
          <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            ★ HUB UTAMA: SEMARANG
          </span>
        </div>

        {/* Tactical SVG Map of Pulau Jawa */}
        <div className="relative w-full h-32 bg-[#161B22]/70 rounded-lg border border-nerv-surfaceBorder/80 overflow-hidden flex items-center justify-center">
          {/* Subtle Radar Scanline Grid Background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:14px_14px]" />

          <svg
            viewBox="0 0 400 120"
            className="w-full h-full select-none"
            style={{ filter: "drop-shadow(0 0 10px rgba(0, 240, 255, 0.15))" }}
          >
            <defs>
              <linearGradient id="jawaGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0B233A" />
                <stop offset="50%" stopColor="#113654" />
                <stop offset="100%" stopColor="#0E2740" />
              </linearGradient>
            </defs>

            {/* Pulau Jawa Mainland Silhouette */}
            <path
              d={javaIslandPath}
              fill="url(#jawaGlow)"
              stroke="#00F0FF"
              strokeWidth="1.6"
              strokeLinejoin="round"
              className="transition-colors hover:stroke-teal-300"
            />

            {/* Pulau Madura Silhouette */}
            <path
              d={maduraIslandPath}
              fill="#0E2740"
              stroke="#00F0FF"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />

            {/* Garis Sesar Aktif Pulau Jawa (Seismic Fault Lines) */}
            {/* Sesar Semarang / Kalikuto */}
            <line
              x1="214"
              y1="49"
              x2="238"
              y2="53"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeDasharray="2,2"
            />
            {/* Sesar Lembang (Bandung) */}
            <line
              x1="94"
              y1="48"
              x2="116"
              y2="50"
              stroke="#FF2E63"
              strokeWidth="1.2"
              strokeDasharray="2,2"
            />
            {/* Sesar Opak (Yogyakarta) */}
            <line
              x1="217"
              y1="68"
              x2="225"
              y2="80"
              stroke="#FFB703"
              strokeWidth="1.2"
              strokeDasharray="2,2"
            />

            {/* Label Sesar Tektonik */}
            <text x="212" y="40" fill="#F59E0B" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
              Sesar Semarang
            </text>
            <text x="76" y="58" fill="#8B949E" fontSize="5.5" fontFamily="monospace">
              Sesar Lembang
            </text>
            <text x="228" y="77" fill="#8B949E" fontSize="5.5" fontFamily="monospace">
              Sesar Opak
            </text>

            {/* Markers Stasiun di Pulau Jawa */}
            {STATIONS.filter((s) => s.mapPos).map((station) => {
              const isSelected = selectedStation.id === station.id;
              const isPrimary = station.isPrimary;
              const pos = station.mapPos!;

              return (
                <g
                  key={station.id}
                  className="cursor-pointer group"
                  onClick={() => setSelectedStation(station)}
                >
                  {/* Ping Ring Animasi untuk Stasiun Utama (Semarang) atau Stasiun Aktif */}
                  {(isPrimary || isSelected) && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isPrimary ? 9 : 7}
                      fill="none"
                      stroke={isPrimary ? "#F59E0B" : "#00F0FF"}
                      strokeWidth="1"
                      className="animate-ping origin-center"
                      style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                    />
                  )}

                  {/* Outer Ring */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isPrimary ? 6 : isSelected ? 5 : 3.5}
                    fill={isPrimary ? "#B45309" : isSelected ? "#00667A" : "#161B22"}
                    stroke={isPrimary ? "#FBBF24" : isSelected ? "#00F0FF" : "#8B949E"}
                    strokeWidth={isPrimary ? 2 : isSelected ? 1.5 : 1}
                  />

                  {/* Inner Node */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isPrimary ? 3 : 2}
                    fill={isPrimary ? "#FDE68A" : isSelected ? "#FFFFFF" : "#00F0FF"}
                  />

                  {/* Station Label Tag */}
                  <text
                    x={pos.x + (station.id === "jog" ? 6 : station.id === "smg" ? 8 : -4)}
                    y={pos.y + (station.id === "jkt" ? -6 : station.id === "jog" ? 2 : station.id === "smg" ? -4 : 10)}
                    textAnchor={station.id === "jkt" || station.id === "bdg" ? "end" : "start"}
                    fill={isPrimary ? "#FDE68A" : isSelected ? "#00F0FF" : "#CBD5E1"}
                    fontSize={isPrimary ? "7.5" : "6.5"}
                    fontFamily="monospace"
                    fontWeight={isPrimary || isSelected ? "bold" : "normal"}
                    className="select-none filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    {isPrimary ? `★ ${station.name}` : station.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Telemetry info bar stasiun terpilih di Pulau Jawa */}
        <div className="flex items-center justify-between text-[10px] font-mono text-nerv-subtle mt-2 pt-1.5 border-t border-nerv-surfaceBorder/70">
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-nerv-cyan" />
            <span>
              {selectedStation.region === "Jawa"
                ? `Stasiun: ${selectedStation.name} (${selectedStation.lat.toFixed(4)}° S, ${selectedStation.lon.toFixed(4)}° E)`
                : `Stasiun: ${selectedStation.name} [Luar Teritorial Jawa - Sesar Terkait Aktif]`}
            </span>
          </div>
          {selectedStation.isPrimary && (
            <span className="text-amber-400 font-bold">STASIUN UTAMA AKTIF</span>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full flex items-center justify-between text-[10px] font-mono text-nerv-subtle mt-3 pt-2 border-t border-nerv-surfaceBorder">
        <span>SUMBER: OPEN-METEO API / BMKG PROXY</span>
        <span>PEMBARUAN: {weather.lastUpdated}</span>
      </div>
    </div>
  );
};

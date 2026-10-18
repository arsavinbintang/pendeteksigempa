import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nerv: {
          bg: "#0D0F12",
          surface: "#161B22",
          surfaceHover: "#1F242C",
          surfaceBorder: "#272E3B",
          safe: "#00FF99",
          safeDark: "#059669",
          safeGlow: "rgba(0, 255, 153, 0.25)",
          warn: "#FFB703",
          warnDark: "#D97706",
          warnGlow: "rgba(255, 183, 3, 0.25)",
          danger: "#FF2E63",
          dangerDark: "#DC2626",
          dangerGlow: "rgba(255, 46, 99, 0.35)",
          subtle: "#8B949E",
          cyan: "#00F0FF",
        },
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      keyframes: {
        radarPulse: {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        emergencyFlash: {
          "0%, 100%": { backgroundColor: "rgba(255, 46, 99, 0.22)" },
          "50%": { backgroundColor: "rgba(255, 46, 99, 0.03)" },
        },
        dangerPulseText: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.02)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
      },
      animation: {
        "radar-pulse": "radarPulse 2.5s cubic-bezier(0, 0.2, 0.8, 1) infinite",
        "emergency-flash": "emergencyFlash 0.8s ease-in-out infinite",
        "danger-pulse-text": "dangerPulseText 1s ease-in-out infinite",
        scanline: "scanline 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

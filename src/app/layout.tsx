import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PT Musang - Sistem Peringatan Dini Gempa Bumi (NERV EEW)",
  description:
    "Sistem pemantauan gempa bumi real-time terintegrasi sensor ESP32 IoT dan Next.js dengan gaya sistem peringatan dini gempa Jepang / NERV App.",
  keywords: [
    "Gempa Bumi",
    "Earthquake Early Warning",
    "EEW",
    "NERV App",
    "ESP32 IoT",
    "PT Musang",
    "Seismik",
  ],
  authors: [{ name: "PT Musang" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0F12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-[#0D0F12] text-[#E6EDF3] antialiased selection:bg-nerv-cyan selection:text-black min-h-screen">
        {children}
      </body>
    </html>
  );
}

# 🌋 SISTEM PEMANTAUAN GEMPA BUMI REAL-TIME & EARLY WARNING SYSTEM (EEW)
### **Powered by PT Musang** | *Integrated IoT Seismological Network*
*Terinspirasi dari Japanese Earthquake Early Warning (EEW) / NERV Disaster Prevention App*

---

## 📖 Ringkasan Arsitektur Sistem

Sistem ini adalah solusi mitigasi bencana gempa bumi end-to-end yang mengintegrasikan mikrokontroler fisik **ESP32** dengan aplikasi web **Next.js (App Router)** yang dioptimalkan untuk deployment ke **Vercel**:

```text
  +------------------------+           HTTP POST (JSON)          +----------------------------+
  |  ESP32 SENSOR NODE     | ----------------------------------> |   NEXT.JS API ROUTE        |
  |  - SW-420 / Piezo Vib  |   { status, nilai_getaran: 345 }    |   (/api/sensor) on VERCEL  |
  |  - Tri-Color LED       |                                     +--------------+-------------+
  |  - Physical Buzzer     |                                                    |
  +------------------------+                                                    | State / Telemetri
                                                                                v
  +-------------------------------------------------------------------------------------------+
  |                     DASHBOARD WEB REAL-TIME (NERV / JMA DISASTER UI)                      |
  |  - Ultra Dark Mode (#0D0F12) & Japanese Hazard Aesthetic                                  |
  |  - Web Audio API Alarm Sirine "Titut-Titut" & Web Push Notification                       |
  |  - Visualisasi Geologi & Resonansi Bangunan (Soil & House Cross-Section)                  |
  |  - Radar Pulsing Seismik (Framer Motion) & Live Seismogram Stream (Recharts)              |
  |  - Indikator Potensi Gempa (%) & Widget Cuaca Real-Time Open-Meteo                        |
  |  - Panduan Evakuasi Darurat (Safety Action Plan) & Modal Evakuasi Full-Screen Merah       |
  +-------------------------------------------------------------------------------------------+
```

---

## 🎨 Ambience & Design System (Japanese NERV Style)

- **Theme Palette**:
  - Ultra Dark Mode Background: `#0D0F12`
  - Container Surfaces: `#161B22` & Border `#272E3B`
- **Aksen Status Seismik**:
  - 🟢 **AMAN (Safe)**: Green Emerald (`#00FF99` / `#059669`) — Normal, Shindo 0-1
  - 🟡 **WASPADA (Warning)**: Bright Amber (`#FFB703` / `#D97706`) — Getaran Sedang, Shindo 2-4
  - 🔴 **BAHAYA (Emergency)**: Neon Crimson (`#FF2E63` / `#DC2626`) — Guncangan Kuat, Shindo 5-7 dengan efek *flashing/pulsing screen*.
- **Tipografi & Ornamen**:
  - Sub-label estetika Jepang (*"緊急地震速報 - Earthquake Early Warning"*, *"震度階級 - Seismic Intensity Scale"*, *"地盤・建築物応答"*).
  - Garis bahaya bergaris (Hazard Stripes) amber & crimson.

---

## ✨ Fitur-Fitur Utama Web Application

1. **Otorisasi Browser Interaktif (AudioContext & Web Notifications)**:
   - Banner/Modal interaktif: *"Aktifkan Sistem Peringatan Dini & Alarm Suara"*.
   - Menginisialisasi `AudioContext` untuk mengatasi browser autoplay policy dan meminta izin `Notification.requestPermission()`.
   - Indikator status realtime pada header: `🔊 Suara Alarm: Aktif` dan `🔔 Notifikasi Browser: Diizinkan`.
2. **Sistem Alarm Suara ("Titut-Titut") & Notifikasi Darurat**:
   - Jika `nilai_getaran >= 300` atau status `BAHAYA`:
     1. Membunyikan sirine dua nada modulasi penetrasi frekuensi tinggi menggunakan Web Audio API.
     2. Memicu browser push notification: *"🚨 PERINGATAN GEMPA BUMI! Getaran Kuat Terdeteksi!"*.
     3. Memunculkan **Modal Evakuasi Darurat Full-Screen** yang berkedip merah terang.
3. **Panduan Evakuasi & Arahan Keselamatan (Safety Action Plan)**:
   - 🛡️ **Lindungi Kepala**: Berlindung di bawah meja yang kokoh (Drop, Cover, Hold On).
   - 🪟 **Jauhi Kaca**: Hindari jendela, cermin, dan benda gantung.
   - 🚫 **Jangan Gunakan Lift**: Wajib menggunakan tangga darurat.
   - 🏃 **Evakuasi**: Menuju ke tanah lapang setelah getaran utama reda.
   - Daftar isi Tas Siaga Bencana 72 Jam & Hotline Darurat Nasional (115, 117, 119, 110).
4. **Live Dashboard, Cuaca, Jam Digital & Potensi Gempa**:
   - **Real-Time Clock**: Jam digital presisi tinggi dengan selector zona waktu (WIB, WITA, WIT, JST).
   - **Widget Cuaca Open-Meteo**: Suhu (°C), kelembaban (%), dan kecepatan angin untuk stasiun seismik terpilih (Jakarta, Padang, Yogyakarta, Bandung, Tokyo).
   - **Indikator Potensi Gempa (%)**: Kalkulasi probabilitas dinamis berdasarkan akumulasi frekuensi dan amplitudo puncak getaran.
   - **Monitoring Seismogram Live**: Grafik area chart responsif (Recharts) dengan garis ambang batas Waspada (100) dan Bahaya (300).
5. **Panel Simulasi Perangkat Keras (ESP32 Emulator)**:
   - Tombol sekali klik untuk mensimulasikan kondisi **AMAN (24 m/s²)**, **WASPADA (185 m/s²)**, dan **BAHAYA (450 m/s²)** tanpa membutuhkan alat fisik.
   - Slider getaran manual (0 - 900 m/s²) dan mode Auto-Stream otomatis.
6. **Legal, Branding & Footer**:
   - Branding resmi: **Powered by PT Musang**.
   - Dokumen modal interaktif untuk **Privacy Policy** dan **License Agreement**.

---

## 🔌 Spesifikasi API Next.js Route (`/api/sensor`)

### 1. POST `/api/sensor`
Menerima payload telemetri getaran dari ESP32 atau emulator:

**Request Header:**
`Content-Type: application/json`

**Request Body:**
```json
{
  "status": "BAHAYA",
  "nilai_getaran": 345,
  "deviceId": "ESP32-NODE-01"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Data getaran seismik berhasil dicatat",
  "data": {
    "id": "read-1771345678-x9k2",
    "status": "BAHAYA",
    "nilai_getaran": 345,
    "timestamp": "2026-10-18T14:15:00.000Z",
    "formattedTime": "21.15.00",
    "deviceId": "ESP32-NODE-01",
    "shindoScale": "5弱"
  },
  "currentStatus": "BAHAYA",
  "shindo": "5弱",
  "riskPercentage": 74
}
```

### 2. GET `/api/sensor`
Mengambil data sensor terkini, riwayat seismogram, skala Shindo, nilai puncak 24 jam, dan kalkulasi risiko.

---

## 🤖 Firmware ESP32 (Arduino)

Firmware terletak di folder:
`firmware/esp32_earthquake_detector/esp32_earthquake_detector.ino`

### Pinout ESP32:
- **GPIO 34**: Input Analog Sensor Getaran (Piezo ADC)
- **GPIO 4**: Input Digital Sensor SW-420
- **GPIO 18**: LED Hijau (Status AMAN)
- **GPIO 19**: LED Kuning (Status WASPADA)
- **GPIO 21**: LED Merah (Status BAHAYA)
- **GPIO 22**: Buzzer Alarm Fisik (Titut-Titut)
- **GPIO 0**: Tombol Uji Coba Manual (BOOT Button)

Panduan lengkap instalasi dan wiring dapat dibaca pada [firmware/README.md](file:///home/icarus/code/gempa/firmware/README.md).

---

## 💻 Menjalankan Web Application Secara Lokal

1. Pasang dependensi:
   ```bash
   npm install
   ```
2. Jalankan server pengembangan Next.js:
   ```bash
   npm run dev
   ```
3. Buka peramban di `http://localhost:3000`.

---

## ☁️ Deployment ke Vercel

Proyek ini telah dikonfigurasi penuh dan siap di-deploy langsung ke Vercel:
1. Hubungkan repositori GitHub ini ke dashboard [Vercel](https://vercel.com).
2. Framework Preset akan otomatis terdeteksi sebagai **Next.js**.
3. Klik **Deploy**.
4. Setelah URL aktif didapatkan (misal: `https://pendeteksigempa.vercel.app`), masukkan URL tersebut ke variabel `API_ENDPOINT` pada firmware ESP32.

---

### Hak Cipta & Lisensi
&copy; 2026 **PT Musang**. Seluruh Hak Cipta Dilindungi Undang-Undang.
Sistem Peringatan Dini Bencana Seismik Berbasis IoT & Web NERV Style.

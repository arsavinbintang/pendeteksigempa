# 📡 PANDUAN FIRMWARE ARDUINO ESP32 - DETEKTOR GEMPA REAL-TIME
**Powered by PT Musang** | *Sistem Peringatan Dini Bencana Seismik*

---

## 📌 Skema Rangkaian Pin (Wiring Diagram)

| Komponen | Pin ESP32 | Keterangan |
| :--- | :--- | :--- |
| **Sensor Getaran Analog** (Piezo / Analog ADC) | `GPIO 34` | ADC1 Channel 6 (Input Analog 0-3.3V) |
| **Sensor Getaran Digital** (SW-420 Module) | `GPIO 4` | Input Pulsa Digital |
| **LED Hijau (Status AMAN)** | `GPIO 18` | Dihubungkan seri resistor 220Ω ke GND |
| **LED Kuning (Status WASPADA)** | `GPIO 19` | Dihubungkan seri resistor 220Ω ke GND |
| **LED Merah (Status BAHAYA)** | `GPIO 21` | Dihubungkan seri resistor 220Ω ke GND |
| **Buzzer Alarm Fisik** | `GPIO 22` | Positif Buzzer ke GPIO 22, Negatif ke GND |
| **Tombol Manual Test** | `GPIO 0` | Menggunakan tombol `BOOT` bawaan ESP32 |

---

## ⚙️ Skema Konfigurasi Hardware

```text
                       +-----------------------+
                       |      ESP32 DevKit     |
                       |                       |
   [Sensor SW-420] ----| GPIO 4  (Digital)     |
   [Piezo Vibration]---| GPIO 34 (Analog)      |
                       |                       |
   [LED Hijau 🟢] <----| GPIO 18 (220Ω)        |
   [LED Kuning 🟡] <---| GPIO 19 (220Ω)        |
   [LED Merah 🔴] <----| GPIO 21 (220Ω)        |
   [Buzzer 🔊]   <----| GPIO 22               |
   [Tombol Test] <----| GPIO 0  (BOOT)         |
                       +-----------------------+
```

---

## 🚀 Langkah Upload Firmware (Arduino IDE)

1. Pasang Board ESP32 pada Arduino IDE:
   - Masuk ke **File -> Preferences**.
   - Tambahkan URL Boards Manager: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Buka **Tools -> Board -> Boards Manager**, cari `esp32` lalu klik **Install**.
2. Buka berkas `firmware/esp32_earthquake_detector/esp32_earthquake_detector.ino`.
3. Sesuaikan konstanta berikut:
   ```cpp
   const char* WIFI_SSID     = "NAMA_WIFI_ANDA";
   const char* WIFI_PASSWORD = "PASSWORD_WIFI_ANDA";
   const char* API_ENDPOINT  = "https://pendeteksigempa.vercel.app/api/sensor";
   ```
4. Pilih **Tools -> Board -> ESP32 Dev Module**.
5. Pilih Port COM yang sesuai dan klik **Upload**.
6. Buka **Serial Monitor** pada baudrate `115200` untuk melihat status koneksi dan telemetri pengiriman data ke server.

---

## 🧪 Uji Coba API via cURL (Simulasi Tanpa Hardware)

Anda dapat langsung menguji endpoint Next.js dari terminal:

```bash
# Kirim status BAHAYA (Gempa Kuat)
curl -X POST http://localhost:3000/api/sensor \
  -H "Content-Type: application/json" \
  -d '{"status":"BAHAYA","nilai_getaran":450}'

# Kirim status WASPADA (Getaran Sedang)
curl -X POST http://localhost:3000/api/sensor \
  -H "Content-Type: application/json" \
  -d '{"status":"WASPADA","nilai_getaran":180}'

# Kirim status AMAN (Normal)
curl -X POST http://localhost:3000/api/sensor \
  -H "Content-Type: application/json" \
  -d '{"status":"AMAN","nilai_getaran":24}'
```

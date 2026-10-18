/*
 * =========================================================================================
 * SISTEM DETEKSI DINI GEMPA BUMI BERBASIS IOT - ESP32
 * Powered by PT Musang
 *
 * Deskripsi:
 * Firmware ESP32 untuk mendeteksi getaran seismik tanah/gedung secara real-time.
 * Mengaktifkan alarm fisik (Buzzer & Tri-Color LED) dan mengirimkan telemetri
 * data JSON ke Next.js Vercel Cloud Endpoint (/api/sensor).
 *
 * Payload API:
 * POST /api/sensor
 * Content-Type: application/json
 * {
 *   "status": "AMAN" | "WASPADA" | "BAHAYA",
 *   "nilai_getaran": 345
 * }
 * =========================================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

// ==========================================
// 1. KONFIGURASI JARINGAN & SERVER
// ==========================================
const char* WIFI_SSID     = "NAMA_WIFI_ANDA";       // Ganti dengan SSID WiFi Anda
const char* WIFI_PASSWORD = "PASSWORD_WIFI_ANDA";   // Ganti dengan Password WiFi Anda

// Endpoint API Next.js (Dapat menggunakan domain Vercel atau IP lokal)
// Contoh Vercel: "https://pendeteksigempa.vercel.app/api/sensor"
// Contoh Lokal : "http://192.168.1.100:3000/api/sensor"
const char* API_ENDPOINT  = "https://pendeteksigempa.vercel.app/api/sensor";

// ==========================================
// 2. PIN DEFINITION (WIRING ESP32)
// ==========================================
#define PIN_SENSOR_VIB_ANALOG   34  // Pin Analog Sensor Getaran (ADC1 GPIO 34)
#define PIN_SENSOR_VIB_DIGITAL  4   // Pin Digital Sensor Getaran (SW-420, GPIO 4)
#define PIN_LED_GREEN           18  // LED Hijau: Status AMAN
#define PIN_LED_YELLOW          19  // LED Kuning: Status WASPADA
#define PIN_LED_RED             21  // LED Merah: Status BAHAYA
#define PIN_BUZZER              22  // Active / Passive Buzzer (GPIO 22)
#define PIN_BTN_TEST            0   // Built-in BOOT Button untuk simulasi/test

// ==========================================
// 3. AMBANG BATAS GETARAN (THRESHOLDS)
// ==========================================
const int THRESHOLD_WASPADA = 100; // Mulai waspada (getaran terdeteksi)
const int THRESHOLD_BAHAYA  = 300; // Peringatan darurat gempa kuat

// Interval pengiriman data normal (misal tiap 3 detik jika stabil)
const unsigned long INTERVAL_KIRIM_NORMAL = 3000;
// Interval sampling getaran (ms)
const unsigned long WINDOW_SAMPLING_MS    = 150;

// Variabel status & timing
unsigned long lastKirimTime = 0;
int lastSentStatusVal = -1;
String currentStatusStr = "AMAN";

// ==========================================
// 4. SETUP SISTEM
// ==========================================
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println(F("\n======================================================="));
  Serial.println(F("  PT MUSANG - SISTEM DETEKSI GEMPA BUMI ESP32 v1.0"));
  Serial.println(F("  緊急地震速報 (Earthquake Early Warning Firmware)"));
  Serial.println(F("======================================================="));

  // Inisialisasi Pin LED & Buzzer
  pinMode(PIN_LED_GREEN, OUTPUT);
  pinMode(PIN_LED_YELLOW, OUTPUT);
  pinMode(PIN_LED_RED, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_SENSOR_VIB_DIGITAL, INPUT);
  pinMode(PIN_BTN_TEST, INPUT_PULLUP);

  // Set default LED AMAN
  setLedStatus("AMAN");
  beep(100, 2); // Indikator boot siap

  // Hubungkan ke WiFi
  connectWiFi();
}

// ==========================================
// 5. LOOP UTAMA
// ==========================================
void loop() {
  // Cek koneksi WiFi
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  // 1. Baca nilai getaran tertinggi dalam sampling window
  int nilaiGetaran = sampleVibration();

  // Cek jika tombol TEST (BOOT GPIO 0) ditekan -> picu simulasi getaran bahaya
  if (digitalRead(PIN_BTN_TEST) == LOW) {
    Serial.println(F("[MANUAL TEST] Tombol test ditekan! Mensimulasikan getaran gempa..."));
    nilaiGetaran = 450;
    delay(200);
  }

  // 2. Evaluasi Tingkat Bahaya
  String statusGempa = "AMAN";
  if (nilaiGetaran >= THRESHOLD_BAHAYA) {
    statusGempa = "BAHAYA";
  } else if (nilaiGetaran >= THRESHOLD_WASPADA) {
    statusGempa = "WASPADA";
  } else {
    statusGempa = "AMAN";
  }

  currentStatusStr = statusGempa;

  // 3. Kontrol Indikator Fisik (LED & Buzzer Alarm)
  setLedStatus(statusGempa);

  if (statusGempa == "BAHAYA") {
    // Bunyikan alarm darurat sirine fisik titut-titut frekuensi tinggi
    bunyikanAlarmDarurat();
  } else if (statusGempa == "WASPADA") {
    // Peringatan tit singkat
    bunyikanPeringatanWaspada();
  } else {
    digitalWrite(PIN_BUZZER, LOW);
  }

  // 4. Pengiriman Data ke Cloud API Next.js Vercel
  // Segera kirim JIKA status berubah MENJADI BAHAYA, atau sudah mencapai interval normal
  unsigned long now = millis();
  bool statusBerubah = (statusGempa != "AMAN" && lastSentStatusVal != nilaiGetaran);
  bool waktuKirimTiba = (now - lastKirimTime >= INTERVAL_KIRIM_NORMAL);

  if (statusGempa == "BAHAYA" || statusBerubah || waktuKirimTiba) {
    kirimDataKeCloud(statusGempa, nilaiGetaran);
    lastKirimTime = now;
    lastSentStatusVal = nilaiGetaran;
  }

  delay(20);
}

// ==========================================
// 6. FUNGSI PEMBACAAN SENSOR GETARAN
// ==========================================
int sampleVibration() {
  unsigned long startMillis = millis();
  int peakVal = 0;
  int digitalPulseCount = 0;

  // Membaca sinyal analog peak-to-peak & pulsa digital dalam sampling window
  while (millis() - startMillis < WINDOW_SAMPLING_MS) {
    int analogVal = analogRead(PIN_SENSOR_VIB_ANALOG);
    // Standarisasi nilai ADC 12-bit (0-4095) diskalakan ke rentang getaran 0-1000
    int scaled = map(analogVal, 0, 4095, 0, 1000);
    if (scaled > peakVal) {
      peakVal = scaled;
    }

    // Periksa juga pulsa digital SW-420 jika terpasang
    if (digitalRead(PIN_SENSOR_VIB_DIGITAL) == HIGH) {
      digitalPulseCount++;
    }
    delay(2);
  }

  // Jika pulsa digital tinggi, tambahkan bobot getaran
  if (digitalPulseCount > 10) {
    int pulseEquivalent = digitalPulseCount * 15;
    if (pulseEquivalent > peakVal) {
      peakVal = pulseEquivalent;
    }
  }

  return peakVal;
}

// ==========================================
// 7. KONTROL INDIKATOR LED
// ==========================================
void setLedStatus(String status) {
  if (status == "BAHAYA") {
    digitalWrite(PIN_LED_GREEN, LOW);
    digitalWrite(PIN_LED_YELLOW, LOW);
    digitalWrite(PIN_LED_RED, HIGH);
  } else if (status == "WASPADA") {
    digitalWrite(PIN_LED_GREEN, LOW);
    digitalWrite(PIN_LED_YELLOW, HIGH);
    digitalWrite(PIN_LED_RED, LOW);
  } else {
    // AMAN
    digitalWrite(PIN_LED_GREEN, HIGH);
    digitalWrite(PIN_LED_YELLOW, LOW);
    digitalWrite(PIN_LED_RED, LOW);
  }
}

// ==========================================
// 8. KONTROL ALARM SUARA FISIK (BUZZER)
// ==========================================
void bunyikanAlarmDarurat() {
  // Sirine "titut-titut" darurat fisik cepat
  for (int i = 0; i < 2; i++) {
    digitalWrite(PIN_BUZZER, HIGH);
    digitalWrite(PIN_LED_RED, HIGH);
    delay(100);
    digitalWrite(PIN_BUZZER, LOW);
    digitalWrite(PIN_LED_RED, LOW);
    delay(70);
  }
}

void bunyikanPeringatanWaspada() {
  // Nada klik waspada berkala
  static unsigned long lastWaspadaBeep = 0;
  if (millis() - lastWaspadaBeep > 1200) {
    digitalWrite(PIN_BUZZER, HIGH);
    delay(40);
    digitalWrite(PIN_BUZZER, LOW);
    lastWaspadaBeep = millis();
  }
}

void beep(int ms, int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(PIN_BUZZER, HIGH);
    delay(ms);
    digitalWrite(PIN_BUZZER, LOW);
    if (i < times - 1) delay(80);
  }
}

// ==========================================
// 9. KONEKSI KE JARINGAN WIFI
// ==========================================
void connectWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;

  Serial.print(F("[WiFi] Menghubungkan ke: "));
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 20) {
    delay(500);
    Serial.print(F("."));
    retries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println(F("\n[WiFi] Terhubung berhasil!"));
    Serial.print(F("[WiFi] IP Address: "));
    Serial.println(WiFi.localIP());
  } else {
    Serial.println(F("\n[WiFi] Gagal terhubung. Melanjutkan dalam mode offline..."));
  }
}

// ==========================================
// 10. HTTP POST TELEMETRI KE NEXT.JS API
// ==========================================
void kirimDataKeCloud(String status, int nilaiGetaran) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println(F("[HTTP] WiFi belum terhubung, pengiriman dibatalkan."));
    return;
  }

  HTTPClient http;
  WiFiClientSecure clientSecure;
  WiFiClient clientPlain;

  String endpoint = String(API_ENDPOINT);
  bool isHttps = endpoint.startsWith("https");

  if (isHttps) {
    // Lewatkan verifikasi SSL untuk koneksi IoT cepat
    clientSecure.setInsecure();
    http.begin(clientSecure, endpoint);
  } else {
    http.begin(clientPlain, endpoint);
  }

  http.addHeader("Content-Type", "application/json");
  http.setTimeout(4000);

  // Buat Payload JSON persis sesuai spesifikasi prompt:
  // { "status": "BAHAYA"|"WASPADA"|"AMAN", "nilai_getaran": 345 }
  String jsonPayload = "{\"status\":\"" + status + "\",\"nilai_getaran\":" + String(nilaiGetaran) + "}";

  Serial.print(F("[HTTP POST] Mengirim ke "));
  Serial.print(endpoint);
  Serial.print(F(" -> "));
  Serial.println(jsonPayload);

  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0) {
    Serial.print(F("[HTTP] Response code: "));
    Serial.println(httpResponseCode);
    String response = http.getString();
    Serial.print(F("[HTTP] Body: "));
    Serial.println(response);
  } else {
    Serial.print(F("[HTTP] Error pengiriman: "));
    Serial.println(http.errorToString(httpResponseCode).c_str());
  }

  http.end();
}

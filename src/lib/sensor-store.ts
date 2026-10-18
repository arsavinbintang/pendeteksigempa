import { SensorPayload, SensorReading, SensorStatus, SensorStoreState, ShindoInfo } from "./types";

export function getShindoInfo(vibration: number): ShindoInfo {
  if (vibration < 50) {
    return {
      scale: "0",
      kanji: "震度０",
      color: "#00FF99",
      description: "Tidak Terasa (Micro-tremor)",
      perceivedShaking: "Hanya terdeteksi oleh seismograf presisi.",
    };
  } else if (vibration < 100) {
    return {
      scale: "1",
      kanji: "震度１",
      color: "#00FF99",
      description: "Sangat Lemah",
      perceivedShaking: "Dirasakan oleh sebagian orang yang sedang diam di lantai atas.",
    };
  } else if (vibration < 180) {
    return {
      scale: "2",
      kanji: "震度２",
      color: "#FFB703",
      description: "Lemah (Waspada)",
      perceivedShaking: "Benda gantung bergoyang sedikit, jendela berderik.",
    };
  } else if (vibration < 250) {
    return {
      scale: "3",
      kanji: "震度３",
      color: "#FFB703",
      description: "Sedang (Waspada)",
      perceivedShaking: "Rumah bergetar nyata, piring bergemerincing di rak.",
    };
  } else if (vibration < 300) {
    return {
      scale: "4",
      kanji: "震度４",
      color: "#FFB703",
      description: "Cukup Kuat (Siaga)",
      perceivedShaking: "Kebanyakan orang terkejut, lampu gantung berayun kuat.",
    };
  } else if (vibration < 450) {
    return {
      scale: "5弱",
      kanji: "震度５弱",
      color: "#FF2E63",
      description: "Kuat (Bahaya)",
      perceivedShaking: "Sulit berjalan tanpa berpegangan, perabot rumah roboh.",
    };
  } else if (vibration < 600) {
    return {
      scale: "5強",
      kanji: "震度５強",
      color: "#FF2E63",
      description: "Sangat Kuat (Bahaya Ekstrem)",
      perceivedShaking: "Dinding retak, furnitur berat bergeser atau terjatuh.",
    };
  } else if (vibration < 750) {
    return {
      scale: "6弱",
      kanji: "震度６弱",
      color: "#FF2E63",
      description: "Merusak Tinggi",
      perceivedShaking: "Sulit tetap berdiri, kerusakan parah pada bangunan rentan.",
    };
  } else {
    return {
      scale: "7",
      kanji: "震度７",
      color: "#FF2E63",
      description: "Dahsyat / Katastropik",
      perceivedShaking: "Guncangan hebat tak terkendali, runtuh total struktur gedung lemah.",
    };
  }
}

export function determineStatus(vibration: number): SensorStatus {
  if (vibration >= 300) return "BAHAYA";
  if (vibration >= 100) return "WASPADA";
  return "AMAN";
}

// Initial mock history representing realistic baseline background noise
function generateInitialHistory(): SensorReading[] {
  const history: SensorReading[] = [];
  const now = Date.now();
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now - i * 3000);
    // Baseline vibration with tiny micro-tremors (12 - 35)
    const val = Math.floor(14 + Math.sin(i * 0.7) * 8 + Math.random() * 8);
    const status: SensorStatus = "AMAN";
    const shindo = getShindoInfo(val);
    history.push({
      id: `init-${i}`,
      status,
      nilai_getaran: val,
      timestamp: time.toISOString(),
      formattedTime: time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      deviceId: "ESP32-NODE-01",
      shindoScale: shindo.scale,
    });
  }
  return history;
}

// Global state singleton for server runtime
declare global {
  // eslint-disable-next-line no-var
  var __SEISMIC_SENSOR_STORE__: SensorStoreState | undefined;
}

function calculateRisk(history: SensorReading[], currentVal: number): number {
  if (currentVal >= 500) return Math.min(99, Math.round(85 + (currentVal - 500) * 0.03));
  if (currentVal >= 300) return Math.min(92, Math.round(70 + (currentVal - 300) * 0.08));
  if (currentVal >= 100) return Math.min(65, Math.round(35 + (currentVal - 100) * 0.15));

  // If currently safe, look at recent spikes in last 10 readings
  const recentSlice = history.slice(-10);
  const maxRecent = recentSlice.reduce((max, r) => Math.max(max, r.nilai_getaran), currentVal);
  if (maxRecent >= 300) return 55;
  if (maxRecent >= 100) return 30;

  // Normal ambient background risk
  const baselineFactor = (currentVal / 100) * 12;
  return Math.max(3, Math.min(18, Math.round( baselineFactor + (Math.random() * 2) )));
}

function initStore(): SensorStoreState {
  const initialHistory = generateInitialHistory();
  const last = initialHistory[initialHistory.length - 1];
  const shindo = getShindoInfo(last.nilai_getaran);

  return {
    current: {
      status: last.status,
      nilai_getaran: last.nilai_getaran,
      timestamp: last.timestamp,
      deviceId: "ESP32-NODE-01",
      shindoScale: shindo.scale,
      shindoLabel: shindo.description,
    },
    history: initialHistory,
    peak24h: Math.max(...initialHistory.map((h) => h.nilai_getaran)),
    riskPercentage: 6,
  };
}

const store: SensorStoreState = globalThis.__SEISMIC_SENSOR_STORE__ ?? initStore();
if (process.env.NODE_ENV !== "production") {
  globalThis.__SEISMIC_SENSOR_STORE__ = store;
}

export function getSensorState(): SensorStoreState {
  return store;
}

export function recordSensorReading(payload: SensorPayload): SensorReading {
  const rawVal = Number(payload.nilai_getaran);
  const vibration = isNaN(rawVal) ? 0 : Math.max(0, Math.round(rawVal));
  const status: SensorStatus = payload.status || determineStatus(vibration);
  const now = new Date();
  const shindo = getShindoInfo(vibration);

  const reading: SensorReading = {
    id: `read-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    status,
    nilai_getaran: vibration,
    timestamp: now.toISOString(),
    formattedTime: now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    deviceId: payload.deviceId || "ESP32-NODE-01",
    shindoScale: shindo.scale,
  };

  // Add to history and keep max 50 entries
  store.history.push(reading);
  if (store.history.length > 50) {
    store.history.shift();
  }

  // Update current
  store.current = {
    status: reading.status,
    nilai_getaran: reading.nilai_getaran,
    timestamp: reading.timestamp,
    deviceId: reading.deviceId || "ESP32-NODE-01",
    shindoScale: shindo.scale,
    shindoLabel: shindo.description,
  };

  // Update peak
  if (vibration > store.peak24h) {
    store.peak24h = vibration;
  }

  // Update risk
  store.riskPercentage = calculateRisk(store.history, vibration);

  return reading;
}

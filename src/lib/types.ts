export type SensorStatus = "AMAN" | "WASPADA" | "BAHAYA";

export interface SensorPayload {
  status: SensorStatus;
  nilai_getaran: number;
  deviceId?: string;
}

export interface SensorReading {
  id: string;
  status: SensorStatus;
  nilai_getaran: number;
  timestamp: string;
  formattedTime: string;
  deviceId?: string;
  shindoScale: string;
}

export interface SensorStoreState {
  current: {
    status: SensorStatus;
    nilai_getaran: number;
    timestamp: string;
    deviceId: string;
    shindoScale: string;
    shindoLabel: string;
  };
  history: SensorReading[];
  peak24h: number;
  riskPercentage: number;
}

export interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  weatherCode: number;
  isDay: boolean;
  lastUpdated: string;
}

export interface ShindoInfo {
  scale: string;
  kanji: string;
  color: string;
  description: string;
  perceivedShaking: string;
}

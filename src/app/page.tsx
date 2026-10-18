"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { StatusBanner } from "@/components/StatusBanner";
import { SeismicRadar } from "@/components/SeismicRadar";
import { SeismicGauge } from "@/components/SeismicGauge";
import { SoilHouseVisualizer } from "@/components/SoilHouseVisualizer";
import { SeismicHistoryChart } from "@/components/SeismicHistoryChart";
import { WeatherWidget } from "@/components/WeatherWidget";
import { EarthquakeRiskCard } from "@/components/EarthquakeRiskCard";
import { EvacuationGuide } from "@/components/EvacuationGuide";
import { SimulationPanel } from "@/components/SimulationPanel";
import { EmergencyModal } from "@/components/EmergencyModal";
import { PermissionModal } from "@/components/PermissionModal";
import { Footer } from "@/components/Footer";
import { audioSystem } from "@/lib/audio-synthesizer";
import { triggerEmergencyNotification } from "@/lib/notification-service";
import { SensorReading, SensorStatus, SensorStoreState } from "@/lib/types";

export default function DashboardPage() {
  const [storeState, setStoreState] = useState<SensorStoreState | null>(null);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [showPermissionModal, setShowPermissionModal] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [emergencyAcknowledged, setEmergencyAcknowledged] = useState<boolean>(false);

  // Ref to track last status to trigger sound transitions
  const lastStatusRef = useRef<SensorStatus>("AMAN");
  const lastVibrationRef = useRef<number>(0);

  // 1. Check initial authorization modal
  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = localStorage.getItem("pt_musang_eew_seen");
      if (!seen) {
        setShowPermissionModal(true);
      } else {
        // If already seen, audio context is ready on next interaction
        setIsAudioActive(true);
      }
    }
  }, []);

  // 2. Fetch sensor data function
  const fetchSensorData = React.useCallback(async () => {
    try {
      const res = await fetch("/api/sensor", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      if (json.success && json.data) {
        const state: SensorStoreState = json.data;
        setStoreState(state);

        const currentStatus = state.current.status;
        const currentVibration = state.current.nilai_getaran;

        // Trigger Emergency Response when BAHAYA is active
        if (currentStatus === "BAHAYA" || currentVibration >= 300) {
          if (!emergencyAcknowledged) {
            setShowEmergencyModal(true);
          }

          // Sound alarm if audio active
          if (isAudioActive && !audioSystem.getSirenStatus()) {
            audioSystem.startEmergencySiren();
          }

          // Trigger browser push notification on status transition
          if (lastStatusRef.current !== "BAHAYA") {
            triggerEmergencyNotification(currentVibration, state.current.shindoScale);
          }
        } else if (currentStatus === "WASPADA") {
          // Play warning chime on transition to WASPADA
          if (lastStatusRef.current !== "WASPADA" && isAudioActive) {
            audioSystem.playWarningBeep();
          }
          if (audioSystem.getSirenStatus()) {
            audioSystem.stopEmergencySiren();
          }
          setEmergencyAcknowledged(false);
          setShowEmergencyModal(false);
        } else {
          // AMAN
          if (audioSystem.getSirenStatus()) {
            audioSystem.stopEmergencySiren();
          }
          setEmergencyAcknowledged(false);
          setShowEmergencyModal(false);
        }

        lastStatusRef.current = currentStatus;
        lastVibrationRef.current = currentVibration;
      }
    } catch (err) {
      console.warn("Sensor fetch polling error:", err);
    }
  }, [emergencyAcknowledged, isAudioActive]);

  // 3. Setup real-time polling interval
  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 1200);
    return () => clearInterval(interval);
  }, [fetchSensorData]);

  const handleDismissEmergency = () => {
    audioSystem.stopEmergencySiren();
    setShowEmergencyModal(false);
    setEmergencyAcknowledged(true);
  };

  const handleActivatePermissions = () => {
    setIsAudioActive(true);
    setShowPermissionModal(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("pt_musang_eew_seen", "true");
    }
  };

  const currentStatus: SensorStatus = storeState?.current.status || "AMAN";
  const currentVibration: number = storeState?.current.nilai_getaran || 24;
  const currentShindo: string = storeState?.current.shindoScale || "0";
  const currentShindoLabel: string = storeState?.current.shindoLabel || "Normal";
  const peakValue: number = storeState?.peak24h || 24;
  const riskPercentage: number = storeState?.riskPercentage || 6;
  const history: SensorReading[] = storeState?.history || [];

  const isEmergency = currentStatus === "BAHAYA";

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-700 ${
        isEmergency ? "bg-[#140609]" : "bg-[#0D0F12]"
      }`}
    >
      {/* Flashing screen aura during Bahaya */}
      {isEmergency && (
        <div className="fixed inset-0 pointer-events-none z-30 animate-emergency-flash" />
      )}

      {/* Header */}
      <Header
        isAudioActive={isAudioActive}
        setIsAudioActive={setIsAudioActive}
        status={currentStatus}
        onOpenActionPlan={() => {
          const el = document.getElementById("safety-plan-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Japanese EEW Primary Status Banner */}
        <StatusBanner
          status={currentStatus}
          vibration={currentVibration}
          shindoScale={currentShindo}
          shindoLabel={currentShindoLabel}
        />

        {/* Primary Row: Seismic Radar (Center) & Geological Strata / House Response */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SeismicRadar status={currentStatus} vibration={currentVibration} />
          <SoilHouseVisualizer status={currentStatus} vibration={currentVibration} />
        </div>

        {/* Secondary Row: Gauge, Risk Index (%), Weather */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SeismicGauge
            vibration={currentVibration}
            status={currentStatus}
            peakValue={peakValue}
          />
          <EarthquakeRiskCard
            riskPercentage={riskPercentage}
            status={currentStatus}
            currentVibration={currentVibration}
            peakValue={peakValue}
          />
          <WeatherWidget />
        </div>

        {/* Live Seismogram Waveform Chart */}
        <SeismicHistoryChart
          history={history}
          status={currentStatus}
          currentVibration={currentVibration}
        />

        {/* Safety Action Plan & Evacuation Steps */}
        <div id="safety-plan-section">
          <EvacuationGuide />
        </div>

        {/* Interactive ESP32 Hardware Emulator / Test Deck */}
        <SimulationPanel
          onDataSent={fetchSensorData}
          status={currentStatus}
          currentVibration={currentVibration}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Full-Screen Emergency Evacuation Modal */}
      <EmergencyModal
        isOpen={showEmergencyModal}
        vibration={currentVibration}
        shindoScale={currentShindo}
        onDismiss={handleDismissEmergency}
      />

      {/* Initial Permission Modal */}
      <PermissionModal
        isOpen={showPermissionModal}
        onActivated={handleActivatePermissions}
        onDismiss={() => setShowPermissionModal(false)}
      />
    </div>
  );
}

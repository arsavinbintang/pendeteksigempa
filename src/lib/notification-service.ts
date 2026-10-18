// Web Browser Notification Service for Earthquake Early Warning

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    console.error("Error requesting notification permission:", e);
    return "denied";
  }
}

export function getNotificationPermission(): NotificationPermission {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  return Notification.permission;
}

export function triggerEmergencyNotification(vibration: number, shindo: string) {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }

  if (Notification.permission === "granted") {
    try {
      const options: NotificationOptions = {
        body: `🚨 PERINGATAN GEMPA BUMI! Getaran Kuat Terdeteksi (${vibration} m/s² - ${shindo})! Segera lakukan perlindungan kepala & evakuasi!`,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "earthquake-emergency-alert",
        requireInteraction: true,
        silent: false,
      };

      new Notification("🚨 緊急地震速報 - GEMPA BUMI TERDETEKSI!", options);
    } catch (e) {
      console.warn("Failed to create browser notification:", e);
    }
  }
}

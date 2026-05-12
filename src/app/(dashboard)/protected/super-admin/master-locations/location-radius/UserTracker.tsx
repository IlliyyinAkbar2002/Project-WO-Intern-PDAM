"use client";

import { useEffect, useState } from "react";

interface UserPosition {
  latitude: number;
  longitude: number;
}

interface Props {
  onUpdate: (pos: UserPosition) => void;
}

export default function UserTracker({ onUpdate }: Props) {
  const [watchId, setWatchId] = useState<number | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          onUpdate({ latitude, longitude });
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );
      setWatchId(id);

      return () => {
        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId);
        }
      };
    }
  }, []);

  return null; // tidak render UI, hanya kirim posisi
}

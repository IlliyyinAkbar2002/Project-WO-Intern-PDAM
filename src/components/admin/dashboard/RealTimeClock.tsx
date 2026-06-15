"use client";

import { useEffect, useState } from "react";

interface RealtimeClockProps {
  userName: string;
  departmentName: string;
}

export default function RealtimeClock({
  userName,
  departmentName,
}: RealtimeClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hour = time.getHours();

  const greeting =
    hour >= 4 && hour < 11
      ? "Selamat Pagi"
      : hour >= 11 && hour < 15
        ? "Selamat Siang"
        : hour >= 15 && hour < 18
          ? "Selamat Sore"
          : "Selamat Malam";

  const formattedTime = time.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = time.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        {/* LEFT */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">{greeting} 👋</h2>
          <p className="text-sm text-gray-500">
            {userName} • {departmentName}
          </p>
          <p className="text-sm text-gray-500 capitalize">{formattedDate}</p>
        </div>

        {/* RIGHT */}
        <div className="text-right">
          <h1 className="text-4xl font-bold tracking-wider text-gray-900">
            {formattedTime}
          </h1>
          <p className="mt-1 text-sm font-medium text-gray-500">WIB</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useRef } from "react";

type Employee = {
  name: string;
  percent: number;
  color: string;
};

const sampleData: Employee[] = [
  {
    name: "Budi",
    percent: 20,
    color: "#22C55E", // hijau
  },
  {
    name: "Siti",
    percent: 40,
    color: "#3B82F6", // biru
  },
  {
    name: "Andi",
    percent: 60,
    color: "#F59E0B", // kuning
  },
  {
    name: "Rina",
    percent: 80,
    color: "#EF4444", // merah
  },
  {
    name: "Joko",
    percent: 100,
    color: "#8B5CF6", // ungu
  },
];

export default function AdminDashboardProgress({
  data = sampleData,
}: {
  data?: Employee[];
}) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<any>(null);

  const getCssVar = (name: string, fallback = "#1447E6") => {
    try {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();

      return v || fallback;
    } catch {
      return fallback;
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const ApexCharts = (await import("apexcharts")).default;

        if (cancelled) return;

        const brandColor = getCssVar("--color-fg-brand", "#1447E6");

        const warningColor = getCssVar("--color-warning", "#F59E0B");

        const successColor = getCssVar("--color-success", "#10B981");

        const neutralSecondaryMediumColor = getCssVar(
          "--color-neutral-secondary-medium",
          "#E5E7EB",
        );

        const options = {
          series: [90, 85, 70],

          colors: [brandColor, warningColor, successColor],

          chart: {
            height: 260,
            width: "100%",
            type: "radialBar",
            sparkline: {
              enabled: true,
            },
          },

          plotOptions: {
            radialBar: {
              track: {
                background: neutralSecondaryMediumColor,
              },

              dataLabels: {
                show: false,
              },

              hollow: {
                margin: 0,
                size: "32%",
              },
            },
          },

          grid: {
            show: false,
            strokeDashArray: 4,
            padding: {
              left: 2,
              right: 2,
              top: -23,
              bottom: -20,
            },
          },

          labels: ["To do", "In progress", "Done"],

          legend: {
            show: true,
            position: "bottom",
            fontFamily: "Inter, sans-serif",
          },

          tooltip: {
            enabled: true,
            x: {
              show: false,
            },
          },

          yaxis: {
            show: false,
          },
        };

        if (chartRef.current) {
          chartInstance.current = new ApexCharts(
            chartRef.current,
            options as any,
          );

          chartInstance.current.render();
        }
      } catch (err) {
        console.error("Failed to load ApexCharts for radial chart", err);
      }
    }

    init();

    return () => {
      cancelled = true;

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="w-full bg-neutral-secondary-medium border border-light-medium p-4 rounded-base">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* LEFT SIDE */}
        <div>
          <h6 className="text-sm font-medium text-heading mb-3">
            Top 5 Pegawai — Kinerja Tercepat
          </h6>

          <div className="space-y-3">
            {data.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="w-2/5 text-sm text-body">{d.name}</div>

                <div className="w-3/5 ms-3">
                  {/* Background Bar */}
                  <div
                    className="w-full rounded-full h-4 overflow-hidden"
                    style={{
                      backgroundColor: getCssVar(
                        "--color-neutral-quaternary",
                        "#E5E7EB",
                      ),
                    }}
                  >
                    {/* Progress */}
                    <div
                      style={{
                        width: `${d.percent}%`,
                        height: "100%",
                        borderRadius: 9999,
                        backgroundColor: d.color,
                        transition: "width 0.5s ease",
                      }}
                      aria-valuenow={d.percent}
                    />
                  </div>

                  {/* Percentage */}
                  <div className="text-xs text-body text-right mt-1">
                    {d.percent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div>
          <div ref={chartRef} id="top5-progress-chart" />
        </div>
      </div>
    </div>
  );
}

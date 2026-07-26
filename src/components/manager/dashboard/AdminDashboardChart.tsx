"use client";

import React, { useEffect, useState } from "react";
import AdminDashboardCard from "./AdminDashboardCard";
import AdminDashboardProgress from "./AdminDashboardProgress";
import { getWorkorderKPI } from "@/services/workorderService";

type KPI = {
  todo: number;
  inProgress: number;
  done: number;
  total: number;
};

export default function AdminDashboardClient() {
  const [showMore, setShowMore] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [kpi, setKpi] = useState<KPI>({
    todo: 0,
    inProgress: 0,
    done: 0,
    total: 0,
  });
  const [completionRate, setCompletionRate] = useState(0);

  // =========================
  // FETCH KPI DATA
  // =========================
  useEffect(() => {
    const fetchKPI = async () => {
      try {
        const response = await getWorkorderKPI();
        const data = response?.data ?? {};
        setKpi({
          todo: data.workorderPending ?? 0,
          inProgress: data.workorderProses ?? 0,
          done: data.workorderSelesai ?? 0,
          total: data.workorderTotal ?? 0,
        });
        setCompletionRate(response?.completionRate ?? 0);
      } catch (error) {
        console.error("Failed to load KPI:", error);
      }
    };
    fetchKPI();
  }, []);

  return (
    <div className="w-full bg-neutral-primary-soft border border-default rounded-base shadow-xs p-4 md:p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-4 md:mb-6">
        <div className="flex items-center">
          <div className="flex justify-center items-center">
            <h5 className="text-xl font-semibold text-heading me-1">
              Work order progress
            </h5>

            <button
              aria-label="info"
              className="w-4 h-4 text-body hover:text-heading cursor-pointer ms-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.441 2.441 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <AdminDashboardCard
          title="To do"
          value={kpi.todo}
          description="Pending workorders"
        />

        <AdminDashboardCard
          title="In progress"
          value={kpi.inProgress}
          description="Currently being worked on"
        />

        <AdminDashboardCard
          title="Done"
          value={kpi.done}
          description="Completed tasks"
        />

        <AdminDashboardCard
          title="Total WO"
          value={kpi.total}
          description="Total work orders"
        />
      </div>

      {/* PROGRESS */}
      <div className="mb-4">
        <AdminDashboardProgress
          radialSeries={[kpi.todo, kpi.inProgress, kpi.done]}
        />
      </div>
    </div>
  );
}

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

      {/* SHOW MORE */}
      <div className="bg-neutral-secondary-medium border border-light-medium p-3 rounded-base">
        <button
          onClick={() => setShowMore(!showMore)}
          type="button"
          className="hover:underline text-sm text-body font-medium inline-flex items-center"
        >
          Show more details
          <svg
            className="w-4 h-4 ms-1"
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
              d="m19 9-7 7-7-7"
            />
          </svg>
        </button>

        {showMore && (
          <div className="border-light border-t pt-3 mt-3 space-y-2">
            <dl className="flex items-center justify-between">
              <dt className="text-body text-sm font-normal">
                Average task completion rate:
              </dt>
              <dd className="inline-flex items-center bg-success-soft border border-success-subtle text-fg-success-strong text-xs font-medium px-1.5 py-0.5 rounded">
                {completionRate}%
              </dd>
            </dl>

            <dl className="flex items-center justify-between">
              <dt className="text-body text-sm font-normal">
                Days until sprint ends:
              </dt>
              <dd className="inline-flex items-center bg-neutral-primary-medium border border-default-medium text-heading text-xs font-medium px-1.5 py-0.5 rounded">
                13 days
              </dd>
            </dl>

            <dl className="flex items-center justify-between">
              <dt className="text-body text-sm font-normal">Next meeting:</dt>
              <dd className="inline-flex items-center bg-neutral-primary-medium border border-default-medium text-heading text-xs font-medium px-1.5 py-0.5 rounded">
                Thursday
              </dd>
            </dl>
          </div>
        )}
      </div>

      {/* FOOTER DROPDOWN */}
      <div className="grid grid-cols-1 items-center border-light border-t justify-between">
        <div className="flex justify-between items-center pt-4 md:pt-6">
          <div>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-sm font-medium text-body hover:text-heading inline-flex items-center"
              type="button"
            >
              Last 7 days
              <svg
                className="w-4 h-4 ms-1.5"
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
                  d="m19 9-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="z-10 bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44">
                <ul className="p-2 text-sm text-body font-medium">
                  <li>
                    <a
                      href="#"
                      className="p-2 block hover:bg-neutral-tertiary-medium rounded"
                    >
                      Yesterday
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="p-2 block hover:bg-neutral-tertiary-medium rounded"
                    >
                      Today
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="p-2 block hover:bg-neutral-tertiary-medium rounded"
                    >
                      Last 7 days
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="p-2 block hover:bg-neutral-tertiary-medium rounded"
                    >
                      Last 30 days
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="p-2 block hover:bg-neutral-tertiary-medium rounded"
                    >
                      Last 90 days
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <a
            href="#"
            className="inline-flex items-center text-fg-brand border rounded-base text-sm px-3 py-2"
          >
            Progress report
          </a>
        </div>
      </div>
    </div>
  );
}

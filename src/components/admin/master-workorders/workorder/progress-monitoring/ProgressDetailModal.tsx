"use client";

import React from "react";
import type { MonitoringWorkorder } from "@/types/progressWorkorderTypes";

type Props = {
  open: boolean;
  workorder: MonitoringWorkorder | null;
  onClose: () => void;
};

export default function ProgressDetailModal({
  open,
  workorder,
  onClose,
}: Props) {
  if (!open) return null;

  const summary = workorder?.summary ?? {
    team_statistics: {
      total_members: 0,
      avg_progress: 0,
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* MODAL CONTAINER */}
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Detail Progress Workorder</h2>

          <button
            onClick={onClose}
            className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-5 space-y-4">
          {/* INFO WORKORDER */}
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Nama Workorder</p>
            <p className="text-base font-medium">
              {workorder?.nama_workorder ?? "-"}
            </p>
          </div>

          {/* PROGRESS BAR */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Progress</p>

            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{
                  width: `${workorder?.progress_percentage ?? 0}%`,
                }}
              />
            </div>

            <p className="text-sm mt-1 text-gray-600">
              {workorder?.progress_percentage ?? 0}%
            </p>
          </div>

          {/* TEAM STATISTICS */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-3 border rounded">
              <p className="text-sm text-gray-500">Total Member</p>
              <p className="text-lg font-semibold">
                {summary.team_statistics.total_members}
              </p>
            </div>

            <div className="p-3 border rounded">
              <p className="text-sm text-gray-500">Avg Progress</p>
              <p className="text-lg font-semibold">
                {summary.team_statistics.avg_progress}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

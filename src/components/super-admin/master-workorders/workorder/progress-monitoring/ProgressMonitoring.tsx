"use client";

import React, { useEffect, useMemo, useState } from "react";
import ProgressMemberList from "./ProgressMemberList";
import ProgressDetailModal from "./ProgressDetailModal";
import { ProgressWorkorderService } from "@/services/progressWorkorderService";
import type { MonitoringWorkorder } from "@/types/progressWorkorderTypes";

const ProgressMonitoring: React.FC = () => {
  const [data, setData] = useState<MonitoringWorkorder[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<MonitoringWorkorder | null>(null);
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await ProgressWorkorderService.getMonitoring();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const summary = useMemo(() => {
    const total = data.length;
    const selesai = data.filter((d) => d.status === "Selesai").length;
    const proses = data.filter((d) => d.status === "Proses").length;

    const avgProgress =
      total > 0
        ? Math.round(
            data.reduce((acc, curr) => acc + curr.progress_percentage, 0) /
              total,
          )
        : 0;

    return { total, selesai, proses, avgProgress };
  }, [data]);

  const handleDetail = (item: MonitoringWorkorder) => {
    setSelected(null);
    setTimeout(() => {
      setSelected(item);
      setOpen(true);
    }, 50);
  };

  return (
    <div className="w-full px-6 space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Monitoring Progress Workorder
        </h2>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-gray-50">
          <p className="text-sm text-gray-500">Total WO</p>
          <p className="text-xl font-semibold">{summary.total}</p>
        </div>

        <div className="p-4 rounded-lg bg-green-50">
          <p className="text-sm text-gray-500">Selesai</p>
          <p className="text-xl font-semibold text-green-600">
            {summary.selesai}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-blue-50">
          <p className="text-sm text-gray-500">Proses</p>
          <p className="text-xl font-semibold text-blue-600">
            {summary.proses}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-yellow-50">
          <p className="text-sm text-gray-500">Avg Progress</p>
          <p className="text-xl font-semibold text-yellow-600">
            {summary.avgProgress}%
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full">
        {loading ? (
          <div className="py-10 text-center text-gray-500">Loading...</div>
        ) : (
          <ProgressMemberList data={data} onClickDetail={handleDetail} />
        )}
      </div>

      {/* MODAL */}
      <ProgressDetailModal
        open={open}
        workorder={selected}
        onClose={() => {
          setOpen(false);
          setSelected(null);
        }}/>
    </div>
  );
};

export default ProgressMonitoring;

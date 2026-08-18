"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MainTable } from "@/components/shared/tables/MainTable";
import type { MonitoringWorkorder } from "@/types/progressWorkorderTypes";

type Props = {
  data: MonitoringWorkorder[];
  onClickDetail: (item: MonitoringWorkorder) => void;
};

export default function ProgressMonitoringTable({
  data,
  onClickDetail,
}: Props) {
  const columns = useMemo<ColumnDef<MonitoringWorkorder>[]>(
    () => [
      {
        header: "No",
        cell: ({ row }) => (
          <div className="text-center text-sm font-medium">{row.index + 1}</div>
        ),
      },
      {
        header: "Nama Workorder",
        accessorFn: (row) => row.nama_workorder,
        cell: ({ getValue }) => (
          <div className="text-center text-sm font-medium text-gray-700">
            {getValue() as string}
          </div>
        ),
      },
      {
        header: "Progress",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex flex-col items-center gap-1">
              <div className="w-44 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${item.progress_percentage}%` }}/>
              </div>
              <span className="text-sm text-gray-600 font-medium">
                {item.progress_percentage}%
              </span>
            </div>
          );
        },
      },
      // {
      //   header: "Aksi",
      //   cell: ({ row }) => {
      //     const item = row.original;
      //     return (
      //       <div className="flex justify-center">
      //         <button
      //           onClick={() => onClickDetail(item)}
      //           className="px-3 py-1.5 text-sm font-medium border rounded-md 
      //           bg-white hover:bg-gray-100 active:scale-95 transition
      //           flex items-center gap-1">
      //           Lihat Detail
      //         </button>
      //       </div>
      //     );
      //   },
      // },
    ],
    [onClickDetail],
  );

  return (
    <div className="w-full max-w-7xl mx-auto bg-white border rounded-xl shadow-sm">
      {/* TABLE */}
      <div className="p-5">
        <MainTable columns={columns} data={data} loading={false} />
      </div>
    </div>
  );
}

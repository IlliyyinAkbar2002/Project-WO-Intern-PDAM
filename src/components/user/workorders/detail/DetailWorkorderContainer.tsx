"use client";

import { Workorder } from "@/types/workorderTypes";
import WorkorderDetailCard from "./card/WorkorderDetailCard";
import WorkorderProgressList from "./card/WorkorderProgressList";
import { ProgressWorkorder } from "@/types/progressWorkorderTypes";
import ProgressCalendar from "@/components/shared/ProgressCalendar";
import WorkorderAlertCard from "./card/WorkorderAlertCard";

interface DetailWorkorderContainerProps {
  workorder: Workorder;
  progressWorkorder: ProgressWorkorder[];
}

export default function DetailWorkorderContainer({
  workorder,
  progressWorkorder,
}: DetailWorkorderContainerProps) {
  return (
    <div className="flex max-h-full gap-5 px-10">
      <div className="flex-[3] overflow-y-auto space-y-6 scrollbar-hide rounded-xl">
        <WorkorderDetailCard workorder={workorder} />
        <WorkorderProgressList
          items={progressWorkorder}
          jenisWorkorder={workorder.jenisWorkorder.id}
        />
      </div>
      <div className="flex-[1] bg-white py-6 px-4 overflow-y-auto rounded-xl space-y-6 h-full">
        <div className="flex flex-col gap-2 p-3 border-2 rounded-lg border-gray-200">
          <h3 className="text-lg font-semibold text-center">
            Timeline Riwayat
          </h3>
          <ProgressCalendar />
        </div>
        {workorder.status.id === 8 && workorder.latestFreeze?.id && (
          <WorkorderAlertCard
            title={workorder.status.nama}
            description={workorder.latestFreeze.keterangan}
            time={workorder.latestFreeze.waktuMulai}
          />
        )}
        {workorder.status.id === 4 && workorder.lemburSpl?.id && (
          <WorkorderAlertCard
            title={workorder.status.nama}
            description={workorder.lemburSpl.alasanDitolak}
            time={workorder.lemburSpl.alasanDitolak}
          />
        )}
      </div>
    </div>
  );
}

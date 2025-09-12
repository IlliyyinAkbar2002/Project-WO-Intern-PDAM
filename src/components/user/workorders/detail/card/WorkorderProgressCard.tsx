"use client";

import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import DetailProgressModal from "../modal/DetailProgressModal";
import {
  CaretRightIcon,
  CheckCircleIcon,
  ClockClockwiseIcon,
} from "@phosphor-icons/react";
import { ProgressWorkorder } from "@/types";
import { toast } from "sonner";

interface ProgressCardProps {
  item: ProgressWorkorder;
  jenisWorkorder: number;
}

export default function WorkorderProgressCard({
  item,
  jenisWorkorder,
}: ProgressCardProps) {
  const [isDetailModal, setIsDetailModal] = useState(false);

  const handleClickDetail = () => {
    if (!item.waktuSubmit) {
      toast.error("Progress belum dikirimkan!");
      return;
    }
    setIsDetailModal(true);
  };

  return (
    <div>
      <div
        onClick={handleClickDetail}
        className="bg-white rounded-xl py-4 px-6 hover:shadow-lg hover:cursor-pointer transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-primary-500">
              {!item.waktuSubmit ? (
                <ClockClockwiseIcon size={28} />
              ) : (
                <CheckCircleIcon size={28} />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                Deskripsi pekerjaan
              </p>
              <p className="text-base text-gray-800 truncate max-w-xs">
                {item.hasilPengerjaan || "Dalam proses pengerjaan..."}
              </p>
              <p className="text-sm text-gray-500">{item.waktuSubmit || "-"}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 w-40">
            <Badge
              variant={
                item.tipeProgress === "Mulai"
                  ? "success"
                  : item.tipeProgress === "Selesai"
                  ? "primary"
                  : "info"
              }
              className="text-md w-full"
            >
              {item.tipeProgress}
            </Badge>
            <CaretRightIcon size={32} className="text-black" />
          </div>
        </div>
      </div>
      {isDetailModal && (
        <DetailProgressModal
          onClose={() => setIsDetailModal(false)}
          item={item}
          jenisWorkorder={jenisWorkorder}
        />
      )}
    </div>
  );
}

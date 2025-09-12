"use client";

import { useState } from "react";
import WorkorderForm from "@/components/user/workorders/create/WorkorderForm";
import { createWorkorder } from "@/services/workorderService";
import { WorkorderInput } from "@/types/workorderTypes";
import { toast } from "sonner";
import { JenisWorkorder } from "@/types/jenisWorkorderTypes";
import { User } from "@/types/userTypes";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";

type WorkorderType = "normal" | "lembur";

const typeToIdMap: Record<WorkorderType, number> = {
  normal: 1,
  lembur: 2,
};

interface CreateWorkorderContainerProps {
  type: WorkorderType;
  jenisWorkorders: JenisWorkorder[];
  users: User[];
}

export default function CreateWorkorderContainer({
  type,
  jenisWorkorders,
  users,
}: CreateWorkorderContainerProps) {
  const [isSubmitModalOpen, setSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<WorkorderInput | null>(null);
  const [resetFormCallback, setResetFormCallback] = useState<
    (() => void) | null
  >(null);

  const workorderType = typeToIdMap[type];

  const handleConfirmSubmit = async () => {
    if (!formData || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await createWorkorder(formData);
      toast.success(
        `Workorder ${type === "normal" ? "Normal" : "Lembur"} berhasil diajukan`
      );
      resetFormCallback?.();
    } catch (error) {
      toast.error("Gagal membuat workorder");
    } finally {
      setSubmitModalOpen(false);
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    }
  };

  return (
    <div className="flex-col mx-20 p-6 rounded-lg bg-white">
      <h2 className="text-3xl font-semibold mb-4">
        Pengajuan Work Order {type === "normal" ? "Normal" : "Lembur"}
      </h2>
      <WorkorderForm
        type={workorderType}
        jenisWorkorders={jenisWorkorders}
        users={users}
        onOpenSubmitModal={(data, resetForm) => {
          setFormData(data);
          setResetFormCallback(() => resetForm);
          setSubmitModalOpen(true);
        }}
      />
      <ConfirmModal
        open={isSubmitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        title="Ajukan Work Order"
        description="Apakah Anda yakin ingin mengajukan workorder ini?"
        confirmText="Konfirmasi"
        variant="primary"
        loading={isSubmitting}
      />
    </div>
  );
}

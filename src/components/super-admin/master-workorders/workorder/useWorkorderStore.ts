import { create } from "zustand";
import { PrioritasWorkorder, StatusWorkorder } from "@/types/workorderTypes";

export interface WorkorderFormData {
  id: number;
  jenisWorkorderId: number;
  kodePengaduan: string;
  assignedTo: number;
  createdBy: number;
  departemenId: number;
  namaWorkorder: string;
  deskripsi: string;
  lokasi: string;
  prioritas: PrioritasWorkorder;
  status: StatusWorkorder;
}

interface WorkorderStore {
  formData: WorkorderFormData;
  setFormData: (data: Partial<WorkorderFormData>) => void;
  resetForm: () => void;
}

const initialFormData: WorkorderFormData = {
  id: 0,
  jenisWorkorderId: 0,
  kodePengaduan: "",
  assignedTo: 0,
  createdBy: 0,
  departemenId: 0,
  namaWorkorder: "",
  deskripsi: "",
  lokasi: "",
  prioritas: "" as PrioritasWorkorder,
  status: "Pending",
};

export const useWorkorderStore = create<WorkorderStore>((set) => ({
  formData: initialFormData,
  setFormData: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
    })),
  resetForm: () =>
    set({
      formData: initialFormData,
    }),
}));

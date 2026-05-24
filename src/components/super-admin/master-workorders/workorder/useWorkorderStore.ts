import { create } from "zustand";

export interface WorkorderFormData {
  id: number;
  jenisWorkorderId: number;
  pengaduanId: string;
  pegawaiId: number;
}

interface WorkorderStore {
  formData: WorkorderFormData;
  setFormData: (data: Partial<WorkorderFormData>) => void;
  resetForm: () => void;
}

const initialFormData: WorkorderFormData = {
  id: 0,
  jenisWorkorderId: 0,
  pengaduanId: "",
  pegawaiId: 0,
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

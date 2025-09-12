import { DetailForm, JenisWorkorder, OptionForm } from "@/types";
import { create } from "zustand";

interface JenisWorkorderStore {
  formData: JenisWorkorder;
  setFormData: (data: Partial<JenisWorkorder>) => void;
  setAllFormData: (data: JenisWorkorder) => void;
  addDetailForm: () => void;
  updateDetailForm: (id: number, updatedDetail: Partial<DetailForm>) => void;
  updateDetailFormOrder: (updatedDetails: DetailForm[]) => void;
  removeDetailForm: (id: number) => void;
  updateOptionForm: (detailId: number, optionId: number, updatedOption: Partial<OptionForm>) => void;
  resetForm: () => void;
}

export const useJenisWorkorderStore = create<JenisWorkorderStore>((set) => ({
  formData: {
    id: 0,
    nama: "",
    kpiId: 0,
    detailForm: [],
  },

  setFormData: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
    })),

  setAllFormData: (data) =>
    set(() => ({
      formData: data,
    })),

  addDetailForm: () =>
    set((state) => ({
      formData: {
        ...state.formData,
        detailForm: [
          ...state.formData.detailForm,
          {
            id: -Date.now(),
            namaField: "",
            tipeField: "",
            tipeData: "",
            unitSatuan: null,
            sifat: "",
            min: null,
            max: null,
            parent: null,
            keterangan: null,
            hintText: "",
            order: state.formData.detailForm.length + 1,
            optionForm: [],
          },
        ],
      },
    })),

  updateDetailForm: (id, updatedDetail) =>
    set((state) => ({
      formData: {
        ...state.formData,
        detailForm: state.formData.detailForm.map((detail) =>
          detail.id === id ? { ...detail, ...updatedDetail } : detail
        ),
      },
    })),

  updateDetailFormOrder: (updatedDetails) =>
    set((state) => ({
      formData: {
        ...state.formData,
        detailForm: updatedDetails,
      },
    })),

  removeDetailForm: (id) =>
    set((state) => {
      const newDetailForm = state.formData.detailForm.filter((detail) => detail.id !== id);
      const updatedDetailForm = newDetailForm.map((detail, index) => ({
        ...detail,
        order: index + 1,
      }));
      return {
        formData: {
          ...state.formData,
          detailForm: updatedDetailForm,
        },
      };
      
    }),

  updateOptionForm: (detailId, optionId, updatedOption) =>
    set((state) => ({
      formData: {
        ...state.formData,
        detailForm: state.formData.detailForm.map((detail) =>
          detail.id === detailId
            ? {
                ...detail,
                optionForm: (detail.optionForm || []).map((option) =>
                  option.id === optionId ? { ...option, ...updatedOption } : option
                ),
              }
            : detail
        ),
      },
    })),

  resetForm: () =>
    set({
      formData: {
        id: 0,
        nama: "",
        kpiId: 0,
        detailForm: [],
      },
    }),
}));

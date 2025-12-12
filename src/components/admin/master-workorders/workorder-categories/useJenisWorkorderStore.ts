"use client";

import { create } from "zustand";
import {
  JenisWorkorder,
  JenisWorkorderPayload,
  DetailForm,
  OptionForm,
} from "@/types/jenisWorkorderTypes";
import {
  getJenisWorkorderById,
  createJenisWorkorder as apiCreateJenisWorkorder,
  updateJenisWorkorder as apiUpdateJenisWorkorder,
  deleteJenisWorkorder as apiDeleteJenisWorkorder,
} from "@/services/jenisWorkorderService";
import {
  getDetailForms,
  createDetailForm,
  updateDetailForm,
  deleteDetailForm,
} from "@/services/detailFormService";
import {
  getOptionForms,
  createOptionForm,
  updateOptionForm,
  deleteOptionForm,
} from "@/services/optionFormService";

interface JenisWorkorderState {
  formData: JenisWorkorder;
  setFormData: (data: Partial<JenisWorkorder>) => void;
  setAllFormData: (data: JenisWorkorder) => void;
  resetForm: () => void;

  // Master
  fetchJenisWorkorderById: (id: number) => Promise<void>;
  createJenisWorkorder: (data: Partial<JenisWorkorder>) => Promise<void>;
  updateJenisWorkorder: (
    id: number,
    data: Partial<JenisWorkorder>
  ) => Promise<void>;
  deleteJenisWorkorder: (id: number) => Promise<void>;

  // Detail form
  fetchDetailForms: (jenisWorkorderId: number) => Promise<void>;
  addDetailForm: (
    jenisWorkorderId: number,
    detail?: Partial<DetailForm>
  ) => Promise<void>;
  updateDetailForm: (
    jenisWorkorderId: number,
    id: number,
    detail: DetailForm
  ) => Promise<void>;
  removeDetailForm: (jenisWorkorderId: number, id: number) => Promise<void>;

  // Option form
  fetchOptionForms: (
    jenisWorkorderId: number,
    detailFormId: number
  ) => Promise<void>;
  addOptionForm: (
    jenisWorkorderId: number,
    detailFormId: number,
    option: OptionForm
  ) => Promise<void>;
  updateOptionForm: (
    jenisWorkorderId: number,
    detailFormId: number,
    id: number,
    option: OptionForm
  ) => Promise<void>;
  removeOptionForm: (
    jenisWorkorderId: number,
    detailFormId: number,
    id: number
  ) => Promise<void>;
}

export const useJenisWorkorderStore = create<JenisWorkorderState>(
  (set, get) => ({
    formData: {
      id: 0,
      nama: "",
      kpiId: 0,
      detailForm: [],
    },

    setFormData: (data) =>
      set((state) => ({
        formData: { ...state.formData, ...data },
      })),

    setAllFormData: (data) => set({ formData: data }),

    resetForm: () =>
      set({
        formData: { id: 0, nama: "", kpiId: 0, detailForm: [] },
      }),

    // Master
    fetchJenisWorkorderById: async (id: number) => {
      const jw = await getJenisWorkorderById(id);
      set({ formData: jw });
    },

    createJenisWorkorder: async (data: Partial<JenisWorkorder>) => {
      const current = get().formData;
      const payload: JenisWorkorderPayload = {
        nama: data.nama ?? current.nama ?? "",
        kpiId: data.kpiId ?? current.kpiId ?? 0,
      };
      const jw = await apiCreateJenisWorkorder(payload);
      set({ formData: jw });
    },

    updateJenisWorkorder: async (id: number, data: Partial<JenisWorkorder>) => {
      const current = get().formData;
      const payload: JenisWorkorderPayload = {
        id,
        nama: data.nama ?? current.nama ?? "",
        kpiId: data.kpiId ?? current.kpiId ?? 0,
      };
      const jw = await apiUpdateJenisWorkorder(id, payload);
      set({ formData: jw });
    },

    deleteJenisWorkorder: async (id: number) => {
      await apiDeleteJenisWorkorder(id);
      set({
        formData: { id: 0, nama: "", kpiId: 0, detailForm: [] },
      });
    },

    // Detail form
    fetchDetailForms: async (jenisWorkorderId: number) => {
      if (!jenisWorkorderId || jenisWorkorderId <= 0) return;
      const details = await getDetailForms(jenisWorkorderId);
      set((state) => ({
        formData: { ...state.formData, detailForm: details },
      }));
    },

    addDetailForm: async (
      jenisWorkorderId: number,
      detail?: Partial<DetailForm>
    ) => {
      // If jenisWorkorderId is present (persisted), create on server.
      if (jenisWorkorderId && jenisWorkorderId > 0) {
        const newDetail = await createDetailForm(
          jenisWorkorderId,
          detail as DetailForm
        );
        set((state) => ({
          formData: {
            ...state.formData,
            detailForm: [...state.formData.detailForm, newDetail],
          },
        }));
        return;
      }

      // Otherwise create a local temporary detail (unsaved)
      const tempId = -Date.now();
      const current = get();
      const localDetail: DetailForm = {
        id: tempId,
        jenisWorkorderId: jenisWorkorderId,
        namaField: detail?.namaField ?? "",
        tipeField: detail?.tipeField ?? "",
        tipeData: detail?.tipeData ?? "",
        unitSatuan: detail?.unitSatuan ?? null,
        sifat: detail?.sifat ?? "",
        min: detail?.min ?? null,
        max: detail?.max ?? null,
        parent: detail?.parent ?? null,
        keterangan: detail?.keterangan ?? null,
        hintText: detail?.hintText ?? "",
        order: detail?.order ?? (current.formData.detailForm?.length ?? 0) + 1,
        optionForm: detail?.optionForm ?? [],
      };
      set((state) => ({
        formData: {
          ...state.formData,
          detailForm: [...state.formData.detailForm, localDetail],
        },
      }));
    },

    updateDetailForm: async (
      jenisWorkorderId: number,
      id: number,
      detail: DetailForm
    ) => {
      // Persisted detail -> call API
      if (id > 0 && jenisWorkorderId && jenisWorkorderId > 0) {
        const updated = await updateDetailForm(jenisWorkorderId, id, detail);
        set((state) => ({
          formData: {
            ...state.formData,
            detailForm: state.formData.detailForm.map((df) =>
              df.id === id ? updated : df
            ),
          },
        }));
        return;
      }

      // Local-only detail -> update locally
      set((state) => ({
        formData: {
          ...state.formData,
          detailForm: state.formData.detailForm.map((df) =>
            df.id === id ? { ...df, ...detail } : df
          ),
        },
      }));
    },

    removeDetailForm: async (jenisWorkorderId: number, id: number) => {
      // If persisted on server
      if (id > 0 && jenisWorkorderId && jenisWorkorderId > 0) {
        await deleteDetailForm(jenisWorkorderId, id);
        set((state) => ({
          formData: {
            ...state.formData,
            detailForm: state.formData.detailForm.filter((df) => df.id !== id),
          },
        }));
        return;
      }

      // Local-only -> remove locally
      set((state) => ({
        formData: {
          ...state.formData,
          detailForm: state.formData.detailForm.filter((df) => df.id !== id),
        },
      }));
    },

    // Option form
    fetchOptionForms: async (
      jenisWorkorderId: number,
      detailFormId: number
    ) => {
      if (!jenisWorkorderId || jenisWorkorderId <= 0 || !detailFormId) return;
      const options = await getOptionForms(jenisWorkorderId, detailFormId);
      set((state) => ({
        formData: {
          ...state.formData,
          detailForm: state.formData.detailForm.map((df) =>
            df.id === detailFormId ? { ...df, optionForm: options } : df
          ),
        },
      }));
    },

    addOptionForm: async (
      jenisWorkorderId: number,
      detailFormId: number,
      option: OptionForm
    ) => {
      // Persisted detail -> call API
      if (
        jenisWorkorderId &&
        jenisWorkorderId > 0 &&
        detailFormId &&
        detailFormId > 0
      ) {
        const newOption = await createOptionForm(
          jenisWorkorderId,
          detailFormId,
          option
        );
        set((state) => ({
          formData: {
            ...state.formData,
            detailForm: state.formData.detailForm.map((df) =>
              df.id === detailFormId
                ? { ...df, optionForm: [...df.optionForm, newOption] }
                : df
            ),
          },
        }));
        return;
      }

      // Local-only option -> add locally with temp id
      const tempId = -Date.now();
      const localOption: OptionForm = {
        id: tempId,
        namaOpsi: option.namaOpsi ?? "",
        parent: option.parent ?? null,
        order: option.order ?? 0,
      };
      set((state) => ({
        formData: {
          ...state.formData,
          detailForm: state.formData.detailForm.map((df) =>
            df.id === detailFormId
              ? { ...df, optionForm: [...(df.optionForm || []), localOption] }
              : df
          ),
        },
      }));
    },

    updateOptionForm: async (
      jenisWorkorderId: number,
      detailFormId: number,
      id: number,
      option: OptionForm
    ) => {
      // Persisted -> call API
      if (
        id > 0 &&
        jenisWorkorderId &&
        jenisWorkorderId > 0 &&
        detailFormId &&
        detailFormId > 0
      ) {
        const updated = await updateOptionForm(
          jenisWorkorderId,
          detailFormId,
          id,
          option
        );
        set((state) => ({
          formData: {
            ...state.formData,
            detailForm: state.formData.detailForm.map((df) =>
              df.id === detailFormId
                ? {
                    ...df,
                    optionForm: df.optionForm.map((opt) =>
                      opt.id === id ? updated : opt
                    ),
                  }
                : df
            ),
          },
        }));
        return;
      }

      // Local-only update
      set((state) => ({
        formData: {
          ...state.formData,
          detailForm: state.formData.detailForm.map((df) =>
            df.id === detailFormId
              ? {
                  ...df,
                  optionForm: (df.optionForm || []).map((opt) =>
                    opt.id === id ? { ...opt, ...option } : opt
                  ),
                }
              : df
          ),
        },
      }));
    },

    removeOptionForm: async (
      jenisWorkorderId: number,
      detailFormId: number,
      id: number
    ) => {
      // Persisted -> delete on server
      if (id > 0 && jenisWorkorderId && jenisWorkorderId > 0) {
        await deleteOptionForm(jenisWorkorderId, detailFormId, id);
        set((state) => ({
          formData: {
            ...state.formData,
            detailForm: state.formData.detailForm.map((df) =>
              df.id === detailFormId
                ? {
                    ...df,
                    optionForm: df.optionForm.filter((opt) => opt.id !== id),
                  }
                : df
            ),
          },
        }));
        return;
      }

      // Local-only -> remove locally
      set((state) => ({
        formData: {
          ...state.formData,
          detailForm: state.formData.detailForm.map((df) =>
            df.id === detailFormId
              ? {
                  ...df,
                  optionForm: (df.optionForm || []).filter(
                    (opt) => opt.id !== id
                  ),
                }
              : df
          ),
        },
      }));
    },
  })
);

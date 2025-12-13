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
  ) => Promise<DetailForm>;
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
      const localDetailsSnapshot = [...(current.detailForm ?? [])];

      // 1) Create master first
      const jw = await apiCreateJenisWorkorder(payload);

      // 2) Keep local detail rows (temp) while persisting them
      set((state) => ({
        formData: {
          ...state.formData,
          ...jw,
          id: jw.id,
          nama: jw.nama,
          kpiId: jw.kpiId,
          detailForm: localDetailsSnapshot.map((df) => ({
            ...df,
            jenisWorkorderId: jw.id,
          })),
        },
      }));

      // No local details to sync
      if (localDetailsSnapshot.length === 0) {
        set({ formData: jw });
        return;
      }

      const localDetails = localDetailsSnapshot
        .filter((df) => df.id <= 0)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      // Nothing to persist (unlikely) -> just ensure master is set
      if (localDetails.length === 0) {
        set((state) => ({
          formData: { ...state.formData, ...jw, id: jw.id, nama: jw.nama, kpiId: jw.kpiId },
        }));
        return;
      }

      const isCompleteDetail = (df: DetailForm): boolean => {
        if (!df.namaField?.trim()) return false;
        if (!df.tipeField) return false;
        if (
          !df.tipeData &&
          df.tipeField !== "dropdown" &&
          df.tipeField !== "image" &&
          df.tipeField !== "date"
        ) {
          return false;
        }
        if (!df.sifat) return false;
        // hintText is required by backend
        if (df.hintText === undefined || df.hintText === null) return false;
        if (df.tipeField === "dropdown" && df.parent === null) return false;
        if (
          df.tipeField === "dropdown" &&
          !(df.optionForm || []).every((opt) => (opt.namaOpsi || "").trim() !== "")
        ) {
          return false;
        }
        return true;
      };

      // Filter only complete details that can be synced to backend
      const completeDetails = localDetails.filter((df) => isCompleteDetail(df));

      // If no complete details, just set master and return
      if (completeDetails.length === 0) {
        set((state) => ({
          formData: { ...state.formData, ...jw, id: jw.id, nama: jw.nama, kpiId: jw.kpiId },
        }));
        return;
      }

      const detailIdMap = new Map<number, number>(); // localDetailId -> serverDetailId
      const localOptionIdToOrderByDetailId = new Map<number, Map<number, number>>();
      for (const df of completeDetails) {
        const optionMap = new Map<number, number>();
        for (const opt of df.optionForm || []) {
          optionMap.set(opt.id, opt.order);
        }
        localOptionIdToOrderByDetailId.set(df.id, optionMap);
      }

      const serverOptionIdByOrderByDetailServerId = new Map<number, Map<number, number>>();

      // Create complete details with all required fields
      for (const df of completeDetails) {
        // Map parent detail ID if it references a local (negative) ID
        const mappedParentDetailId =
          typeof df.parent === "number" && df.parent < 0
            ? detailIdMap.get(df.parent) ?? 0
            : df.parent;

        const parentFieldLocalId = typeof df.parent === "number" ? df.parent : null;
        const parentFieldServerId =
          typeof parentFieldLocalId === "number" && parentFieldLocalId < 0
            ? detailIdMap.get(parentFieldLocalId)
            : parentFieldLocalId;

        const optionForm = (df.optionForm || []).map((opt) => {
          let mappedOptParent = opt.parent;

          // If option parent references a local option id (negative), remap via option.order
          if (
            typeof mappedOptParent === "number" &&
            mappedOptParent < 0 &&
            typeof parentFieldLocalId === "number" &&
            typeof parentFieldServerId === "number"
          ) {
            const localIdToOrder = localOptionIdToOrderByDetailId.get(parentFieldLocalId);
            const parentOrder = localIdToOrder?.get(mappedOptParent);
            const serverOrderToId =
              serverOptionIdByOrderByDetailServerId.get(parentFieldServerId);
            const newParentId =
              parentOrder != null ? serverOrderToId?.get(parentOrder) : undefined;
            mappedOptParent = newParentId ?? 0;
          }

          return {
            ...opt,
            id: undefined,
            parent: mappedOptParent,
          };
        });

        const createPayload: any = {
          ...df,
          jenisWorkorderId: jw.id,
          parent: mappedParentDetailId,
          optionForm,
        };
        // Remove local temp ID before sending
        delete createPayload.id;

        const created = await createDetailForm(jw.id, createPayload as DetailForm);

        detailIdMap.set(df.id, created.id);

        // Update local state with server response
        set((state) => ({
          formData: {
            ...state.formData,
            detailForm: state.formData.detailForm.map((item) =>
              item.id === df.id ? created : item
            ),
          },
        }));

        // Track option IDs for parent mapping
        const orderMap = new Map<number, number>();
        for (const opt of created.optionForm || []) {
          orderMap.set(opt.order, opt.id);
        }
        serverOptionIdByOrderByDetailServerId.set(created.id, orderMap);
      }
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
        return newDetail;
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
      return localDetail;
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

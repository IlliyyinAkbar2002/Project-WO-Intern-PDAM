"use client";

import { create } from "zustand";
import {
  JenisWorkorder,
  JenisWorkorderPayload,
  FormWorkorder,
  DetailForm,
} from "@/types/jenisWorkorderTypes";
import {
  getJenisWorkorderById,
  createJenisWorkorder as apiCreateJenisWorkorder,
  updateJenisWorkorder as apiUpdateJenisWorkorder,
  deleteJenisWorkorder as apiDeleteJenisWorkorder,
} from "@/services/jenisWorkorderService";
import {
  getFormWorkorders,
  createFormWorkorder,
  updateFormWorkorder,
  deleteFormWorkorder,
} from "@/services/formWorkorderService";
import {
  getDetailForms,
  createDetailForm,
  updateDetailForm,
  deleteDetailForm,
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
    data: Partial<JenisWorkorder>,
  ) => Promise<void>;
  deleteJenisWorkorder: (id: number) => Promise<void>;

  // Form workorder (dulunya detail form)
  fetchFormWorkorders: (jenisWorkorderId: number) => Promise<void>;
  addFormWorkorder: (
    jenisWorkorderId: number,
    form?: Partial<FormWorkorder>,
  ) => Promise<FormWorkorder>;
  updateFormWorkorder: (
    jenisWorkorderId: number,
    id: number,
    form: FormWorkorder,
  ) => Promise<void>;
  removeFormWorkorder: (jenisWorkorderId: number, id: number) => Promise<void>;

  // Detail form (dulunya option form - untuk opsi dropdown)
  fetchDetailForms: (
    jenisWorkorderId: number,
    formWorkorderId: number,
  ) => Promise<void>;
  addDetailForm: (
    jenisWorkorderId: number,
    formWorkorderId: number,
    detail: DetailForm,
  ) => Promise<void>;
  updateDetailForm: (
    jenisWorkorderId: number,
    formWorkorderId: number,
    id: number,
    detail: DetailForm,
  ) => Promise<void>;
  removeDetailForm: (
    jenisWorkorderId: number,
    formWorkorderId: number,
    id: number,
  ) => Promise<void>;
}

export const useJenisWorkorderStore = create<JenisWorkorderState>(
  (set, get) => ({
    formData: {
      id: 0,
      nama: "",
      kpiId: 0, // kpiId di root level
      pegawaiId: null,
      pengaduanId: null,
      formWorkorder: [],
    },

    setFormData: (data) =>
      set((state) => ({
        formData: { ...state.formData, ...data },
      })),

    setAllFormData: (data) => set({ formData: data }),

    resetForm: () =>
      set({
        formData: {
          id: 0,
          nama: "",
          kpiId: 0,
          pegawaiId: null,
          pengaduanId: null,
          formWorkorder: [],
        },
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
        kpiId: current.kpiId ?? 0, // kpiId di root level
        pegawaiId: current.pegawaiId ?? null,
        pengaduanId: current.pengaduanId ?? null,
        formWorkorder: current.formWorkorder ?? [],
      };
      const localFormWorkordersSnapshot = [...(current.formWorkorder ?? [])];

      // 1) Create master first
      const jw = await apiCreateJenisWorkorder(payload);

      // 2) Keep local form workorder rows (temp) while persisting them
      set((state) => ({
        formData: {
          ...state.formData,
          ...jw,
          id: jw.id,
          nama: jw.nama,
          formWorkorder: localFormWorkordersSnapshot.map((fw) => ({
            ...fw,
            jenisWorkorderId: jw.id,
          })),
        },
      }));

      // No local form workorders to sync
      if (localFormWorkordersSnapshot.length === 0) {
        set({ formData: jw });
        return;
      }

      const localFormWorkorders = localFormWorkordersSnapshot
        .filter((fw) => fw.id <= 0)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      // Nothing to persist (unlikely) -> just ensure master is set
      if (localFormWorkorders.length === 0) {
        set((state) => ({
          formData: { ...state.formData, ...jw, id: jw.id, nama: jw.nama },
        }));
        return;
      }

      const isCompleteFormWorkorder = (fw: FormWorkorder): boolean => {
        if (!fw.namaField?.trim()) return false;
        if (!fw.tipeField) return false;
        if (!fw.kpiId || fw.kpiId <= 0) return false; // kpiId wajib di setiap formWorkorder
        if (
          !fw.tipeData &&
          fw.tipeField !== "dropdown" &&
          fw.tipeField !== "image" &&
          fw.tipeField !== "date"
        ) {
          return false;
        }
        if (!fw.sifat) return false;
        // hintText is required by backend
        if (fw.hintText === undefined || fw.hintText === null) return false;
        if (fw.tipeField === "dropdown" && fw.parent === null) return false;
        if (
          fw.tipeField === "dropdown" &&
          !(fw.detailForm || []).every(
            (df) => (df.namaOpsi || "").trim() !== "",
          )
        ) {
          return false;
        }
        return true;
      };

      // Filter only complete form workorders that can be synced to backend
      const completeFormWorkorders = localFormWorkorders.filter((fw) =>
        isCompleteFormWorkorder(fw),
      );

      // If no complete form workorders, just set master and return
      if (completeFormWorkorders.length === 0) {
        set((state) => ({
          formData: { ...state.formData, ...jw, id: jw.id, nama: jw.nama },
        }));
        return;
      }

      const formWorkorderIdMap = new Map<number, number>(); // localFormWorkorderId -> serverFormWorkorderId
      const localDetailFormIdToOrderByFormWorkorderId = new Map<
        number,
        Map<number, number>
      >();
      for (const fw of completeFormWorkorders) {
        const detailFormMap = new Map<number, number>();
        for (const df of fw.detailForm || []) {
          detailFormMap.set(df.id, df.order);
        }
        localDetailFormIdToOrderByFormWorkorderId.set(fw.id, detailFormMap);
      }

      const serverDetailFormIdByOrderByFormWorkorderServerId = new Map<
        number,
        Map<number, number>
      >();

      // Create complete form workorders with all required fields
      for (const fw of completeFormWorkorders) {
        // Map parent form workorder ID if it references a local (negative) ID
        const mappedParentFormWorkorderId =
          typeof fw.parent === "number" && fw.parent < 0
            ? (formWorkorderIdMap.get(fw.parent) ?? 0)
            : fw.parent;

        const parentFieldLocalId =
          typeof fw.parent === "number" ? fw.parent : null;
        const parentFieldServerId =
          typeof parentFieldLocalId === "number" && parentFieldLocalId < 0
            ? formWorkorderIdMap.get(parentFieldLocalId)
            : parentFieldLocalId;

        const detailForm = (fw.detailForm || []).map((df) => {
          let mappedDfParent = df.parent;

          // If detail form parent references a local detail form id (negative), remap via detailForm.order
          if (
            typeof mappedDfParent === "number" &&
            mappedDfParent < 0 &&
            typeof parentFieldLocalId === "number" &&
            typeof parentFieldServerId === "number"
          ) {
            const localIdToOrder =
              localDetailFormIdToOrderByFormWorkorderId.get(parentFieldLocalId);
            const parentOrder = localIdToOrder?.get(mappedDfParent);
            const serverOrderToId =
              serverDetailFormIdByOrderByFormWorkorderServerId.get(
                parentFieldServerId,
              );
            const newParentId =
              parentOrder != null
                ? serverOrderToId?.get(parentOrder)
                : undefined;
            mappedDfParent = newParentId ?? 0;
          }

          return {
            ...df,
            id: undefined,
            parent: mappedDfParent,
          };
        });

        const createPayload: any = {
          ...fw,
          jenisWorkorderId: jw.id,
          parent: mappedParentFormWorkorderId,
          detailForm,
        };
        // Remove local temp ID before sending
        delete createPayload.id;

        const created = await createFormWorkorder(
          jw.id,
          createPayload as FormWorkorder,
        );

        formWorkorderIdMap.set(fw.id, created.id);

        // Update local state with server response
        set((state) => ({
          formData: {
            ...state.formData,
            formWorkorder: state.formData.formWorkorder.map((item) =>
              item.id === fw.id ? created : item,
            ),
          },
        }));

        // Track detail form IDs for parent mapping
        const orderMap = new Map<number, number>();
        for (const df of created.detailForm || []) {
          orderMap.set(df.order, df.id);
        }
        serverDetailFormIdByOrderByFormWorkorderServerId.set(
          created.id,
          orderMap,
        );
      }
    },

    updateJenisWorkorder: async (id: number, data: Partial<JenisWorkorder>) => {
      const current = get().formData;
      const payload: JenisWorkorderPayload = {
        id,
        nama: data.nama ?? current.nama ?? "",
        kpiId: data.kpiId ?? current.kpiId ?? 0, // kpiId di root level
        pegawaiId: data.pegawaiId ?? current.pegawaiId ?? null,
        pengaduanId: data.pengaduanId ?? current.pengaduanId ?? null,
        formWorkorder: data.formWorkorder ?? current.formWorkorder ?? [],
      };
      const jw = await apiUpdateJenisWorkorder(id, payload);
      set({ formData: jw });
    },

    deleteJenisWorkorder: async (id: number) => {
      await apiDeleteJenisWorkorder(id);
      set({
        formData: { id: 0, nama: "", kpiId: 0, formWorkorder: [] },
      });
    },

    // Form workorder (dulunya detail form)
    fetchFormWorkorders: async (jenisWorkorderId: number) => {
      if (!jenisWorkorderId || jenisWorkorderId <= 0) return;
      const formWorkorders = await getFormWorkorders(jenisWorkorderId);
      set((state) => ({
        formData: { ...state.formData, formWorkorder: formWorkorders },
      }));
    },

    addFormWorkorder: async (
      jenisWorkorderId: number,
      form?: Partial<FormWorkorder>,
    ) => {
      // If jenisWorkorderId is present (persisted), create on server.
      if (jenisWorkorderId && jenisWorkorderId > 0) {
        const newForm = await createFormWorkorder(
          jenisWorkorderId,
          form as FormWorkorder,
        );
        set((state) => ({
          formData: {
            ...state.formData,
            formWorkorder: [...state.formData.formWorkorder, newForm],
          },
        }));
        return newForm;
      }

      // Otherwise create a local temporary form workorder (unsaved)
      const tempId = -Date.now();
      const current = get();
      const localFormWorkorder: FormWorkorder = {
        id: tempId,
        jenisWorkorderId: jenisWorkorderId,
        kpiId: form?.kpiId ?? 0, // kpiId sekarang di sini
        namaField: form?.namaField ?? "",
        tipeField: form?.tipeField ?? "",
        tipeData: form?.tipeData ?? "",
        sifat: form?.sifat ?? "",
        min: form?.min ?? null,
        max: form?.max ?? null,
        parent: form?.parent ?? null,
        keterangan: form?.keterangan ?? null,
        hintText: form?.hintText ?? "",
        order: form?.order ?? (current.formData.formWorkorder?.length ?? 0) + 1,
        detailForm: form?.detailForm ?? [],
      };
      set((state) => ({
        formData: {
          ...state.formData,
          formWorkorder: [...state.formData.formWorkorder, localFormWorkorder],
        },
      }));
      return localFormWorkorder;
    },

    updateFormWorkorder: async (
      jenisWorkorderId: number,
      id: number,
      form: FormWorkorder,
    ) => {
      // Persisted form workorder -> call API
      if (id > 0 && jenisWorkorderId && jenisWorkorderId > 0) {
        const updated = await updateFormWorkorder(jenisWorkorderId, id, form);
        set((state) => ({
          formData: {
            ...state.formData,
            formWorkorder: state.formData.formWorkorder.map((fw) =>
              fw.id === id ? updated : fw,
            ),
          },
        }));
        return;
      }

      // Local-only form workorder -> update locally
      set((state) => ({
        formData: {
          ...state.formData,
          formWorkorder: state.formData.formWorkorder.map((fw) =>
            fw.id === id ? { ...fw, ...form } : fw,
          ),
        },
      }));
    },

    removeFormWorkorder: async (jenisWorkorderId: number, id: number) => {
      // If persisted on server
      if (id > 0 && jenisWorkorderId && jenisWorkorderId > 0) {
        await deleteFormWorkorder(jenisWorkorderId, id);
        set((state) => ({
          formData: {
            ...state.formData,
            formWorkorder: state.formData.formWorkorder.filter(
              (fw) => fw.id !== id,
            ),
          },
        }));
        return;
      }

      // Local-only -> remove locally
      set((state) => ({
        formData: {
          ...state.formData,
          formWorkorder: state.formData.formWorkorder.filter(
            (fw) => fw.id !== id,
          ),
        },
      }));
    },

    // Detail form (dulunya option form - untuk opsi dropdown)
    fetchDetailForms: async (
      jenisWorkorderId: number,
      formWorkorderId: number,
    ) => {
      if (!jenisWorkorderId || jenisWorkorderId <= 0 || !formWorkorderId)
        return;
      const detailForms = await getDetailForms(
        jenisWorkorderId,
        formWorkorderId,
      );
      set((state) => ({
        formData: {
          ...state.formData,
          formWorkorder: state.formData.formWorkorder.map((fw) =>
            fw.id === formWorkorderId ? { ...fw, detailForm: detailForms } : fw,
          ),
        },
      }));
    },

    addDetailForm: async (
      jenisWorkorderId: number,
      formWorkorderId: number,
      detail: DetailForm,
    ) => {
      // Persisted form workorder -> call API
      if (
        jenisWorkorderId &&
        jenisWorkorderId > 0 &&
        formWorkorderId &&
        formWorkorderId > 0
      ) {
        const newDetail = await createDetailForm(
          jenisWorkorderId,
          formWorkorderId,
          detail,
        );
        set((state) => ({
          formData: {
            ...state.formData,
            formWorkorder: state.formData.formWorkorder.map((fw) =>
              fw.id === formWorkorderId
                ? { ...fw, detailForm: [...fw.detailForm, newDetail] }
                : fw,
            ),
          },
        }));
        return;
      }

      // Local-only detail -> add locally with temp id
      const tempId = -Date.now();
      const localDetail: DetailForm = {
        id: tempId,
        namaOpsi: detail.namaOpsi ?? "",
        parent: detail.parent ?? null,
        order: detail.order ?? 0,
      };
      set((state) => ({
        formData: {
          ...state.formData,
          formWorkorder: state.formData.formWorkorder.map((fw) =>
            fw.id === formWorkorderId
              ? { ...fw, detailForm: [...(fw.detailForm || []), localDetail] }
              : fw,
          ),
        },
      }));
    },

    updateDetailForm: async (
      jenisWorkorderId: number,
      formWorkorderId: number,
      id: number,
      detail: DetailForm,
    ) => {
      // Persisted -> call API
      if (
        id > 0 &&
        jenisWorkorderId &&
        jenisWorkorderId > 0 &&
        formWorkorderId &&
        formWorkorderId > 0
      ) {
        const updated = await updateDetailForm(
          jenisWorkorderId,
          formWorkorderId,
          id,
          detail,
        );
        set((state) => ({
          formData: {
            ...state.formData,
            formWorkorder: state.formData.formWorkorder.map((fw) =>
              fw.id === formWorkorderId
                ? {
                    ...fw,
                    detailForm: fw.detailForm.map((df) =>
                      df.id === id ? updated : df,
                    ),
                  }
                : fw,
            ),
          },
        }));
        return;
      }

      // Local-only update
      set((state) => ({
        formData: {
          ...state.formData,
          formWorkorder: state.formData.formWorkorder.map((fw) =>
            fw.id === formWorkorderId
              ? {
                  ...fw,
                  detailForm: (fw.detailForm || []).map((df) =>
                    df.id === id ? { ...df, ...detail } : df,
                  ),
                }
              : fw,
          ),
        },
      }));
    },

    removeDetailForm: async (
      jenisWorkorderId: number,
      formWorkorderId: number,
      id: number,
    ) => {
      // Persisted -> delete on server
      if (id > 0 && jenisWorkorderId && jenisWorkorderId > 0) {
        await deleteDetailForm(jenisWorkorderId, formWorkorderId, id);
        set((state) => ({
          formData: {
            ...state.formData,
            formWorkorder: state.formData.formWorkorder.map((fw) =>
              fw.id === formWorkorderId
                ? {
                    ...fw,
                    detailForm: fw.detailForm.filter((df) => df.id !== id),
                  }
                : fw,
            ),
          },
        }));
        return;
      }

      // Local-only -> remove locally
      set((state) => ({
        formData: {
          ...state.formData,
          formWorkorder: state.formData.formWorkorder.map((fw) =>
            fw.id === formWorkorderId
              ? {
                  ...fw,
                  detailForm: (fw.detailForm || []).filter(
                    (df) => df.id !== id,
                  ),
                }
              : fw,
          ),
        },
      }));
    },
  }),
);

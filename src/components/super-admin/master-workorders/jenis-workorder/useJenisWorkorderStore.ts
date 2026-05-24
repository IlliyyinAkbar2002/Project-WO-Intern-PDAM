"use client";

import { create } from "zustand";
import {
  JenisWorkorder,
  JenisWorkorderPayload,
} from "@/types/jenisWorkorderTypes";
import {
  getJenisWorkorderById,
  updateJenisWorkorderStatus,
} from "@/services/jenisWorkorderService";

// =========================================================
// INITIAL FORM
// =========================================================
const getInitialFormData = (): JenisWorkorderPayload => ({
  nama: "",
  kategori: null,
  is_active: true,
});

// =========================================================
// STORE TYPES
// =========================================================
interface JenisWorkorderState {
  formData: JenisWorkorderPayload;
  loading: boolean;
  error: string | null;

  setFormData: (data: Partial<JenisWorkorderPayload>) => void;
  resetForm: () => void;
  fetchJenisWorkorderById: (id: number) => Promise<JenisWorkorder>;
  toggleStatusJenisWorkorder: (
    id: number,
    status: boolean,
  ) => Promise<JenisWorkorder>;
}

// =========================================================
// STORE
// =========================================================
export const useJenisWorkorderStore = create<JenisWorkorderState>((set) => ({
  formData: getInitialFormData(),
  loading: false,
  error: null,

  // =====================================================
  // SET FORM
  // =====================================================
  setFormData: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
    })),

  // =====================================================
  // RESET FORM
  // =====================================================
  resetForm: () =>
    set({
      formData: getInitialFormData(),
      error: null,
    }),

  // =====================================================
  // FETCH DETAIL
  // =====================================================
  fetchJenisWorkorderById: async (id) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await getJenisWorkorderById(id);

      set({
        formData: {
          nama: response.nama ?? "",
          kategori: response.kategori ?? null,
          is_active: response.is_active ?? false,
        },
      });
      return response;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengambil data jenis workorder";
      set({
        error: message,
      });
      console.error(error);
      throw error;
    } finally {
      set({
        loading: false,
      });
    }
  },

  // =====================================================
  // TOGGLE STATUS
  // =====================================================
  toggleStatusJenisWorkorder: async (id, status) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await updateJenisWorkorderStatus(id, status);

      set({
        formData: {
          nama: response.nama ?? "",
          kategori: response.kategori ?? null,
          is_active: response.is_active ?? false,
        },
      });
      return response;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengubah status jenis workorder";
      set({
        error: message,
      });
      console.error(error);
      throw error;
    } finally {
      set({
        loading: false,
      });
    }
  },
}));

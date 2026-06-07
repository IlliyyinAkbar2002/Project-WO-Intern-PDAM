import { api } from "@/lib/api";

import {
  PegawaiResponse,
  PegawaiListItem,
  PegawaiDetail,
  PegawaiPayload,
  PegawaiMetaResponse,
  PegawaiCreatePayload
} from "@/types/pegawaiTypes";

/**
 * GET LIST PEGAWAI
 */
export const getPegawai = async (
  page: number,
  perPage: number,
  search?: string,
  sort?: string,
  departemenId?: number | string,
  jabatanId?: number | string,
): Promise<PegawaiResponse> => {
  try {
    const params: Record<string, string | number> = {
      page,
      per_page: perPage,
    };

    if (search?.trim()) {
      params.search = search.trim();
    }
    if (sort?.trim()) {
      params.sort = sort.trim();
    }
    if (departemenId) {
      params.departemen_id = departemenId;
    }
    if (jabatanId) {
      params.jabatan_id = jabatanId;
    }
    const response = await api.get("/v1/pegawai", {
      params,
    });
    return {
      data: response.data.data ?? [],
      currentPage: response.data.current_page ?? 1,
      totalPages: response.data.last_page ?? 1,
    };
  } catch (error) {
    console.error("getPegawai error:", error);
    throw new Error("Gagal mengambil data pegawai");
  }
};

/**
 * GET DETAIL PEGAWAI
 */
export const getPegawaiById = async (id: number): Promise<PegawaiDetail> => {
  try {
    const response = await api.get(`/v1/pegawai/${id}`);
    return response.data;
  } catch (error) {
    console.error("getPegawaiById error:", error);
    throw new Error("Gagal mengambil detail pegawai");
  }
};

/**
 * UPDATE PEGAWAI
 */
export const updatePegawai = async (id: number, payload: PegawaiPayload) => {
  try {
    const response = await api.put(`/v1/pegawai/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("updatePegawai error:", error);
    throw new Error("Gagal update data pegawai");
  }
};

/**
 * GET META DATA
 * Departemen & Jabatan
 */
export const getPegawaiMeta = async (): Promise<PegawaiMetaResponse> => {
  try {
    const response = await api.get("/v1/pegawai/meta");
    return {
      departemen: response.data.departemen ?? [],
      jabatan: response.data.jabatan ?? [],
    };
  } catch (error) {
    console.error("getPegawaiMeta error:", error);
    throw new Error("Gagal mengambil data referensi pegawai");
  }
};

export const createPegawai = async (payload: PegawaiCreatePayload) => {
  const res = await api.post("/v1/pegawai", payload);
  return res.data;
};

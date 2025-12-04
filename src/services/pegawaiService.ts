import { api } from "@/lib/api";
import { PegawaiResponse } from "@/types/pegawaiTypes";

// Fungsi untuk mengambil semua data pegawai
export const getPegawai = async (
  page: number,
  itemsPerPage: number,
  search: string,
  sort: string,
  departemenId?: number,
  jabatanId?: number
): Promise<PegawaiResponse> => {
  try {
    const params: any = {
      page,
      per_page: itemsPerPage,
      search,
      sort,
    };
    if (departemenId) params.departemen_id = departemenId;
    if (jabatanId) params.jabatan_id = jabatanId;

    const response = await api.get("/v1/pegawai", { params });

    return {
      data: response.data.data,
      totalPages: response.data.last_page ?? 1,
      currentPage: response.data.current_page ?? page,
    };
  } catch (error: any) {
    console.error("getPegawai error:", error);
    throw new Error("Gagal mengambil data pegawai.");
  }
};

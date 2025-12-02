import { api } from "@/lib/api";
import { Pegawai } from "@/types/pegawaiTypes";

// Fungsi untuk mengambil semua data pegawai
export const getPegawai = async (
  page: number,
  itemsPerPage: number,
  search: string,
  sort: string,
  departemenId?: number,
  jabatanId?: number
): Promise<Pegawai[]> => {
  try {
    const params: any = {};
    if (departemenId) params.departemen_id = departemenId;
    if (jabatanId) params.jabatan_id = jabatanId;

    const response = await api.get("/v1/pegawai", { params });
    return response.data.data as Pegawai[];
  } catch (error: any) {
    console.error("getPegawai error:", error);
    throw new Error("Gagal mengambil data pegawai.");
  }
};

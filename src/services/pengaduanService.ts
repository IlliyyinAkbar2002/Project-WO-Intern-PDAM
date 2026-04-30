import { api } from "@/lib/api";
import { Pengaduan } from "@/types/pengaduanTypes";

export interface GetPengaduanParams {
  page?: number;
  search?: string;
  sort?: string;
}

export interface PengaduanApiResponse {
  data: Pengaduan[];
  current_page: number;
  last_page: number;
}

export const getPengaduan = async (
  params: GetPengaduanParams,
): Promise<PengaduanApiResponse> => {
  try {
    const response = await api.get("/v1/pengaduan", {
      params,
    });

    if (!response?.data?.data) {
      throw new Error("Response backend tidak valid.");
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching pengaduan:", error);

    const respData = error.response?.data;

    throw new Error(respData?.message || "Gagal mengambil data pengaduan.");
  }
};

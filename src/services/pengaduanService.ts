import { api } from "@/lib/api";
import { Pengaduan, PengaduanStatus } from "@/types/pengaduanTypes";

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

// helper normalisasi status (ANTI BUG CASE)
const normalizeStatus = (status: string): PengaduanStatus => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "Pending";
    case "proses":
    case "diproses":
      return "Proses";
    case "selesai":
      return "Selesai";
    case "ditolak":
      return "Ditolak";
    default:
      return "Pending";
  }
};

export const getPengaduan = async (
  params: GetPengaduanParams,
): Promise<PengaduanApiResponse> => {
  try {
    const response = await api.get("/v1/pengaduan", {
      params,
    });
    const rawData = response?.data?.data;

    if (!rawData.data) {
      throw new Error("Response backend tidak valid.");
    }

    const transformed: Pengaduan[] = rawData.data.map((item: any) => ({
      kode_pengaduan: item.kode_pengaduan,
      judul: item.judul,
      deskripsi: item.deskripsi,
      lokasi: item.lokasi,
      status: normalizeStatus(item.status),
      tanggal_pengaduan: item.tanggal_pengaduan,
    }));

    return {
      data: transformed,
      current_page: rawData.current_page,
      last_page: rawData.last_page,
    };
  } catch (error: any) {
    console.error("Error fetching pengaduan:", error);

    const respData = error.response?.data;
    throw new Error(respData?.message || "Gagal mengambil data pengaduan.");
  }
};

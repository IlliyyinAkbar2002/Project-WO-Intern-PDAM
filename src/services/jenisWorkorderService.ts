import { api } from "@/lib/api";
import {
  JenisWorkorder,
  JenisWorkorderResponse,
} from "@/types/jenisWorkorderTypes";

// =========================================================
// GET ALL JENIS WORKORDER
// =========================================================
export const getJenisWorkorders = async (
  page: number,
  limit: number,
  search = "",
  sort = "desc",
  all = false,
): Promise<JenisWorkorderResponse> => {
  try {
    const response = await api.get("/v1/jenis-workorder", {
      params: {
        page,
        limit,
        search,
        sort,
        all,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Get jenis workorders error:", error);
    throw new Error(
      error.response?.data?.message || "Gagal mengambil data jenis workorder",
    );
  }
};

// =========================================================
// GET DETAIL JENIS WORKORDER
// =========================================================
export const getJenisWorkorderById = async (
  id: number,
): Promise<JenisWorkorder> => {
  try {
    const response = await api.get(`/v1/jenis-workorder/${id}`);
    // unwrap data
    return response.data.data;
  } catch (error: any) {
    console.error("Get jenis workorder detail error:", error);
    throw new Error(
      error.response?.data?.message || "Gagal mengambil detail jenis workorder",
    );
  }
};

// =========================================================
// UPDATE STATUS
// =========================================================
export const updateJenisWorkorderStatus = async (
  id: number,
  isActive: boolean,
): Promise<JenisWorkorder> => {
  try {
    const payload = {
      is_active: isActive,
    };

    const response = await api.patch(
      `/v1/jenis-workorder/${id}/status`,
      payload,
    );

    // unwrap data
    return response.data.data;
  } catch (error: any) {
    console.error("Update jenis workorder status error:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "Gagal mengubah status jenis workorder",
    );
  }
};

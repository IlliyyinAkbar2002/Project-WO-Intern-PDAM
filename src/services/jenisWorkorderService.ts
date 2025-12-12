import { api, ensureCsrfToken } from "@/lib/api";
import {
  JenisWorkorder,
  JenisWorkorderPayload,
  JenisWorkorderResponse,
} from "@/types";
import { toSnakeCase } from "@/utils/caseFormatter";
import { cleanJenisWorkorder } from "@/utils/cleanFormData";

export const getJenisWorkorders = async (
  page?: number,
  limit?: number,
  search?: string,
  sort?: string,
  all?: boolean
): Promise<JenisWorkorderResponse> => {
  try {
    const params: Record<string, any> = {};
    if (all) {
      params.all = true;
    } else {
      if (page !== undefined) params.page = page;
      if (limit !== undefined) params.limit = limit;
    }
    if (search) params.search = search;
    if (sort) params.sort = sort;

    const response = await api.get<any>("/v1/jenis-workorder", { params });
    const convertedData = response.data.data.map((item: any) =>
      cleanJenisWorkorder(item)
    );

    return {
      data: convertedData,
      totalPages: response.data.totalPages,
      currentPage: response.data.currentPage,
    };
  } catch (error) {
    console.error("Error fetching jenis workorders:", error);
    return { data: [], totalPages: 0, currentPage: 0 };
  }
};

export const getJenisWorkorderById = async (
  id: number
): Promise<JenisWorkorder> => {
  try {
    const response = await api.get<JenisWorkorder>(`/v1/jenis-workorder/${id}`);
    return cleanJenisWorkorder(response.data);
  } catch {
    throw new Error(`Gagal mengambil jenis workorder dengan ID ${id}.`);
  }
};

// ✅ Revisi: gunakan JenisWorkorderPayload, bukan JenisWorkorder penuh
export const createJenisWorkorder = async (
  data: JenisWorkorderPayload
): Promise<JenisWorkorder> => {
  try {
    await ensureCsrfToken();
    const formattedData = toSnakeCase(data);
    const response = await api.post<any>("/v1/jenis-workorder", formattedData);
    return cleanJenisWorkorder(response.data.data);
  } catch (error: any) {
    console.error("Create error:", error);
    if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors;
      const errorMessages = Object.values(validationErrors).flat().join(", ");
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Gagal menambah jenis workorder."
    );
  }
};

export const updateJenisWorkorder = async (
  id: number,
  data: JenisWorkorderPayload
): Promise<JenisWorkorder> => {
  try {
    const formattedData = toSnakeCase(data);
    const response = await api.put<any>(
      `/v1/jenis-workorder/${id}`,
      formattedData
    );
    return cleanJenisWorkorder(response.data.data);
  } catch (error: any) {
    console.error("Update error:", error);
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Gagal memperbarui jenis workorder."
    );
  }
};

export const deleteJenisWorkorder = async (id: number): Promise<void> => {
  try {
    await api.delete(`/v1/jenis-workorder/${id}`);
  } catch (error: any) {
    console.error("Delete error:", error);
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Gagal menghapus jenis workorder."
    );
  }
};

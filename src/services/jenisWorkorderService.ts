import { api } from "@/lib/api";
import { JenisWorkorder, JenisWorkorderResponse } from "@/types";
import { toCamelCase, toSnakeCase } from "@/utils/caseFormatter";
import { cleanFormData } from "@/utils/cleanFormData";

export const getJenisWorkorders = async (page?: number, limit?: number, search?: string, sort?: string, all?: boolean): Promise<JenisWorkorderResponse> => {
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

    const response = await api.get<JenisWorkorderResponse>("/jenis-workorder", { params });
    return toCamelCase(response.data);
  } catch (error) {
    return { data: [], totalPages: 0, currentPage: 0 };
  }
};

export const getJenisWorkorderById = async (id: number): Promise<JenisWorkorder> => {
  try {
    const response = await api.get<JenisWorkorder>(`/jenis-workorder/${id}`);
    return cleanFormData(response.data);
  } catch (error) {
    throw new Error(`Gagal mengambil jenis workorder dengan ID ${id}.`);
  }
};

export const createJenisWorkorder = async (data: JenisWorkorder): Promise<JenisWorkorder> => {
  try {
    const formattedData = toSnakeCase(data);
    const response = await api.post<JenisWorkorder>("/jenis-workorder", formattedData);
    return response.data;
  } catch (error) {
    throw new Error("Gagal menambah jenis workorder.");
  }
};

export const updateJenisWorkorder = async (id: number, data: JenisWorkorder): Promise<JenisWorkorder> => {
  try {
    const formattedData = toSnakeCase(data);
    const response = await api.put<JenisWorkorder>(`/jenis-workorder/${id}`, formattedData);
    return response.data;
  } catch (error) {
    throw new Error("Gagal memperbarui jenis workorder.");
  }
};

export const deleteJenisWorkorder = async (id: number): Promise<void> => {
  try {
    await api.delete(`/jenis-workorder/${id}`);
  } catch (error: any) {
    // Enhanced error handling with specific error messages
    if (error.response?.status === 404) {
      throw new Error("Endpoint delete belum tersedia di backend API. Silakan hubungi developer backend untuk implementasi DELETE /api/jenis-workorder/{id}");
    } else if (error.response?.status === 500) {
      throw new Error("Terjadi kesalahan server saat menghapus data");
    } else if (error.response?.status === 403) {
      throw new Error("Anda tidak memiliki izin untuk menghapus data ini");
    } else {
      throw new Error(`Gagal menghapus jenis workorder: ${error.response?.data?.message || error.message}`);
    }
  }
};
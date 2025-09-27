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

    const response = await api.get<any>("/jenis-workorder", { params });

    // Convert each item using cleanFormData for consistency
    const convertedData = response.data.data.map((item: any) => cleanFormData(item));

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
    const response = await api.post<any>("/jenis-workorder", formattedData);
    return cleanFormData(response.data.data);
  } catch (error: any) {
    console.error("Create error:", error);
    const errorMessage = error.response?.data?.message || error.response?.data?.error || "Gagal menambah jenis workorder.";
    throw new Error(errorMessage);
  }
};

export const updateJenisWorkorder = async (id: number, data: JenisWorkorder): Promise<JenisWorkorder> => {
  try {
    const formattedData = toSnakeCase(data);
    const response = await api.put<any>(`/jenis-workorder/${id}`, formattedData);
    return cleanFormData(response.data.data);
  } catch (error: any) {
    console.error("Update error:", error);
    const errorMessage = error.response?.data?.message || error.response?.data?.error || "Gagal memperbarui jenis workorder.";
    throw new Error(errorMessage);
  }
};

export const deleteJenisWorkorder = async (id: number): Promise<void> => {
  try {
    await api.delete(`/jenis-workorder/${id}`);
  } catch (error: any) {
    console.error("Delete error:", error);
    // Enhanced error handling with specific error messages
    if (error.response?.status === 404) {
      throw new Error("Data jenis workorder tidak ditemukan");
    } else if (error.response?.status === 500) {
      throw new Error("Terjadi kesalahan server saat menghapus data");
    } else if (error.response?.status === 403) {
      throw new Error("Anda tidak memiliki izin untuk menghapus data ini");
    } else {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      throw new Error(`Gagal menghapus jenis workorder: ${errorMessage}`);
    }
  }
};
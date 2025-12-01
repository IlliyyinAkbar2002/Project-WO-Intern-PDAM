import { api, ensureCsrfToken } from "@/lib/api";
import { JenisWorkorder, JenisWorkorderResponse } from "@/types";
import { toCamelCase, toSnakeCase } from "@/utils/caseFormatter";
import { cleanFormData } from "@/utils/cleanFormData";

const sanitizeJenisWorkorderPayload = (
  data: JenisWorkorder
): Record<string, any> => {
  const payload: Record<string, any> = {
    ...data,
    detailForm: (data.detailForm || []).map((detail, detailIndex) => {
      const sanitizedDetail: Record<string, any> = {
        ...detail,
        order: detail.order ?? detailIndex + 1,
      };

      sanitizedDetail.parent = detail.parent ?? 0;

      if (!detail.id || detail.id <= 0) {
        delete sanitizedDetail.id;
      }

      sanitizedDetail.optionForm = (detail.optionForm || [])
        .filter((option) => option.namaOpsi?.trim())
        .map((option, optionIndex) => {
          const sanitizedOption: Record<string, any> = {
            ...option,
            order: option.order ?? optionIndex + 1,
            parent: option.parent ?? 0,
          };

          if (!option.id || option.id <= 0) {
            delete sanitizedOption.id;
          }

          delete sanitizedOption.namaParent;

          return sanitizedOption;
        });

      return sanitizedDetail;
    }),
  };

  if (!data.id || data.id <= 0) {
    delete payload.id;
  }

  return payload;
};

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

    // Convert each item using cleanFormData for consistency
    const convertedData = response.data.data.map((item: any) =>
      cleanFormData(item)
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
    return cleanFormData(response.data);
  } catch (error) {
    throw new Error(`Gagal mengambil jenis workorder dengan ID ${id}.`);
  }
};

export const createJenisWorkorder = async (
  data: JenisWorkorder
): Promise<JenisWorkorder> => {
  try {
    // Ensure CSRF token is obtained before making the request
    await ensureCsrfToken();

    const sanitizedData = sanitizeJenisWorkorderPayload(data);
    const formattedData = toSnakeCase(sanitizedData);

    console.log("Sending data to API:", formattedData);

    const response = await api.post<any>("/v1/jenis-workorder", formattedData);
    return cleanFormData(response.data.data);
  } catch (error: any) {
    console.error("Create error:", error);
    console.error("Error response:", error.response?.data);

    // Better error handling
    if (error.response?.status === 419) {
      throw new Error(
        "CSRF token mismatch. Please refresh the page and try again."
      );
    } else if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors;
      const errorMessages = Object.values(validationErrors).flat().join(", ");
      throw new Error(`Validation failed: ${errorMessages}`);
    }

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Gagal menambah jenis workorder.";
    throw new Error(errorMessage);
  }
};

export const updateJenisWorkorder = async (
  id: number,
  data: JenisWorkorder
): Promise<JenisWorkorder> => {
  try {
    const sanitizedData = sanitizeJenisWorkorderPayload(data);
    const formattedData = toSnakeCase(sanitizedData);
    const response = await api.put<any>(
      `/v1/jenis-workorder/${id}`,
      formattedData
    );
    return cleanFormData(response.data.data);
  } catch (error: any) {
    console.error("Update error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Gagal memperbarui jenis workorder.";
    throw new Error(errorMessage);
  }
};

export const deleteJenisWorkorder = async (id: number): Promise<void> => {
  try {
    await api.delete(`/v1/jenis-workorder/${id}`);
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
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
      throw new Error(`Gagal menghapus jenis workorder: ${errorMessage}`);
    }
  }
};

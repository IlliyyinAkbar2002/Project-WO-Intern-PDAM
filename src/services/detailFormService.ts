import { api, ensureCsrfToken } from "@/lib/api";
import { DetailForm } from "@/types";
import { toSnakeCase } from "@/utils/caseFormatter";
import { cleanDetailForm } from "@/utils/cleanFormData";

export const getDetailForms = async (
  jenisWorkorderId: number
): Promise<DetailForm[]> => {
  try {
    const response = await api.get<any>(
      `/v1/jenis-workorder/${jenisWorkorderId}/detail-form`
    );
    const items = response.data?.data ?? response.data;
    return (items || []).map((item: any) => cleanDetailForm(item));
  } catch (error: any) {
    console.error("Error fetching detail forms:", error);
    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Gagal mengambil detail form."
    );
  }
};

export const getDetailFormById = async (
  jenisWorkorderId: number,
  id: number
): Promise<DetailForm> => {
  try {
    const response = await api.get<any>(
      `/v1/jenis-workorder/${jenisWorkorderId}/detail-form/${id}`
    );
    const raw = response.data?.data ?? response.data;
    return cleanDetailForm(raw);
  } catch (error: any) {
    console.error("Error fetching detail form by id:", error);
    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Gagal mengambil detail form."
    );
  }
};

export const createDetailForm = async (
  jenisWorkorderId: number,
  data: DetailForm
): Promise<DetailForm> => {
  try {
    await ensureCsrfToken();
    const formattedData = toSnakeCase(data);
    const response = await api.post<any>(
      `/v1/jenis-workorder/${jenisWorkorderId}/detail-form`,
      formattedData
    );
    const raw = response.data?.data ?? response.data;
    return cleanDetailForm(raw);
  } catch (error: any) {
    console.error("Create detail form error:", error);
    if (error.response?.status === 422) {
      const validationErrors = error.response.data?.errors;
      if (validationErrors) {
        const errorMessages = Object.values(validationErrors).flat().join(", ");
        throw new Error(`Validation failed: ${errorMessages}`);
      }
    }
    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Gagal menambah detail form."
    );
  }
};

export const updateDetailForm = async (
  jenisWorkorderId: number,
  id: number,
  data: DetailForm
): Promise<DetailForm> => {
  try {
    const formattedData = toSnakeCase(data);
    const response = await api.put<any>(
      `/v1/jenis-workorder/${jenisWorkorderId}/detail-form/${id}`,
      formattedData
    );
    const raw = response.data?.data ?? response.data;
    return cleanDetailForm(raw);
  } catch (error: any) {
    console.error("Update detail form error:", error);
    if (error.response?.status === 422) {
      const validationErrors = error.response.data?.errors;
      if (validationErrors) {
        const errorMessages = Object.values(validationErrors).flat().join(", ");
        throw new Error(`Validation failed: ${errorMessages}`);
      }
    }
    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Gagal memperbarui detail form."
    );
  }
};

export const deleteDetailForm = async (
  jenisWorkorderId: number,
  id: number
): Promise<void> => {
  try {
    await api.delete(
      `/v1/jenis-workorder/${jenisWorkorderId}/detail-form/${id}`
    );
  } catch (error: any) {
    console.error("Delete detail form error:", error);
    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Gagal menghapus detail form."
    );
  }
};

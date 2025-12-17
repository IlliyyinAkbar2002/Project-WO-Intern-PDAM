import { api, ensureCsrfToken } from "@/lib/api";
import { FormWorkorder } from "@/types";
import { toSnakeCase } from "@/utils/caseFormatter";
import { cleanFormWorkorder } from "@/utils/cleanFormData";

export const getFormWorkorders = async (
  jenisWorkorderId: number
): Promise<FormWorkorder[]> => {
  try {
    const response = await api.get<any>(
      `/v1/jenis-workorder/${jenisWorkorderId}/form-workorder`
    );
    const items = response.data?.data ?? response.data;
    return (items || []).map((item: any) => cleanFormWorkorder(item));
  } catch (error: any) {
    console.error("Error fetching form workorders:", error);
    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Gagal mengambil form workorder."
    );
  }
};

export const getFormWorkorderById = async (
  jenisWorkorderId: number,
  id: number
): Promise<FormWorkorder> => {
  try {
    const response = await api.get<any>(
      `/v1/jenis-workorder/${jenisWorkorderId}/form-workorder/${id}`
    );
    const raw = response.data?.data ?? response.data;
    return cleanFormWorkorder(raw);
  } catch (error: any) {
    console.error("Error fetching form workorder by id:", error);
    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Gagal mengambil form workorder."
    );
  }
};

export const createFormWorkorder = async (
  jenisWorkorderId: number,
  data: FormWorkorder
): Promise<FormWorkorder> => {
  try {
    await ensureCsrfToken();
    const formattedData = toSnakeCase(data);
    const response = await api.post<any>(
      `/v1/jenis-workorder/${jenisWorkorderId}/form-workorder`,
      formattedData
    );
    const raw = response.data?.data ?? response.data;
    return cleanFormWorkorder(raw);
  } catch (error: any) {
    console.error("Create form workorder error:", error);
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
      "Gagal menambah form workorder."
    );
  }
};

export const updateFormWorkorder = async (
  jenisWorkorderId: number,
  id: number,
  data: FormWorkorder
): Promise<FormWorkorder> => {
  try {
    const formattedData = toSnakeCase(data);
    const response = await api.put<any>(
      `/v1/jenis-workorder/${jenisWorkorderId}/form-workorder/${id}`,
      formattedData
    );
    const raw = response.data?.data ?? response.data;
    return cleanFormWorkorder(raw);
  } catch (error: any) {
    console.error("Update form workorder error:", error);
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
      "Gagal memperbarui form workorder."
    );
  }
};

export const deleteFormWorkorder = async (
  jenisWorkorderId: number,
  id: number
): Promise<void> => {
  try {
    await api.delete(
      `/v1/jenis-workorder/${jenisWorkorderId}/form-workorder/${id}`
    );
  } catch (error: any) {
    console.error("Delete form workorder error:", error);
    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Gagal menghapus form workorder."
    );
  }
};

// Backward compatibility aliases (akan dihapus nanti)
export const getDetailForms = getFormWorkorders;
export const getDetailFormById = getFormWorkorderById;
export const createDetailForm = createFormWorkorder;
export const updateDetailForm = updateFormWorkorder;
export const deleteDetailForm = deleteFormWorkorder;

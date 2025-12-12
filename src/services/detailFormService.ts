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
    return response.data.map((item: any) => cleanDetailForm(item));
  } catch {
    throw new Error("Gagal mengambil detail form.");
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
    return cleanDetailForm(response.data);
  } catch {
    throw new Error("Gagal mengambil detail form.");
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
    return cleanDetailForm(response.data.data);
  } catch {
    throw new Error("Gagal menambah detail form.");
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
    return cleanDetailForm(response.data.data);
  } catch {
    throw new Error("Gagal memperbarui detail form.");
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
  } catch {
    throw new Error("Gagal menghapus detail form.");
  }
};

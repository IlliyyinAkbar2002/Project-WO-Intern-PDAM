import { api, ensureCsrfToken } from "@/lib/api";
import { DetailForm } from "@/types";
import { toSnakeCase } from "@/utils/caseFormatter";
import { cleanDetailForm } from "@/utils/cleanFormData";

// Endpoint baru: /form-workorder/{formWorkorderId}/detail-form
export const createDetailForm = async (
  jenisWorkorderId: number,
  formWorkorderId: number,
  data: DetailForm
): Promise<DetailForm> => {
  await ensureCsrfToken();
  const formattedData = toSnakeCase(data);
  const response = await api.post<any>(
    `/v1/jenis-workorder/${jenisWorkorderId}/form-workorder/${formWorkorderId}/detail-form`,
    formattedData
  );
  return cleanDetailForm(response.data.data);
};

export const getDetailForms = async (
  jenisWorkorderId: number,
  formWorkorderId: number
): Promise<DetailForm[]> => {
  try {
    const response = await api.get<any>(
      `/v1/jenis-workorder/${jenisWorkorderId}/form-workorder/${formWorkorderId}/detail-form`
    );
    const items = response.data?.data ?? response.data;
    return (items || []).map((item: any) => cleanDetailForm(item));
  } catch {
    throw new Error("Gagal mengambil detail form.");
  }
};

export const updateDetailForm = async (
  jenisWorkorderId: number,
  formWorkorderId: number,
  id: number,
  data: DetailForm
): Promise<DetailForm> => {
  await ensureCsrfToken();
  const formattedData = toSnakeCase(data);
  const response = await api.put<any>(
    `/v1/jenis-workorder/${jenisWorkorderId}/form-workorder/${formWorkorderId}/detail-form/${id}`,
    formattedData
  );
  return cleanDetailForm(response.data.data);
};

export const deleteDetailForm = async (
  jenisWorkorderId: number,
  formWorkorderId: number,
  id: number
): Promise<void> => {
  await api.delete(
    `/v1/jenis-workorder/${jenisWorkorderId}/form-workorder/${formWorkorderId}/detail-form/${id}`
  );
};

// Backward compatibility aliases (akan dihapus nanti)
export const createOptionForm = createDetailForm;
export const getOptionForms = getDetailForms;
export const updateOptionForm = updateDetailForm;
export const deleteOptionForm = deleteDetailForm;

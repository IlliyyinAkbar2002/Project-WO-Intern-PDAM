import { api, ensureCsrfToken } from "@/lib/api";
import { OptionForm } from "@/types";
import { toSnakeCase } from "@/utils/caseFormatter";
import { cleanOptionForm } from "@/utils/cleanFormData";

export const createOptionForm = async (
  jenisWorkorderId: number,
  detailFormId: number,
  data: OptionForm
): Promise<OptionForm> => {
  await ensureCsrfToken();
  const formattedData = toSnakeCase(data);
  const response = await api.post<any>(
    `/v1/jenis-workorder/${jenisWorkorderId}/detail-form/${detailFormId}/option-form`,
    formattedData
  );
  return cleanOptionForm(response.data.data);
};

export const getOptionForms = async (
  jenisWorkorderId: number,
  detailFormId: number
): Promise<OptionForm[]> => {
  try {
    const response = await api.get<any>(
      `/v1/jenis-workorder/${jenisWorkorderId}/detail-form/${detailFormId}/option-form`
    );
    const items = response.data?.data ?? response.data;
    return (items || []).map((item: any) => cleanOptionForm(item));
  } catch {
    throw new Error("Gagal mengambil option form.");
  }
};

export const updateOptionForm = async (
  jenisWorkorderId: number,
  detailFormId: number,
  id: number,
  data: OptionForm
): Promise<OptionForm> => {
  await ensureCsrfToken();
  const formattedData = toSnakeCase(data);
  const response = await api.put<any>(
    `/v1/jenis-workorder/${jenisWorkorderId}/detail-form/${detailFormId}/option-form/${id}`,
    formattedData
  );
  return cleanOptionForm(response.data.data);
};

export const deleteOptionForm = async (
  jenisWorkorderId: number,
  detailFormId: number,
  id: number
): Promise<void> => {
  await api.delete(
    `/v1/jenis-workorder/${jenisWorkorderId}/detail-form/${detailFormId}/option-form/${id}`
  );
};

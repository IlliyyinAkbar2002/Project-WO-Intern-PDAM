import { format } from "date-fns";
import { api } from "@/lib/api";
import {
  Workorder,
  WorkorderInput,
  WorkorderResponse,
} from "@/types/workorderTypes";
import { toCamelCase, toSnakeCase } from "@/utils/caseFormatter";

interface GetWorkorderParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  prioritas?: string;
  departemenId?: number;
}

// =========================================================
// ERROR HANDLER
// =========================================================
const handleApiError = (error: unknown, defaultMessage: string): never => {
  console.error(defaultMessage, error);

  const err = error as any;

  if (err.response?.status === 422) {
    const validationErrors = err.response.data?.errors;
    if (validationErrors) {
      const errorMessages = Object.values(validationErrors).flat().join(", ");

      throw new Error(errorMessages);
    }
  }
  throw new Error(
    err.response?.data?.message || err.response?.data?.error || defaultMessage,
  );
};

// =========================================================
// GET LIST
// =========================================================
export const getWorkorders = async (
  params: GetWorkorderParams = {},
): Promise<WorkorderResponse> => {
  try {
    const response = await api.get("/v1/workorder", {
      params: toSnakeCase(params),
    });
    const data = toCamelCase(response.data);
    return {
      ...data,
      data: data.data.map(mapWorkorder),
    };
  } catch (error) {
    throw handleApiError(error, "Gagal mengambil data workorder.");
  }
};

// =========================================================
// GET DETAIL
// =========================================================
export const getWorkorderById = async (id: string): Promise<Workorder> => {
  try {
    const response = await api.get(`/v1/workorder/${id}`);
    const data = toCamelCase(response.data.data);
    return mapWorkorder(data);
  } catch (error) {
    throw handleApiError(error, "Gagal mengambil detail workorder.");
  }
};

// =========================================================
// CREATE
// =========================================================
export const createWorkorder = async (data: WorkorderInput) => {
  try {
    const response = await api.post("/v1/workorder", toSnakeCase(data));

    return toCamelCase(response.data);
  } catch (error) {
    throw handleApiError(error, "Gagal menambah workorder.");
  }
};

// =========================================================
// UPDATE
// =========================================================
export const updateWorkorder = async (
  id: string,
  data: Partial<WorkorderInput>,
) => {
  try {
    const response = await api.put(`/v1/workorder/${id}`, toSnakeCase(data));

    return toCamelCase(response.data);
  } catch (error) {
    throw handleApiError(error, "Gagal memperbarui workorder.");
  }
};

// =========================================================
// UPDATE STATUS
// =========================================================
export const updateWorkorderStatus = async (id: string, status: string) => {
  try {
    const response = await api.patch(`/v1/workorder/${id}`, { status });

    return toCamelCase(response.data);
  } catch (error) {
    throw handleApiError(error, "Gagal memperbarui status workorder.");
  }
};

// =========================================================
// DELETE
// =========================================================
export const deleteWorkorder = async (id: number) => {
  try {
    const response = await api.delete(`/v1/workorder/${id}`);

    return toCamelCase(response.data);
  } catch (error) {
    throw handleApiError(error, "Gagal menghapus workorder.");
  }
};

// =========================================================
// GET KPI
// =========================================================
export const getWorkorderKPI = async () => {
  try {
    const response = await api.get("/v1/kpi");
    return toCamelCase(response.data);
  } catch (error) {
    throw handleApiError(error, "Gagal mengambil KPI workorder.");
  }
};

// =========================================================
// OPTIONAL ACTIONS
// =========================================================
export const extendWorkorder = async (
  workorderId: number,
  actionId: number,
  date: string,
) => {
  try {
    const waktuMulai = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    const response = await api.post("/v1/workorder-action", {
      workorder_id: workorderId,
      action_id: actionId,
      waktu_mulai: waktuMulai,
      estimasi_selesai: date,
    });
    return toCamelCase(response.data);
  } catch (error) {
    throw handleApiError(error, "Gagal memperpanjang workorder.");
  }
};

export const delayWorkorder = async (
  workorderId: number,
  actionId: number,
  reason: string,
) => {
  try {
    const waktuMulai = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const response = await api.post("/v1/workorder-action", {
      workorder_id: workorderId,
      action_id: actionId,
      keterangan: reason,
      waktu_mulai: waktuMulai,
    });
    return toCamelCase(response.data);
  } catch (error) {
    throw handleApiError(error, "Gagal menunda workorder.");
  }
};

export const resumeWorkorder = async (
  workorderId: number,
  actionId: number,
) => {
  try {
    const waktuMulai = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const response = await api.post("/v1/workorder-action", {
      workorder_id: workorderId,
      action_id: actionId,
      waktu_mulai: waktuMulai,
    });
    return toCamelCase(response.data);
  } catch (error) {
    throw handleApiError(error, "Gagal melanjutkan workorder.");
  }
};

const mapWorkorder = (data: any): Workorder => {
  return {
    ...data,

    assignedTo:
      typeof data.assignedTo === "object"
        ? data.assignedTo?.id
        : (data.assignedTo ?? 0),

    assignedToName:
      typeof data.assignedTo === "object"
        ? data.assignedTo?.nama
        : (data.assignedToUser?.pegawai?.nama ?? "-"),
  };
};

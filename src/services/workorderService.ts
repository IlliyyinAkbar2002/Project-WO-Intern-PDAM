import { api } from "@/lib/api";
import { Workorder, WorkorderInput, WorkorderResponse } from "@/types";
import { toCamelCase, toSnakeCase } from "@/utils/caseFormatter";
import { format } from "date-fns";

export const getWorkorders = async (type: number, page: number, limit: number, search: string): Promise<WorkorderResponse> => {
  try {
    const response = await api.get<WorkorderResponse>("/workorder", {
      params: {
        type,
        page,
        limit,
        search,
      },
    });
    return toCamelCase(response.data);
  } catch (error) {
    return { data: [], totalPages: 0, currentPage: 0 };
  }
};

export const createWorkorder = async (data: WorkorderInput) => {
  try {
    const formattedData = toSnakeCase(data);
    const response = await api.post("/workorder", formattedData);
    return response.data;
  } catch (error) {
    throw new Error("Gagal menambah workorder.");
  }
};

export const getWorkorderById = async (id: string): Promise<Workorder> => {
  try {
    const response = await api.get<Workorder>(`/workorder/${id}`);
    return toCamelCase(response.data);
  } catch (error) {
    throw new Error("Gagal mengambil detail workorder.");
  }
}

export const updateWorkorderStatus = async (id: string, statusId: number) => {
  try {
    const response = await api.patch(`/workorder/${id}`, { status_id: statusId, });
    return response.data;
  } catch (error) {
    throw new Error("Gagal memperbarui workorder.");
  }
};

export const extendWorkorder = async (workorderId: number, actionId: number, date: string) => {
  try {
    const waktuMulai = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const response = await api.post("/workorder-action",
      { workorder_id: workorderId, action_id: actionId, waktu_mulai: waktuMulai, estimasi_selesai: date }
    );
    return response.data;
  } catch (error) {
    throw new Error("Gagal memperbarui workorder.");
  }
};

export const delayWorkorder = async (workorderId: number, actionId: number, reason: string) => {
  try {
    const waktuMulai = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const response = await api.post("/workorder-action",
      { workorder_id: workorderId, action_id: actionId, keterangan: reason, waktu_mulai: waktuMulai }
    );
    return response.data;
  } catch (error) {
    throw new Error("Gagal memperbarui workorder.");
  }
};

export const resumeWorkorder = async (workorderId: number, actionId: number) => {
  try {
    const waktuMulai = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const response = await api.post("/workorder-action",
      { workorder_id: workorderId, action_id: actionId, waktu_mulai: waktuMulai }
    );
    return response.data;
  } catch (error) {
    throw new Error("Gagal memperbarui workorder.");
  }
};

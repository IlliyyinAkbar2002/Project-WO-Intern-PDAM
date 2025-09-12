import { api } from "@/lib/api";
import { ProgressWorkorder } from "@/types/progressWorkorderTypes";
import { toCamelCase } from "@/utils/caseFormatter";

export const getProgressWorkorders = async (workorderId: string): Promise<ProgressWorkorder[]> => {
  try {
    const response = await api.get("/progress-workorder", {
      params: {
        workorder_id: workorderId,
      },
    });
    return toCamelCase(response.data);
  } catch (error) {
    throw new Error("Gagal mengambil progress workorder.");
  }
};

export const getProgressWorkorderById = async (id: string): Promise<ProgressWorkorder> => {
  try {
    const response = await api.get(`/progress-workorder/${id}`);
    return toCamelCase(response.data);
  } catch (error) {
    throw new Error("Gagal mengambil detail progress workorder.");
  }
}

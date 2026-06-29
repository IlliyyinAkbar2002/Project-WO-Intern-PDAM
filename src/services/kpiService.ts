import { api } from "@/lib/api";
import { KpiResponse } from "@/types/kpiTypes";

export const getKpi = async (): Promise<KpiResponse[]> => {
  try {
    const response = await api.get<KpiResponse[]>("/v1/kpi");
    return response.data;
  } catch (error) {
    console.error("KPI API Error:", error);

    if (error instanceof Error) {
      throw new Error(`Gagal mengambil data KPI: ${error.message}`);
    }

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as any;
      const status = axiosError.response?.status;
      const message = axiosError.response?.data?.message || axiosError.message;
      throw new Error(`Gagal mengambil data KPI (${status}): ${message}`);
    }

    throw new Error("Gagal mengambil data KPI: Unknown error");
  }
};

import { api } from "@/lib/api";
import { Kpi } from "@/types/kpiTypes";

export const getKpi = async (): Promise<Kpi[]> => {
  try {
    const response = await api.get<Kpi[]>("/v1/kpi");

    // Log the response for debugging
    console.log("KPI API Response:", {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });

    // Check if status is 202 (Accepted) and handle accordingly
    if (response.status === 202) {
      console.warn(
        "API returned 202 (Accepted) - processing may not be complete"
      );
    }

    return response.data;
  } catch (error) {
    console.error("KPI API Error:", error);

    if (error instanceof Error) {
      throw new Error(`Gagal mengambil data KPI: ${error.message}`);
    }

    // Handle axios errors specifically
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as any;
      const status = axiosError.response?.status;
      const message = axiosError.response?.data?.message || axiosError.message;
      throw new Error(`Gagal mengambil data KPI (${status}): ${message}`);
    }

    throw new Error("Gagal mengambil data KPI: Unknown error");
  }
};

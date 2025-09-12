import { api } from "@/lib/api";
import { MasterLocation } from "@/types/masterLocationTypes";
import { toCamelCase, toSnakeCase } from "@/utils/caseFormatter";

export const getLocations = async (): Promise<MasterLocation[]>=>{
  try {
    const response = await api.get<MasterLocation[]>("/master-location");
    return toCamelCase(response.data);
  } catch (error) {
    throw new Error("Gagal mengambil data lokasi.");
  }
}

export const updateLocationById = async (id: string, data: MasterLocation): Promise<MasterLocation> => {
  try {
    const formattedData = toSnakeCase(data);
    const response = await api.patch<MasterLocation>(`/master-location/${id}`, formattedData);
    return toCamelCase(response.data);
  } catch (error) {
    throw new Error("Gagal memperbarui lokasi.");
  }
}
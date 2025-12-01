import { api } from "@/lib/api";
import { MasterLocation } from "@/types/masterLocationTypes";
import { toCamelCase, toSnakeCase } from "@/utils/caseFormatter";
// import { MasterLocation } from "@/types/";

export const getLocations = async (): Promise<MasterLocation[]> => {
  try {
    const response = await api.get("/v1/master-location");
    const payload = response.data as any;

    const list = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.master_locations)
      ? payload.master_locations
      : [];

    return toCamelCase(list) as MasterLocation[];
  } catch (error) {
    console.error("getLocations error:", error);
    throw new Error("Gagal mengambil data lokasi.");
  }
};

export const updateLocationById = async (
  id: string,
  data: Partial<MasterLocation>
): Promise<MasterLocation> => {
  try {
    const payload = toSnakeCase(data);
    const response = await api.patch(`/v1/master-location/${id}`, payload);
    const body = response.data as any;
    const updated = body?.data ?? body; // Laravel wraps payload in data
    return toCamelCase(updated) as MasterLocation;
  } catch (error) {
    console.error("updateLocationById error:", error);
    throw new Error("Gagal memperbarui lokasi.");
  }
};

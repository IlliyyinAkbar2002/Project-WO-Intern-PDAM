import { api, ensureCsrfToken } from "@/lib/api";
import { Material } from "@/types/materialTypes";

export interface CreateMaterialPayload {
  kode_material: number;
  nama: string;
  jumlah_stok: number;
}

export const createMaterial = async (data: any) => {
  try {
    const response = await api.post("/v1/material", data);

    if (!response?.data?.material) {
      throw new Error("Response backend tidak valid.");
    }
    return response.data.material;
  } catch (error: any) {
    console.error("Failed to create material:", error);

    const respData = error.response?.data;

    if (respData?.errors) {
      const errorMessages = Object.values(respData.errors).flat().join(", ");
      throw new Error(errorMessages);
    }
    throw new Error(respData?.message || "Gagal menambahkan data material.");
  }
};

export const generateMaterialCode = async () => {
  const response = await api.get("/v1/material/generate-code");
  return response.data.kode_material;
};

export const getMaterials = async (): Promise<Material[]> => {
  try {
    const response = await api.get("/v1/material");

    if (!response?.data) return [];

    return response.data;
  } catch (error) {
    console.error("Error fetching materials:", error);
    throw new Error("Gagal mengambil data material.");
  }
};

export const getMaterialById = async (id: number) => {
  const res = await api.get(`/v1/material/${id}`);
  return res.data.data;
};

export const editMaterial = async (
  id: number,
  data: { nama: string; jumlah_stok: number },
) => {
  const res = await api.put(`/v1/material/${id}/edit`, data);
  return res.data.data;
};

export const updatePemakaian = async (id: number, jumlah_pakai: number) => {
  const res = await api.patch(`/v1/material/${id}`, {
    jumlah_pakai,
  });
  return res.data.data;
};

export const updateMaterial = async (
  id: number,
  data: Partial<Material>,
): Promise<Material> => {
  try {
    await ensureCsrfToken();
    const response = await api.put<any>(`/v1/material/${id}`, data);
    if (!response?.data?.data) {
      throw new Error("Invalid response from server when updating material.");
    }
    return response.data.data as Material;
  } catch (error: any) {
    console.error("Error updating material:", error);
    if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors;
      const errorMessages = Object.values(validationErrors).flat().join(", ");
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    throw new Error(
      error.response?.data?.message || "Gagal memperbarui material.",
    );
  }
};

export const deleteMaterial = async (id: number) => {
  await api.delete(`/v1/material/${id}`);
};

import {
  getMaterials,
  createMaterial as createMaterialService,
  getMaterialById as getMaterialByIdService,
  updateMaterial as updateMaterialService,
  deleteMaterial as deleteMaterialService,
} from "@/services/materialService";
import { CreateMaterialPayload, Material } from "@/types/materialTypes";
import { useEffect, useState } from "react";

export function useMaterial() {
  const [data, setData] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMaterials();
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data material",
      );
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createMaterial = async (payload: CreateMaterialPayload) => {
    const created = await createMaterialService(payload);
    await fetchData();
    return created;
  };

  const updateMaterial = async (id: number, payload: Partial<Material>) => {
    try {
      const updated = await updateMaterialService(id, payload);
      await fetchData();
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const deleteMaterial = async (id: number) => {
    try {
      await deleteMaterialService(id);
      await fetchData();
    } catch (err) {
      throw err;
    }
  };

  const getMaterialById = async (id: number) => {
    try {
      return await getMaterialByIdService(id);
    } catch (err) {
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    refreshData: fetchData,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    getMaterialById,
  };
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getWorkorderById } from "@/services/workorderService";
import { Workorder } from "@/types/workorderTypes";

export function useWorkorder(id?: string) {
  const router = useRouter();
  const [data, setData] = useState<Workorder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const response = await getWorkorderById(id);

      setData(response);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal mengambil data workorder";

      setError(message);

      console.error("Fetch Workorder Error:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const refreshData = async () => {
    await fetchData();
    router.refresh();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refreshData,
  };
}

import { getWorkorderById } from "@/services/workorderService";
import { Workorder } from "@/types/workorderTypes";
import { useEffect, useState } from "react";

export function useWorkorder(id: string) {
  const [data, setData] = useState<Workorder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await getWorkorderById(id);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil data");
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refreshData: fetchData };
}
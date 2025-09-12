
import { getKpi } from "@/services/kpiService";
import { Kpi } from "@/types/kpiTypes";
import { useEffect, useState } from "react";

export function useKpi(){
  const [data, setData] =  useState<Kpi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
      try {
        const response = await getKpi();
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

  return { data, loading, error, refreshData: fetchData }
}
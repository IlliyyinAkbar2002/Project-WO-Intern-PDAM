import { useState, useEffect, useRef, useCallback } from "react";
import { JenisWorkorder } from "@/types/jenisWorkorderTypes";
import { getJenisWorkorders } from "@/services/jenisWorkorderService";

interface WorkorderCache {
  [key: string]: {
    data: JenisWorkorder[];
    totalPages: number;
    currentPage: number;
    totalData: number;
  };
}

interface UseJenisWorkorderProps {
  currentPage?: number;
  itemsPerPage?: number;
  search?: string;
  sort?: string;
  all?: boolean;
}

export const useJenisWorkorder = ({
  currentPage = 1,
  itemsPerPage = 10,
  search = "",
  sort = "desc",
  all = false,
}: UseJenisWorkorderProps) => {
  const [data, setData] = useState<JenisWorkorder[]>([]);

  const [totalPages, setTotalPages] = useState<number>(1);

  const [totalData, setTotalData] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<WorkorderCache>({});

  const cacheKey = `${currentPage}-${itemsPerPage}-${sort}-${search || "no-search"}-${all}`;

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      // Gunakan cache jika tersedia
      if (!forceRefresh && !search && cacheRef.current[cacheKey]) {
        const cached = cacheRef.current[cacheKey];

        setData(cached.data);
        setTotalPages(cached.totalPages);
        setTotalData(cached.totalData);

        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getJenisWorkorders(
          currentPage,
          itemsPerPage,
          search,
          sort,
          all,
        );

        setData(response.data);

        setTotalPages(response.totalPages);

        setTotalData(response.totalData || 0);

        if (!search) {
          cacheRef.current[cacheKey] = {
            data: response.data,
            totalPages: response.totalPages,
            currentPage: response.currentPage,
            totalData: response.totalData || 0,
          };
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal mengambil data");

        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    },

    [currentPage, itemsPerPage, search, sort, all, cacheKey],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {data, totalPages, totalData, loading, error, refreshData: fetchData,};
};

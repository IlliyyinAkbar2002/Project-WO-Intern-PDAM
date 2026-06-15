"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getPengaduan } from "@/services/pengaduanService";
import PengaduanDataContainer from "@/components/super-admin/pengaduan/PengaduanContainer";
import { Pengaduan } from "@/types/pengaduanTypes";

interface PengaduanResponseState {
  data: Pengaduan[];
  totalPages: number;
  currentPage: number;
}

export default function PengaduanDataPage() {
  const searchParams = useSearchParams();
  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "desc";
  const itemsPerPage = 10;

  // 📦 State
  const [pengaduanData, setPengaduanData] = useState<PengaduanResponseState>({
    data: [],
    totalPages: 0,
    currentPage: 1,
  });

  const [loading, setLoading] = useState(false);

  // 🔄 Fetch data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getPengaduan({
          page,
          search,
          sort,
        });

        setPengaduanData({
          data: res.data,
          totalPages: res.last_page,
          currentPage: res.current_page,
        });
      } catch (err) {
        console.error("Failed to fetch pengaduan:", err);
        setPengaduanData({
          data: [],
          totalPages: 0,
          currentPage: 1,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, search, sort]);

  return (
    <PengaduanDataContainer
      data={pengaduanData.data}
      totalPages={pengaduanData.totalPages}
      currentPage={pengaduanData.currentPage}
      search={search}
      sort={sort}
      itemsPerPage={itemsPerPage}
    />
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getPegawai } from "@/services/pegawaiService";
import EmployeeDataContainer from "@/components/admin/master-pegawai/employee-data/EmployeeDataContainer";
import { PegawaiResponse } from "@/types/pegawaiTypes";

export default function EmployeeDataPage() {
  const searchParams = useSearchParams();

  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "desc";
  const itemsPerPage = 10;

  const [pegawaiData, setPegawaiData] = useState<PegawaiResponse>({
    data: [],
    totalPages: 0,
    currentPage: 0,
  });

  // ✅ Fetch data di sisi client (browser)
  useEffect(() => {
    getPegawai(page, itemsPerPage, search, sort, undefined, undefined)
      .then((res) => setPegawaiData(res))
      .catch((err) => {
        console.error("Failed to fetch pegawai data:", err);
        setPegawaiData({ data: [], totalPages: 0, currentPage: 0 });
      });
  }, [page, search, sort]);

  return (
    <EmployeeDataContainer
      data={pegawaiData.data}
      totalPages={pegawaiData.totalPages}
      currentPage={pegawaiData.currentPage}
      search={search}
      sort={sort}
      itemsPerPage={itemsPerPage}
    />
  );
}
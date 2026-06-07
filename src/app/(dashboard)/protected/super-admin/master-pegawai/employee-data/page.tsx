"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getPegawai } from "@/services/pegawaiService";
import EmployeeDataContainer from "@/components/super-admin/master-pegawai/employee-data/EmployeeDataContainer";
import { PegawaiResponse } from "@/types/pegawaiTypes";

export default function EmployeeDataPage() {
  const searchParams = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "desc";
  const departemenId = searchParams.get("departemen_id")
    ? Number(searchParams.get("departemen_id"))
    : undefined;
  const jabatanId = searchParams.get("jabatan_id")
    ? Number(searchParams.get("jabatan_id"))
    : undefined;
  const itemsPerPage = 10;

  const [pegawaiData, setPegawaiData] = useState<PegawaiResponse>({
    data: [],
    totalPages: 0,
    currentPage: 1,
  });

  useEffect(() => {
    let mounted = true;

    getPegawai(page, itemsPerPage, search, sort, departemenId, jabatanId)
      .then((res) => {
        if (!mounted) return;
        setPegawaiData({
          data: res.data ?? [],
          totalPages: res.totalPages ?? 1,
          currentPage: res.currentPage ?? page,
        });
      })
      .catch(() => {
        if (!mounted) return;
        setPegawaiData({
          data: [],
          totalPages: 0,
          currentPage: 1,
        });
      });
    return () => {
      mounted = false;
    };
  }, [page, search, sort, departemenId, jabatanId]);

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

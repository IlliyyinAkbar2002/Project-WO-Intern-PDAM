"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getJenisWorkorders } from "@/services/jenisWorkorderService";
import WorkorderCategoriesContainer from "@/components/super-admin/master-workorders/workorder-categories/WorkorderCategoriesContainer";
import { JenisWorkorderResponse } from "@/types/jenisWorkorderTypes";

export default function WorkorderCategoriesPage() {
  const searchParams = useSearchParams();

  const [jenisWorkorderData, setJenisWorkorderData] =
    useState<JenisWorkorderResponse>({
      data: [],
      totalPages: 0,
      currentPage: 0,
    });

  // ✅ Ambil nilai dari query string dengan .get()
  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "desc";
  const itemsPerPage = 10;

  // ✅ Fetch data di sisi client (browser)
  useEffect(() => {
    getJenisWorkorders(page, itemsPerPage, search, sort)
      .then((res) => {
        // Filter hanya jenis workorder yang sudah memiliki form workorder
        const filteredData = res.data.filter(
          (item) => item.formWorkorder && item.formWorkorder.length > 0,
        );
        setJenisWorkorderData({
          ...res,
          data: filteredData,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch jenis workorder data:", err);
        setJenisWorkorderData({ data: [], totalPages: 0, currentPage: 0 });
      });
  }, [page, search, sort]);

  return (
    <WorkorderCategoriesContainer
      data={jenisWorkorderData.data}
      totalPages={jenisWorkorderData.totalPages}
      currentPage={page}
      search={search}
      sort={sort}
      itemsPerPage={itemsPerPage}
    />
  );
}

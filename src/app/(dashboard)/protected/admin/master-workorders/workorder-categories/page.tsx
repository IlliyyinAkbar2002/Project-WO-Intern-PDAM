"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getJenisWorkorders } from "@/services/jenisWorkorderService";
import JenisWorkorderContainer from "@/components/admin/master-workorders/jenis-workorder/JenisWorkorderContainer";
import { JenisWorkorderResponse } from "@/types/jenisWorkorderTypes";

export default function WorkorderCategoriesPage() {
  const searchParams = useSearchParams();
  const [jenisWorkorderData, setJenisWorkorderData] =
    useState<JenisWorkorderResponse>({
      data: [],
      totalPages: 0,
      currentPage: 1,
    });

  // =========================================================
  // QUERY PARAMS
  // =========================================================
  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "desc";
  const itemsPerPage = 10;

  // =========================================================
  // FETCH DATA
  // =========================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getJenisWorkorders(
          page,
          itemsPerPage,
          search,
          sort,
        );

        // ===================================================
        // FILTER DATA
        // ===================================================
        // const filteredData = response.data.filter(
        //   (item) => item.formWorkorder && item.formWorkorder.length > 0,
        // );

        // setJenisWorkorderData({
        //   ...response,
        //   data: filteredData,
        // });
        console.log(response.data);
        setJenisWorkorderData(response);
      } catch (error) {
        console.error("Failed to fetch jenis workorder data:", error);

        setJenisWorkorderData({
          data: [],
          totalPages: 0,
          currentPage: 1,
        });
      }
    };
    fetchData();
  }, [page, search, sort, itemsPerPage]);

  return (
    <JenisWorkorderContainer
      data={jenisWorkorderData.data}
      totalPages={jenisWorkorderData.totalPages}
      currentPage={page}
      search={search}
      sort={sort}
      itemsPerPage={itemsPerPage}
    />
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import WorkorderContainer from "@/components/manager/master-workorders/workorder/WorkorderContainer";
import { getWorkorders } from "@/services/workorderService";
import { WorkorderResponse } from "@/types/workorderTypes";

export default function WorkorderPage() {
  const searchParams = useSearchParams();
  const [workorderData, setWorkorderData] = useState<WorkorderResponse>({
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
  const itemsPerPage = 10;

  // =========================================================
  // FETCH DATA
  // =========================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getWorkorders({
          page,
          limit: itemsPerPage,
          search,
        });
        setWorkorderData(response);
      } catch (error) {
        console.error("Failed to fetch workorders:", error);
        setWorkorderData({
          data: [],
          totalPages: 0,
          currentPage: 1,
        });
      }
    };
    fetchData();
  }, [page, search]);

  return (
    <WorkorderContainer
      data={workorderData.data}
      totalPages={workorderData.totalPages}
      currentPage={page}
      search={search}
      itemsPerPage={itemsPerPage}
    />
  );
}

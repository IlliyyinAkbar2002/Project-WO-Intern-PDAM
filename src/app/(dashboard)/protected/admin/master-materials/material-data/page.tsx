"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getMaterials } from "@/services/materialService";
import MaterialDataContainer from "@/components/admin/master-materials/form-material-data/MaterialDataContainer";
import { MaterialResponse } from "@/types/materialTypes";

export default function MaterialDataPage() {
  const searchParams = useSearchParams();

  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "desc";
  const itemsPerPage = 10;

  const [materialsData, setMaterialsData] = useState<MaterialResponse>({
    data: [],
    totalPages: 0,
    currentPage: 0,
  });

  // ✅ Fetch material data di sisi client (browser)
  useEffect(() => {
    getMaterials()
      .then((res) =>
        setMaterialsData({ data: res, totalPages: 1, currentPage: 1 }),
      )
      .catch((err) => {
        console.error("Failed to fetch material data:", err);
        setMaterialsData({ data: [], totalPages: 0, currentPage: 0 });
      });
  }, [page, search, sort]);

  return (
    <MaterialDataContainer
      data={materialsData.data}
      totalPages={materialsData.totalPages}
      currentPage={materialsData.currentPage}
      search={search}
      sort={sort}
      itemsPerPage={itemsPerPage}
    />
  );
}

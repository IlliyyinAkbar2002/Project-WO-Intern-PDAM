"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // ✅ gunakan hook resmi Next.js
import { getJenisWorkorders } from "@/services/jenisWorkorderService";
import WorkorderCategoriesContainer from "@/components/admin/master-workorders/workorder-categories/WorkorderCategoriesContainer";
import { JenisWorkorderResponse } from "@/types/jenisWorkorderTypes";

export default function WorkorderCategoriesPage() {
  const searchParams = useSearchParams(); // ✅ ambil query string dari URL

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
  const itemsPerPage = 5;

  // ✅ Fetch data di sisi client (browser)
  useEffect(() => {
    getJenisWorkorders(page, itemsPerPage, search, sort)
      .then((res) => setJenisWorkorderData(res))
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

// import { getJenisWorkorders } from "@/services/jenisWorkorderService";
// import WorkorderCategoriesContainer from "@/components/admin/master-workorders/workorder-categories/WorkorderCategoriesContainer";
// import { JenisWorkorderResponse } from "@/types/jenisWorkorderTypes";

// interface WorkorderCategoriesPageProps {
//   searchParams?: {
//     page?: string;
//     search?: string;
//     sort?: string;
//     modal?: string;
//   };
// }

// export default async function WorkorderCategoriesPage({
//   searchParams,
// }: WorkorderCategoriesPageProps) {
//   const resolvedSearchParams = await searchParams;
//   const rawPage = parseInt(resolvedSearchParams?.page || "1", 10);
//   const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
//   const search = resolvedSearchParams?.search || "";
//   const sort = resolvedSearchParams?.sort || "desc";
//   const modal = resolvedSearchParams?.modal || null;
//   const itemsPerPage = 5;

//   let jenisWorkorderData: JenisWorkorderResponse = {
//     data: [],
//     totalPages: 0,
//     currentPage: 0,
//   };

//   try {
//     jenisWorkorderData = await getJenisWorkorders(
//       page,
//       itemsPerPage,
//       search,
//       sort
//     );
//   } catch (error) {
//     console.error("Failed to fetch jenis workorder data:", error);
//     // Keep default empty data structure
//   }

//   return (
//     <WorkorderCategoriesContainer
//       data={jenisWorkorderData.data}
//       totalPages={jenisWorkorderData.totalPages}
//       currentPage={page}
//       search={search}
//       sort={sort}
//       itemsPerPage={itemsPerPage}
//     />
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { MainTable } from "@/components/shared/tables/MainTable";
import { Pagination } from "@/components/shared/tables/Pagination";
import SingleSelect from "@/components/shared/fields/SingleSelect";
import { Input } from "@/components/ui/input";
import { sortOptions } from "@/constants/options";
import { updateJenisWorkorderStatus } from "@/services/jenisWorkorderService";
import { columns } from "./columns";
import JenisWorkorderModal from "./JenisWorkorderModal";
import { JenisWorkorder } from "@/types";

interface JenisWorkorderContainerProps {
  data: JenisWorkorder[];
  totalPages: number;
  currentPage: number;
  search: string;
  sort: string;
  itemsPerPage: number;
}

export default function JenisWorkorderContainer({
  data,
  totalPages,
  currentPage,
  search,
  sort,
  itemsPerPage,
}: JenisWorkorderContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // =========================================================
  // LOCAL STATE
  // =========================================================
  const [searchText, setSearchText] = useState(search);
  const [sortData, setSortData] = useState(sort);
  const [tableData, setTableData] = useState<JenisWorkorder[]>(data);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // =========================================================
  // SYNC TABLE DATA
  // =========================================================
  useEffect(() => {
    setTableData(data);
  }, [data]);

  // =========================================================
  // RESET SEARCH PARAM
  // =========================================================
  useEffect(() => {
    if (searchText.trim() !== "") return;

    const params = new URLSearchParams(searchParams.toString());

    if (params.has("search")) {
      params.delete("search");
      router.replace(`?${params.toString()}`);
    }
  }, [searchText, router, searchParams]);

  // =========================================================
  // HANDLE SEARCH
  // =========================================================
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchText.trim()) {
      params.set("search", searchText.trim());
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  // =========================================================
  // HANDLE SORT
  // =========================================================
  const handleSortChange = (selected: { value: string } | null) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = selected?.value || "desc";

    setSortData(value);

    params.set("sort", value);
    router.push(`?${params.toString()}`);
  };

  // =========================================================
  // HANDLE PAGE CHANGE
  // =========================================================
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

  // =========================================================
  // HANDLE DETAIL
  // =========================================================
  const handleDetail = (id: number) => {
    setSelectedId(id);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================
  const closeModal = () => {
    setSelectedId(null);
  };

  // =========================================================
  // HANDLE TOGGLE STATUS
  // =========================================================
  const handleToggleStatus = async (id: number, isActive: boolean) => {
    try {
      await updateJenisWorkorderStatus(id, isActive);
      // Update realtime UI
      setTableData((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                is_active: isActive,
              }
            : item,
        ),
      );

      toast.success(
        isActive
          ? "Jenis workorder berhasil diaktifkan"
          : "Jenis workorder berhasil dinonaktifkan",
      );
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengubah status jenis workorder");
    }
  };

  return (
    <>
      <div className="mx-28 overflow-hidden rounded-xl bg-white">
        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-semibold">Data Jenis Workorder</h2>

            <SingleSelect
              placeholder="Urutkan"
              value={
                sortOptions.find((item) => item.value === sortData) || null
              }
              onChange={handleSortChange}
              options={sortOptions}
            />
          </div>

          <div className="flex items-center gap-4">
            {/* SEARCH */}
            <Input
              placeholder="Pencarian..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />

            {/* PAGINATION */}
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* ===================================================== */}
        {/* TABLE */}
        {/* ===================================================== */}
        <MainTable
          columns={columns({
            onDetail: handleDetail,
            onToggleStatus: handleToggleStatus,
            currentPage,
            itemsPerPage,
          })}
          data={tableData}
          loading={false}
        />
      </div>

      {/* ===================================================== */}
      {/* DETAIL MODAL */}
      {/* ===================================================== */}
      {selectedId && (
        <JenisWorkorderModal id={selectedId} onClose={closeModal} />
      )}
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/shared/tables/Pagination";
import { MainTable } from "@/components/shared/tables/MainTable";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, PlusCircleIcon } from "lucide-react";
import SingleSelect from "@/components/shared/fields/SingleSelect";
import { sortOptions } from "@/constants/options";
import { Material } from "@/types/materialTypes";
import MaterialDetailModal from "./modals/MaterialDetailModal";
import { deleteMaterial } from "@/services/materialService";
import Swal from "sweetalert2";

interface MaterialDataContainerProps {
  data: Material[];
  totalPages: number;
  currentPage: number;
  search: string;
  sort: string;
  itemsPerPage: number;
}

export default function MaterialDataContainer({
  data,
  totalPages,
  currentPage,
  search,
  sort,
  itemsPerPage,
}: MaterialDataContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortData, setSortData] = useState(sort);
  const [searchText, setSearchText] = useState(search || "");
  const [tableData, setTableData] = useState(data);
  // ✅ Search realtime
  const handleSearchChange = (value: string) => {
    setSearchText(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", value);
    router.push(`?${params.toString()}`);
  };
  // ✅ Pagination
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };
  //Sort data
  const handleSortChange = (selected: { value: string } | null) => {
    const sortValue = selected ? selected.value : "";
    setSortData(sortValue);
    const params = new URLSearchParams(searchParams);
    params.set("sort", sortValue);
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    setTableData(data);
  }, [data]);

  //Kolom tabel (pakai ColumnDef agar cocok dengan MainTable)
  const columns: ColumnDef<Material>[] = [
    {
      header: "No",
      accessorFn: (_row, idx) => (currentPage - 1) * itemsPerPage + idx + 1,
      cell: (info) => info.getValue(),
    },
    {
      header: "Nama",
      accessorFn: (row) => row.nama,
      cell: (info) => info.getValue(),
    },
    {
      header: "Kode Material",
      accessorFn: (row) => row.kode_material,
      cell: (info) => info.getValue(),
    },
    {
      header: "Jumlah Stok",
      accessorFn: (row) => row.jumlah_stok,
      cell: (info) => info.getValue() || "-",
    },
    {
      header: "Terpakai",
      accessorFn: (row) => row.terpakai,
      cell: (info) => info.getValue() || "-",
    },
    {
      header: "Tersedia",
      accessorFn: (row) => row.tersedia,
      cell: (info) => info.getValue() || "-",
    },
    {
      header: "Aksi",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-col items-center gap-1">
          <button
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("submodal", "edit");
              params.set("submodal_id", String(row.original.kode_material));
              router.push(`?${params.toString()}`);
            }}
          >
            ✉️ <span>Edit</span>
          </button>
          <button
            className="text-sm text-red-600 hover:underline flex items-center gap-1"
            onClick={async () => {
              const result = await Swal.fire({
                title: "Hapus Material?",
                text: "Data yang dihapus tidak dapat dikembalikan",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#dc2626",
                confirmButtonText: "Ya, Hapus",
                cancelButtonText: "Batal",
              });

              if (!result.isConfirmed) return;

              try {
                Swal.fire({
                  title: "Menghapus material...",
                  text: "Mohon tunggu",
                  allowOutsideClick: false,
                  didOpen: () => {
                    Swal.showLoading();
                  },
                });

                await deleteMaterial(row.original.kode_material);

                Swal.fire({
                  icon: "success",
                  title: "Berhasil",
                  text: "Material berhasil dihapus",
                  timer: 1500,
                  showConfirmButton: false,
                });
                setTableData((prev) =>
                  prev.filter(
                    (item) => item.kode_material !== row.original.kode_material,
                  ),
                );
              } catch (err: any) {
                console.error(err);

                Swal.fire({
                  icon: "error",
                  title: "Gagal",
                  text: err.message || "Gagal menghapus material",
                });
              }
            }}
          >
            🚫 <span>Delete</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-col mx-28 rounded-lg overflow-hidden bg-white">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-semibold">Master Material</h2>
          <SingleSelect
            placeholder="Terbaru"
            value={sortOptions.find((item) => item.value === sortData) || null}
            onChange={handleSortChange}
            options={sortOptions}
          />
        </div>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Pencarian"
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
          />

          <Pagination
            totalPages={totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />

          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              router.push(
                "/protected/super-admin/master-materials/material-data/create",
              )
            }
          >
            <PlusCircleIcon size={10} />
            Tambahkan
          </Button>
        </div>
      </div>

      {/* ✅ Tabel utama */}
      <div className="px-4 pb-4 bg-transparent">
        <MainTable columns={columns} data={tableData} loading={false} />
      </div>
      {(() => {
        const submodal = searchParams.get("submodal");
        if (submodal === "detail" || submodal === "edit") {
          return (
            <MaterialDetailModal
              onSuccess={(updatedMaterial) => {
                setTableData((prev) =>
                  prev.map((item) =>
                    item.kode_material === updatedMaterial.kode_material
                      ? updatedMaterial
                      : item,
                  ),
                );
              }}
            />
          );
        }
        return null;
      })()}
    </div>
  );
}

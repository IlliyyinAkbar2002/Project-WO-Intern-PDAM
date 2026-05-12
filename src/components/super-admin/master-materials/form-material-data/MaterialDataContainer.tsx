"use client";

import { useState } from "react";
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
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import { deleteMaterial } from "@/services/materialService";
import { toast } from "sonner";

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
            onClick={() => {
              setDeletingId(row.original.kode_material);
              setShowConfirmModal(true);
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
        <MainTable columns={columns} data={data} loading={false} />
      </div>
      {(() => {
        const submodal = searchParams.get("submodal");
        if (submodal === "detail" || submodal === "edit") {
          return <MaterialDetailModal />;
        }
        return null;
      })()}
      <ConfirmModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={async () => {
          if (!deletingId) return;
          try {
            setIsDeleting(true);
            await deleteMaterial(deletingId);
            toast.success("Material berhasil dihapus");
            setShowConfirmModal(false);
            setDeletingId(null);
            router.refresh();
          } catch (err) {
            console.error(err);
            toast.error("Gagal menghapus material");
          } finally {
            setIsDeleting(false);
          }
        }}
        title="Hapus Material"
        description="Anda yakin ingin menghapus material ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}

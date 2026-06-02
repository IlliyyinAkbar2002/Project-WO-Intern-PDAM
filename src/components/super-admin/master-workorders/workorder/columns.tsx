"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import { Button, Badge } from "@/components/ui";
import StatusBadge from "@/components/shared/StatusBadge";
import { Workorder } from "@/types/workorderTypes";
import Swal from "sweetalert2";
import { deleteWorkorder } from "@/services/workorderService";

interface ColumnsProps {
  openModal: (modal: "detail" | "edit", id: number) => void;
  currentPage: number;
  itemsPerPage: number;
  refreshData?: () => void;
}

export const columns = ({
  openModal,
  currentPage,
  itemsPerPage,
  refreshData,
}: ColumnsProps): ColumnDef<Workorder>[] => [
  {
    header: "No",
    cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1,
  },
  {
    accessorKey: "kodePengaduan",
    header: "Kode Pengaduan",
    cell: ({ row }) => row.original.kodePengaduan,
  },
  {
    accessorKey: "namaWorkorder",
    header: "Nama Workorder",
  },
  {
    accessorKey: "lokasi",
    header: "Lokasi",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "prioritas",
    header: "Prioritas",
    cell: ({ row }) => {
      const value = row.original.prioritas;
      const variant =
        value === "Urgent"
          ? "danger"
          : value === "Tinggi"
            ? "warning"
            : value === "Sedang"
              ? "info"
              : "outline";
      return <Badge variant={variant}>{value}</Badge>;
    },
  },
  {
    accessorKey: "assignedTo",
    header: "Ditujukan Kepada (SPV)",
    cell: ({ row }) => {
      return row.original.assignedToName ?? "-";
    },
  },
  {
    id: "actions",
    header: "Aksi",

    cell: ({ row }) => {
      const handleDelete = async () => {
        const result = await Swal.fire({
          title: "Hapus Workorder?",
          text: "Data workorder akan dihapus permanen.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ya, Hapus",
          cancelButtonText: "Batal",
          confirmButtonColor: "#d33",
        });

        if (!result.isConfirmed) return;

        try {
          Swal.fire({
            title: "Menghapus workorder...",
            text: "Mohon tunggu",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          await deleteWorkorder(row.original.id);

          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Workorder berhasil dihapus",
            timer: 1500,
            showConfirmButton: false,
          });

          refreshData?.();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text:
              error instanceof Error
                ? error.message
                : "Gagal menghapus workorder",
          });
        }
      };

      const handleEdit = () => {
        Swal.fire({
          title: "Memuat data workorder...",
          text: "Mohon tunggu",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        openModal("edit", row.original.id);
      };

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openModal("detail", row.original.id)}
          >
            <EyeIcon size={18} />
          </Button>

          <Button variant="outline" size="sm" onClick={handleEdit}>
            <PencilSimpleIcon size={18} />
          </Button>

          <Button variant="outline" size="sm" onClick={handleDelete}>
            <TrashIcon size={18} />
          </Button>
        </div>
      );
    },
  },
];

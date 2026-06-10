"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  EyeIcon,
  PencilSimpleIcon,
  LockIcon,
  LockOpenIcon,
} from "@phosphor-icons/react";
import { Button, Badge } from "@/components/ui";
import StatusBadge from "@/components/shared/StatusBadge";
import { Workorder } from "@/types/workorderTypes";
import Swal from "sweetalert2";
import { toggleWorkorderStatus } from "@/services/workorderService";

interface ColumnsProps {
  openModal: (modal: "detail" | "edit", id: number) => void;
  currentPage: number;
  itemsPerPage: number;
  setTableData: React.Dispatch<React.SetStateAction<Workorder[]>>;
}

export const columns = ({
  openModal,
  currentPage,
  itemsPerPage,
  setTableData,
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
    header: "Status Pengerjaan",
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
    header: "Status",
    accessorFn: (row) => row.isActive,
    cell: ({ row }) => (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
          row.original.isActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {row.original.isActive ? "Aktif" : "Nonaktif"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      // Toogle status workorder aktif/nonaktif
      const handleToggleStatus = async () => {
        const isActive = row.original.isActive;
        const result = await Swal.fire({
          title: isActive ? "Nonaktifkan Workorder?" : "Aktifkan Workorder?",
          text: isActive
            ? "Workorder tidak akan dapat digunakan."
            : "Workorder akan aktif kembali.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: isActive ? "Ya, Nonaktifkan" : "Ya, Aktifkan",
          cancelButtonText: "Batal",
        });

        if (!result.isConfirmed) return;
        try {
          Swal.fire({
            title: "Memproses...",
            text: "Mohon tunggu",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          const response = await toggleWorkorderStatus(row.original.id);

          setTableData((prev) =>
            prev.map((item) =>
              item.id === row.original.id
                ? {
                    ...item,
                    isActive: !item.isActive,
                  }
                : item,
            ),
          );

          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: response.message,
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text:
              error instanceof Error
                ? error.message
                : "Gagal mengubah status workorder",
          });
        }
      };

      // Edit workorder
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

          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleStatus}
            className={
              row.original.isActive ? "text-red-600" : "text-green-600"
            }
          >
            {row.original.isActive ? (
              <LockIcon size={18} />
            ) : (
              <LockOpenIcon size={18} />
            )}
          </Button>
        </div>
      );
    },
  },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "@phosphor-icons/react";
import { Button, Badge } from "@/components/ui";
import { HistoryWorkorder } from "@/types/workorderTypes";

interface ColumnsProps {
  currentPage: number;
  itemsPerPage: number;
  openDetail: (id: number) => void;
}

const formatDate = (date?: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const columns = ({
  currentPage,
  itemsPerPage,
  openDetail,
}: ColumnsProps): ColumnDef<HistoryWorkorder>[] => [
  {
    header: "No",
    cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1,
  },
  {
    id: "kodePengaduan",
    header: "Kode Pengaduan",
    cell: ({ row }) => row.original.pengaduan?.kodePengaduan ?? "-",
  },
  {
    accessorKey: "namaWorkorder",
    header: "Workorder",
  },
  {
    accessorKey: "lokasi",
    header: "Lokasi",
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
    id: "tanggalMulai",
    header: "Tanggal Mulai",
    cell: ({ row }) =>
      formatDate(row.original.workorderAssignment?.tanggalMulai),
  },
  {
    id: "tanggalSelesai",
    header: "Tanggal Selesai",
    cell: ({ row }) =>
      formatDate(row.original.workorderAssignment?.tanggalSelesai),
  },
  {
    id: "aksi",
    header: "Aksi",
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="sm"
        onClick={() => openDetail(row.original.id)}>
        <EyeIcon size={18} />
      </Button>
    ),
  },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui";
import { Workorder } from "@/types/workorderTypes";

interface ColumnsProps {
  openModal: (modal: "detail" | "edit", id: number) => void;

  currentPage: number;
  itemsPerPage: number;
}

export const columns = ({
  openModal,
  currentPage,
  itemsPerPage,
}: ColumnsProps): ColumnDef<Workorder>[] => [
  {
    header: "No",
    cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1,
  },
  {
    accessorKey: "kodePengaduan",
    header: "Kode Pengaduan",

    cell: ({ row }) => {
      return row.original.kodePengaduan ?? "-";
    },
  },
  {
    accessorKey: "namaWorkorder",
    header: "Nama Workorder",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "prioritas",
    header: "Prioritas",
  },
  {
    accessorKey: "picId",
    header: "PIC",

    cell: ({ row }) => {
      return row.original.pic?.pegawai?.nama ?? "-";
    },
  },
  {
    id: "actions",
    header: "Aksi",

    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => openModal("detail", row.original.id)}
        >
          <EyeIcon size={18} />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => openModal("edit", row.original.id)}
        >
          <PencilSimpleIcon size={18} />
        </Button>
      </div>
    ),
  },
];

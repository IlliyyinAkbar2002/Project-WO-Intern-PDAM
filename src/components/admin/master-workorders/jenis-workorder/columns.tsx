"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon, PowerIcon } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { JenisWorkorder } from "@/types/jenisWorkorderTypes";

interface ColumnsProps {
  onDetail: (id: number) => void;
  onToggleStatus: (id: number, isActive: boolean) => void;
  currentPage: number;
  itemsPerPage: number;
}

// =========================================================
// KATEGORI LABEL MAP
// =========================================================
const kategoriLabel: Record<NonNullable<JenisWorkorder["kategori"]>, string> = {
  meter: "Meteran",
  jaringan: "Jaringan / Pipa",
  infrastruktur: "Infrastruktur",
};

export const columns = ({
  onDetail,
  onToggleStatus,
  currentPage,
  itemsPerPage,
}: ColumnsProps): ColumnDef<JenisWorkorder>[] => [
  // =========================================================
  // NO
  // =========================================================
  {
    id: "no",
    header: "No",
    cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1,
  },

  // =========================================================
  // NAMA WORKORDER
  // =========================================================
  {
    accessorKey: "nama",
    header: "Nama Workorder",
  },

  // =========================================================
  // KATEGORI
  // =========================================================
  {
    accessorKey: "kategori",
    header: "Kategori",
    cell: ({ row }) => {
      const kategori = row.original.kategori;
      return kategori ? (kategoriLabel[kategori] ?? "-") : "-";
    },
  },

  // =========================================================
  // STATUS
  // =========================================================
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.is_active;
      return (
        <Badge variant={isActive ? "default" : "destructive"}>
          {isActive ? "Aktif" : "Nonaktif"}
        </Badge>
      );
    },
  },

  // =========================================================
  // ACTIONS
  // =========================================================
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const { id, is_active } = row.original;
      return (
        <div className="flex items-center justify-center gap-3">
          {/* DETAIL */}
          <button type="button" onClick={() => onDetail(id)}>
            <EyeIcon size={20} className="text-blue-600 hover:text-blue-800" />
          </button>

          {/* TOGGLE STATUS */}
          <button type="button" onClick={() => onToggleStatus(id, !is_active)}>
            <PowerIcon
              size={20}
              className={
                is_active
                  ? "text-red-600 hover:text-red-800"
                  : "text-green-600 hover:text-green-800"
              }
            />
          </button>
        </div>
      );
    },
  },
];

"use client";

import { Button } from "@/components/ui/button";
import { JenisWorkorder } from "@/types/jenisWorkorderTypes";
import { PencilSimpleLineIcon, TrashIcon } from "@phosphor-icons/react";
import { ColumnDef } from "@tanstack/react-table";

interface ColumnsProps {
  openModal: (modal: string, id: number) => void;
  handleDelete: (id: number) => void;
  currentPage: number;
  itemsPerPage: number;
}

export const columns = ({
  openModal,
  handleDelete,
  currentPage,
  itemsPerPage,
}: ColumnsProps): ColumnDef<JenisWorkorder>[] => [
    {
      header: "No",
      cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1,
    },
    {
      accessorKey: "nama",
      header: "Work Order",
    },
    {
      header: "Aksi",
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div className="flex gap-8 justify-center">
            <Button
              variant="primary"
              onClick={() => openModal("detail", data.id)}
            >
              Detail
            </Button>
            <button onClick={() => openModal("edit", data.id)}>
              <PencilSimpleLineIcon
                size={20}
                className="text-grey-700 hover:text-grey-900"
              />
            </button>
            <button onClick={() => handleDelete(data.id)}>
              <TrashIcon
                size={20}
                className="text-grey-700 hover:text-grey-900"
              />
            </button>
          </div>
        );
      },
    },
  ];

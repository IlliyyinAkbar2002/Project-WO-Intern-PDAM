"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DetailForm } from "@/types";
import {
  PencilSimpleLineIcon,
  PlusIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";

interface ColumnsProps {
  openSubModal: (modal: string, id: number) => void;
  handleDeleteRow: (id: number) => void;
  handleSubmitRow: (id: number, value: string) => void;
  handleAddRow: () => void;
  mode: boolean;
}

export const columns = ({
  openSubModal,
  handleDeleteRow,
  handleSubmitRow,
  handleAddRow,
  mode,
}: ColumnsProps): ColumnDef<DetailForm>[] => [
  {
    header: "No",
    size: 40,
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Nama Field",
    size: 500,
    cell: ({ row }) => {
      const { id, namaField } = row.original;
      const [nameValue, setNameValue] = useState("");

      return namaField === "" ? (
        <div className="flex gap-2 items-center mr-20">
          <Input
            placeholder="Isi Nama Field..."
            variant="inline"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
          />
          <Button
            variant="thirtiary"
            size="sm"
            onClick={() => handleSubmitRow(id, nameValue.trim())}
          >
            Tambah
          </Button>
        </div>
      ) : (
        <span>{namaField}</span>
      );
    },
  },
  {
    header: "Aksi",
    cell: ({ row, table }) => {
      const data = row.original;
      const isDataFilled = !!data.tipeField;
      const isNamaField = !!data.namaField;
      const isLastRow = row.index === table.getRowModel().rows.length - 1;
      const handleOpenDetail = () => {
        if (isNamaField) {
          if (isDataFilled) {
            openSubModal("detail", data.id);
          } else {
            openSubModal("create", data.id);
          }
        } else {
          toast.error("Isi Nama Field terlebih dahulu");
        }
      };
      return (
        <div className="flex gap-5 justify-center px-5">
          <Button
            variant={isDataFilled ? "primary" : "thirtiary"}
            onClick={handleOpenDetail}
          >
            {isDataFilled ? "Detail" : "Isi Detail"}
          </Button>
          {!mode && (
            <>
              <button
                aria-label="Edit row"
                title="Edit row"
                onClick={() =>
                  isNamaField
                    ? openSubModal("edit", data.id)
                    : toast.error("Isi Nama Field terlebih dahulu")
                }
              >
                <PencilSimpleLineIcon
                  size={20}
                  className="text-grey-700 hover:text-grey-900"
                />
              </button>
              <button
                aria-label="Delete row"
                title="Delete row"
                onClick={() => handleDeleteRow(data.id)}
              >
                <TrashIcon
                  size={20}
                  className="text-grey-700 hover:text-grey-900"
                />
              </button>
              {isLastRow && (
                <button
                  aria-label="Add row"
                  title="Add row"
                  onClick={handleAddRow}
                >
                  <PlusIcon
                    size={20}
                    className="text-white bg-primary-200 hover:bg-primary-300 rounded-full p-1"
                  />
                </button>
              )}
            </>
          )}
        </div>
      );
    },
  },
];

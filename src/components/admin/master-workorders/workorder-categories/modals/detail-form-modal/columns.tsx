"use client";

import SingleSelect from "@/components/shared/fields/SingleSelect";
import { Button, Input } from "@/components/ui";
import { DetailForm } from "@/types";
import {
  PencilSimpleLineIcon,
  PlusIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

interface ColumnsProps {
  handleEditRow: (id: number) => void;
  handleDeleteRow: (id: number) => void;
  handleAddRow: () => void;
  handleInputRow: (
    id: number,
    field: keyof DetailForm,
    value: string | number | null
  ) => void;
  handleSubmitRow: () => void;
  handleCancelEditRow: () => void;
  parentOptionOptions: { label: string; value: string }[];
  option: DetailForm;
  editRowId: number | null;
  mode: boolean;
}

export const columns = ({
  handleEditRow,
  handleDeleteRow,
  handleAddRow,
  handleInputRow,
  handleSubmitRow,
  handleCancelEditRow,
  parentOptionOptions,
  option,
  editRowId,
  mode,
}: ColumnsProps): ColumnDef<DetailForm>[] => {
  const baseColumns: ColumnDef<DetailForm>[] = [
    {
      header: "No",
      size: 40,
      cell: ({ row }) => row.index + 1,
    },
    {
      header: "Uraian",
      size: 500,
      cell: ({ row }) => {
        const { id, namaOpsi } = row.original;
        const [nameValue, setNameValue] = useState(option.namaOpsi);
        const isEdit = id === editRowId;

        return namaOpsi === "" || isEdit ? (
          <Input
            placeholder="Isi nama opsi..."
            variant="inline"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={() => handleInputRow(id, "namaOpsi", nameValue)}
          />
        ) : (
          <span>{namaOpsi}</span>
        );
      },
    },
    {
      header: "Parent",
      size: 500,
      cell: ({ row }) => {
        const { id, parent, namaParent } = row.original;
        const isEdit = id === editRowId;

        return parent === null || isEdit ? (
          <div className="flex gap-2 items-center justify-center ">
            <SingleSelect
              placeholder="Pilih parent"
              variant="inline"
              value={
                parentOptionOptions.find(
                  (item) => item.value === String(option.parent)
                ) || null
              }
              onChange={(selected) => {
                const parentValue = selected?.value
                  ? Number(selected.value)
                  : null;
                handleInputRow(id, "parent", parentValue);
              }}
              options={parentOptionOptions}
              menuPlacement="top"
            />
            <Button variant="thirtiary" size="sm" onClick={handleSubmitRow}>
              {isEdit ? "Ubah" : "Tambah"}
            </Button>
            {isEdit && (
              <Button variant="danger" size="sm" onClick={handleCancelEditRow}>
                Batal
              </Button>
            )}
          </div>
        ) : (
          <span>{namaParent}</span>
        );
      },
    },
    {
      id: "aksi",
      header: "Aksi",
      cell: ({ row, table }) => {
        const data = row.original;
        const isLastRow = row.index === table.getRowModel().rows.length - 1;
        return (
          <div className="flex gap-6 justify-center px-3">
            <button
              aria-label="Edit row"
              title="Edit row"
              onClick={() => handleEditRow(data.id)}
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
          </div>
        );
      },
    },
  ];
  return mode ? baseColumns.filter((col) => col.id !== "aksi") : baseColumns;
};

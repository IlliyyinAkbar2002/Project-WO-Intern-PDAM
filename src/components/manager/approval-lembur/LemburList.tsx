"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/shared/tables/Pagination";
import { MainTable } from "@/components/shared/tables/MainTable";
import SingleSelect from "@/components/shared/fields/SingleSelect";
import StatusBadge from "@/components/shared/StatusBadge";
import { sortOptions } from "@/constants/options";
import { LemburSpl } from "@/types/lemburSpl";

interface LemburListProps {
  data: LemburSpl[];
  totalPages: number;
  currentPage: number;
  search: string;
  sort: string;
  loading?: boolean;

  onSearch: (value: string) => void;
  onSort: (value: string) => void;
  onPageChange: (page: number) => void;
  onSelect: (item: LemburSpl) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

export default function LemburList({
  data,
  totalPages,
  currentPage,
  search,
  sort,
  loading = false,
  onSearch,
  onSort,
  onPageChange,
  onSelect,
  onApprove,
  onReject,
}: LemburListProps) {
  const [searchText, setSearchText] = useState(search);
  const [sortData, setSortData] = useState(sort);
  const handleSearchChange = (value: string) => {
    setSearchText(value);
    onSearch(value);
  };
  const handleSortChange = (selected: { value: string } | null) => {
    const value = selected?.value ?? "";
    setSortData(value);
    onSort(value);
  };
  const columns: ColumnDef<LemburSpl>[] = [
    {
      header: "No",
      cell: ({ row }) => row.index + 1,
    },
    {
      header: "Workorder",
      accessorFn: (row) => row.workorder?.nama_workorder ?? "-",
    },
    {
      header: "Judul Pekerjaan",
      accessorFn: (row) => row.judul_pekerjaan ?? "-",
    },
    {
      header: "Pemohon",
      accessorFn: (row) => row.pemohon?.pegawai?.nama ?? "-",
    },
    {
      header: "Tanggal Lembur",
      accessorFn: (row) => row.tanggal_lembur,
      cell: ({ getValue }) => {
        const value = getValue() as string;

        if (!value) return "-";

        return new Date(value).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      },
    },
    {
      header: "Status",
      accessorFn: (row) => row.status,
      cell: ({ getValue }) => <StatusBadge status={getValue() as any} />,
    },
    {
      header: "Aksi",
      cell: ({ row }) => {
        const item = row.original;

        return (
          <div className="flex items-center gap-2">
            {/* DETAIL */}
            <button
              onClick={() => onSelect(item)}
              className="rounded-md p-2 hover:bg-slate-100"
              title="Detail">
              <Eye className="h-6 w-6 text-blue-600" />
            </button>

            {/* APPROVE & REJECT hanya ketika pending */}
            {item.status === "pending" && (
              <>
                <button
                  onClick={() => onReject(item.id)}
                  className="rounded-md p-2 hover:bg-red-50"
                  title="Reject">
                  <X className="h-6 w-6 text-red-600" />
                </button>

                <button
                  onClick={() => onApprove(item.id)}
                  className="rounded-md p-2 hover:bg-green-50"
                  title="Approve">
                  <Check className="h-6 w-6 text-green-600" />
                </button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex-col mx-28 rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-semibold">Approval Lembur SPL</h2>

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
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
      </div>

      {/* Table */}
      <div className="px-4 pb-4">
        <MainTable columns={columns} data={data} loading={loading} />
      </div>
    </div>
  );
}

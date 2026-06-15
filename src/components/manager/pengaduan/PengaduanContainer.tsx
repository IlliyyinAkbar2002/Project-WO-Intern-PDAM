"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/shared/tables/Pagination";
import { MainTable } from "@/components/shared/tables/MainTable";
import { ColumnDef } from "@tanstack/react-table";
import SingleSelect from "@/components/shared/fields/SingleSelect";
import { sortOptions } from "@/constants/options";
import { Pengaduan } from "@/types/pengaduanTypes";
import StatusBadge from "@/components/shared/StatusBadge";

interface PengaduanDataContainerProps {
  data: Pengaduan[];
  totalPages: number;
  currentPage: number;
  search: string;
  sort: string;
  itemsPerPage: number;
}

const statusColorMap: Record<string, string> = {
  Pending: "text-yellow-500",
  Proses: "text-blue-500",
  Selesai: "text-green-500",
  Ditolak: "text-red-500",
};

export default function PengaduanDataContainer({
  data,
  totalPages,
  currentPage,
  search,
  sort,
  itemsPerPage,
}: PengaduanDataContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortData, setSortData] = useState(sort);
  const [searchText, setSearchText] = useState(search || "");

  //Search realtime
  const handleSearchChange = (value: string) => {
    setSearchText(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", value);
    router.push(`?${params.toString()}`);
  };

  //Pagination
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  //Sort
  const handleSortChange = (selected: { value: string } | null) => {
    const sortValue = selected ? selected.value : "";
    setSortData(sortValue);

    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortValue);
    router.push(`?${params.toString()}`);
  };

  //Kolom tabel
  const columns: ColumnDef<Pengaduan>[] = [
    {
      header: "No",
      cell: ({ row }) => row.index + 1,
    },
    {
      header: "Kode",
      accessorFn: (row) => {
        // console.log("ROW:", row);
        return row.kode_pengaduan;
      },
    },
    {
      header: "Judul",
      accessorFn: (row) => row.judul,
    },
    {
      header: "Deskripsi",
      accessorFn: (row) => row.deskripsi,
    },
    {
      header: "Lokasi",
      accessorFn: (row) => row.lokasi,
    },
    {
      header: "Status",
      accessorFn: (row) => row.status,
      cell: ({ getValue }) => {
        return <StatusBadge status={getValue() as any} />;
      },
    },
    {
      header: "Tanggal Pengaduan",
      accessorFn: (row) => row.tanggal_pengaduan,
      cell: (info) => {
        const value = info.getValue() as string;
        return new Date(value).toLocaleString();
      },
    },
  ];

  return (
    <div className="flex-col mx-28 rounded-lg overflow-hidden bg-white">
      {/* 🔝 Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-semibold">Data Pengaduan</h2>
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
        </div>
      </div>

      {/* 📊 Table */}
      <div className="px-4 pb-4 bg-transparent">
        <MainTable columns={columns} data={data} loading={false} />
      </div>
    </div>
  );
}

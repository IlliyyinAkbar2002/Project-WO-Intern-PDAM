"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pegawai } from "@/types/pegawaiTypes";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/shared/tables/Pagination";
import { MainTable } from "@/components/shared/tables/MainTable";
import { ColumnDef } from "@tanstack/react-table";

interface EmployeeDataContainerProps {
  data: Pegawai[];
  totalPages: number;
  currentPage: number;
  search: string;
  sort: string;
  itemsPerPage: number;
}

export default function EmployeeDataContainer({
  data,
  totalPages,
  currentPage,
  search,
  sort,
  itemsPerPage,
}: EmployeeDataContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [departemenId, setDepartemenId] = useState<string | undefined>();
  const [jabatanId, setJabatanId] = useState<string | undefined>();
  const [searchText, setSearchText] = useState(search || "");

  // ✅ Search realtime
  const handleSearchChange = (value: string) => {
    setSearchText(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", value);
    router.push(`?${params.toString()}`);
  };

  // ✅ Pagination
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  // ✅ Filter data
  const filteredData = data.filter((p) => {
    const matchDepartemen = departemenId
      ? p.pegawai.departemen === departemenId
      : true;
    const matchJabatan = jabatanId ? p.pegawai.jabatan === jabatanId : true;
    const matchSearch = searchText
      ? p.pegawai.nama.toLowerCase().includes(searchText.toLowerCase()) ||
        p.pegawai.nip.toLowerCase().includes(searchText.toLowerCase())
      : true;
    return matchDepartemen && matchJabatan && matchSearch;
  });

  // ✅ Kolom tabel (pakai ColumnDef agar cocok dengan MainTable)
  const columns: ColumnDef<Pegawai>[] = [
    {
      header: "No",
      accessorFn: (_row, idx) => (currentPage - 1) * itemsPerPage + idx + 1,
      cell: (info) => info.getValue(),
    },
    {
      header: "Nama",
      accessorFn: (row) => row.pegawai.nama,
      cell: (info) => info.getValue(),
    },
    {
      header: "NIP",
      accessorFn: (row) => row.pegawai.nip,
      cell: (info) => info.getValue(),
    },
    {
      header: "Departemen",
      accessorFn: (row) => row.pegawai.departemen,
      cell: (info) => info.getValue() || "-",
    },
    {
      header: "Jabatan",
      accessorFn: (row) => row.pegawai.jabatan,
      cell: (info) => info.getValue() || "-",
    },
    {
      header: "Email",
      accessorFn: (row) => row.email,
      cell: (info) => info.getValue() || "-",
    },
    {
      header: "Aksi",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-col items-center gap-1">
          <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            ✉️ <span>Forgot Password</span>
          </button>
          <button className="text-sm text-red-600 hover:underline flex items-center gap-1">
            🚫 <span>Disable</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-col mx-28 rounded-lg overflow-hidden bg-white">
      {/* ✅ Header */}
      <div className="flex items-center justify-between p-4">
        <h2 className="text-3xl font-semibold">Master Pegawai</h2>
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

      {/* ✅ Filter */}
      <div className="flex gap-4 px-4 mb-4">
        <select
          value={departemenId || ""}
          onChange={(e) =>
            setDepartemenId(e.target.value ? e.target.value : undefined)
          }
          className="border px-2 py-1 rounded"
        >
          <option value="">Filter Departemen</option>
          {Array.from(
            new Set(data.map((p) => p.pegawai.departemen).filter(Boolean))
          ).map((d, idx) => (
            <option key={idx} value={d || ""}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={jabatanId || ""}
          onChange={(e) =>
            setJabatanId(e.target.value ? e.target.value : undefined)
          }
          className="border px-2 py-1 rounded"
        >
          <option value="">Filter Jabatan</option>
          {Array.from(
            new Set(data.map((p) => p.pegawai.jabatan).filter(Boolean))
          ).map((j, idx) => (
            <option key={idx} value={j || ""}>
              {j}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setDepartemenId(undefined);
            setJabatanId(undefined);
          }}
          className="border px-2 py-1 rounded"
        >
          Reset Filter
        </button>
      </div>

      {/* ✅ Tabel utama */}
      <div className="px-4 pb-4 bg-transparent">
        <MainTable columns={columns} data={filteredData} loading={false} />
      </div>
    </div>
  );
}

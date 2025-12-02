"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pegawai } from "@/types/pegawaiTypes";

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

  // ✅ Ambil unique departemen & jabatan dari relasi m_pegawai
  const departemenList = Array.from(
    new Set(data.map((p) => p.pegawai.departemen).filter(Boolean))
  );
  const jabatanList = Array.from(
    new Set(data.map((p) => p.pegawai.jabatan).filter(Boolean))
  );

  // ✅ Filter data pegawai berdasarkan dropdown
  const filteredData = data.filter((p) => {
    const matchDepartemen = departemenId
      ? p.pegawai.departemen === departemenId
      : true;
    const matchJabatan = jabatanId ? p.pegawai.jabatan === jabatanId : true;
    const matchSearch = search
      ? p.pegawai.nama.toLowerCase().includes(search.toLowerCase()) ||
        p.pegawai.nip.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchDepartemen && matchJabatan && matchSearch;
  });

  // ✅ Handler pagination
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  // ✅ Handler search bar
  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Master Pegawai</h1>

      {/* ✅ Search bar + Filter */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Pencarian nama atau NIP"
          className="border px-2 py-1 rounded w-1/3"
          defaultValue={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />

        <div className="flex gap-2">
          <select
            value={departemenId || ""}
            onChange={(e) =>
              setDepartemenId(e.target.value ? e.target.value : undefined)
            }
            className="border px-2 py-1 rounded"
          >
            <option value="">Filter Departemen</option>
            {departemenList.map((d, idx) => (
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
            {jabatanList.map((j, idx) => (
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
      </div>

      {/* ✅ Table UI mirip Jenis Workorder */}
      <table className="table-auto w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1 w-12">No</th>
            <th className="border px-2 py-1">Nama</th>
            <th className="border px-2 py-1">NIP</th>
            <th className="border px-2 py-1">Departemen</th>
            <th className="border px-2 py-1">Jabatan</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1 w-32">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-2">
                Data tidak ditemukan
              </td>
            </tr>
          ) : (
            filteredData.map((p, idx) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="border px-2 py-1 text-center">
                  {(currentPage - 1) * itemsPerPage + idx + 1}
                </td>
                <td className="border px-2 py-1">{p.pegawai.nama}</td>
                <td className="border px-2 py-1">{p.pegawai.nip}</td>
                <td className="border px-2 py-1">{p.pegawai.departemen}</td>
                <td className="border px-2 py-1">{p.pegawai.jabatan}</td>
                <td className="border px-2 py-1">{p.email || "-"}</td>
                <td className="border px-2 py-1 text-center">
                  <button className="text-blue-600 mr-2">Detail</button>
                  <button className="text-yellow-600 mr-2">✏️</button>
                  <button className="text-red-600">🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ✅ Pagination */}
      <div className="flex gap-2 mt-4 justify-center">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 border rounded ${
              i + 1 === currentPage
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/shared/tables/Pagination";
import { MainTable } from "@/components/shared/tables/MainTable";
import { getLogPenggunaanMaterial } from "@/services/materialService";
import { WoPeminjamanMaterial } from "@/types/materialTypes";

export default function MaterialLogContainer() {
  const [data, setData] = useState<WoPeminjamanMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const currentPage = 1;
  const totalPages = 1;
  const itemsPerPage = data.length || 10;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const result = await getLogPenggunaanMaterial();

      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((item) => {
    const keyword = searchText.toLowerCase();

    return (
      item.workorder?.nama_workorder?.toLowerCase().includes(keyword) ||
      item.material?.nama?.toLowerCase().includes(keyword) ||
      item.pengaju?.nama?.toLowerCase().includes(keyword) ||
      item.verifier?.nama?.toLowerCase().includes(keyword)
    );
  });

  const columns: ColumnDef<WoPeminjamanMaterial>[] = [
    {
      header: "No",
      cell: ({ row }) => row.index + 1,
    },
    {
      header: "Nama Workorder",
      accessorFn: (row) => row.workorder?.nama_workorder ?? "-",
    },
    {
      header: "Material",
      accessorFn: (row) => row.material?.nama ?? "-",
    },
    {
      header: "Jumlah Pinjam",
      accessorFn: (row) => row.jumlah_pinjam,
    },
    {
      header: "Jumlah Kembali",
      accessorFn: (row) => row.jumlah_kembali ?? 0,
    },
    {
      header: "Jumlah Rusak",
      accessorFn: (row) => row.jumlah_rusak ?? 0,
    },
    {
      header: "Diajukan",
      accessorFn: (row) => row.pengaju?.nama ?? "-",
    },
    {
      header: "Diverifikasi",
      accessorFn: (row) => row.verifier?.nama ?? "-",
    },
    {
      header: "Tanggal Pinjam",
      accessorFn: (row) => row.diajukan_at,
      cell: ({ getValue }) => {
        const value = getValue() as string;

        return value ? new Date(value).toLocaleString("id-ID") : "-";
      },
    },
    {
      header: "Tanggal Kembali",
      accessorFn: (row) => row.dikembalikan_at,
      cell: ({ getValue }) => {
        const value = getValue() as string | null;

        return value ? new Date(value).toLocaleString("id-ID") : "-";
      },
    },
  ];

  return (
    <div className="mx-10 overflow-hidden rounded-lg bg-white">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-3xl font-semibold">Log Penggunaan Material</h2>

        <div className="flex items-center gap-4">
          <Input
            placeholder="Cari..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}/>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={() => {}}/>
        </div>
      </div>

      <div className="px-4 pb-4">
        <MainTable columns={columns} data={filteredData} loading={loading} />
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PegawaiDetail, PegawaiListItem } from "@/types/pegawaiTypes";
import { getPegawaiById } from "@/services/pegawaiService";
import EmployeeDetailModal from "../modals/EmployeeDetailModal";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/shared/tables/Pagination";
import { MainTable } from "@/components/shared/tables/MainTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  EyeIcon,
  PencilSimpleIcon,
  EnvelopeSimpleIcon,
  UserMinusIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface EmployeeDataContainerProps {
  data: PegawaiListItem[];
  totalPages: number;
  currentPage: number;
  search: string;
  sort: string;
  itemsPerPage: number;
}

type Option = {
  id: number;
  nama: string;
};

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
  const pathname = usePathname();

  // =========================
  // STATE
  // =========================
  const [searchText, setSearchText] = useState(search || "");
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [departemenId, setDepartemenId] = useState<number | undefined>();
  const [jabatanId, setJabatanId] = useState<number | undefined>();
  const [departemenOptions, setDepartemenOptions] = useState<Option[]>([]);
  const [jabatanOptions, setJabatanOptions] = useState<Option[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState<PegawaiDetail | null>(null);

  // =========================
  // FETCH FILTER OPTIONS (IMPORTANT FIX)
  // =========================
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get("/v1/pegawai/meta/filter-options");
        setDepartemenOptions(res.data.departemen || []);
        setJabatanOptions(res.data.jabatan || []);
      } catch (error) {
        console.error("Failed to load filter options", error);
      }
    };
    fetchOptions();
  }, []);

  // =========================
  // MODAL
  // =========================
  const openModal = (type: "create") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", type);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // =========================
  // SEARCH (SERVER SIDE)
  // =========================
  const handleSearchChange = (value: string) => {
    setSearchText(value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("search", value);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // =========================
  // PAGINATION
  // =========================
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    params.set("per_page", String(itemsPerPage));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // =========================
  // FILTER (SERVER SIDE FIXED)
  // =========================
  const handleFilter = (key: "departemen" | "jabatan", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (key === "departemen") {
      const id = value ? Number(value) : undefined;
      setDepartemenId(id);
      if (id) params.set("departemen_id", String(id));
      else params.delete("departemen_id");
    }
    if (key === "jabatan") {
      const id = value ? Number(value) : undefined;
      setJabatanId(id);
      if (id) params.set("jabatan_id", String(id));
      else params.delete("jabatan_id");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    router.refresh();
  };

  // =========================
  // DETAIL (SERVER SIDE FIXED)
  // =========================
  const handleDetail = async (id: number) => {
    try {
      setLoadingDetail(true);

      const data = await getPegawaiById(id);

      setDetailData(data);
      setShowDetail(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const resetFilter = () => {
    setDepartemenId(undefined);
    setJabatanId(undefined);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("departemen_id");
    params.delete("jabatan_id");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // =========================
  // TABLE COLUMNS
  // =========================
  const columns: ColumnDef<PegawaiListItem>[] = [
    {
      header: "No",
      accessorFn: (_row, idx) => (currentPage - 1) * itemsPerPage + idx + 1,
      cell: (info) => info.getValue(),
    },
    {
      header: "Nama",
      accessorFn: (row) => row.pegawai.nama,
    },
    {
      header: "NIP",
      accessorFn: (row) => row.pegawai.nip,
    },
    {
      header: "Departemen",
      accessorFn: (row) => row.pegawai.departemen,
    },
    {
      header: "Jabatan",
      accessorFn: (row) => row.pegawai.jabatan,
    },
    {
      header: "Email",
      accessorFn: (row) => row.email,
    },
    {
      header: "Status Akun",
      accessorFn: (row) => row.is_active,
      cell: ({ getValue }) => {
        const active = getValue<boolean>();

        return (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {active ? "Aktif" : "Nonaktif"}
          </span>
        );
      },
    },
    {
      header: "Aksi",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-col items-start gap-2">
          <button
            disabled={loadingDetail}
            onClick={() => handleDetail(row.original.pegawai.id)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
          >
            <EyeIcon size={16} />
            Detail
          </button>

          <button className="flex items-center gap-2 text-sm text-yellow-600 hover:underline">
            <PencilSimpleIcon size={16} />
            Edit
          </button>

          <button className="flex items-center gap-2 text-sm text-green-600 hover:underline">
            <EnvelopeSimpleIcon size={16} />
            Reset Password
          </button>

          <button className="flex items-center gap-2 text-sm text-red-600 hover:underline">
            <UserMinusIcon size={16} />
            Disable
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-col mx-28 rounded-lg overflow-hidden bg-white">
      {/* HEADER */}
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
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />

          <Button
            variant="primary"
            onClick={() => openModal("create")}
            size="sm"
          >
            <PlusIcon size={18} />
            Buat Baru
          </Button>
        </div>
      </div>

      {/* FILTER (UI TETAP SAMA) */}
      <div className="flex gap-4 px-4 mb-4">
        <select
          value={departemenId ?? ""}
          onChange={(e) => handleFilter("departemen", e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">Filter Departemen</option>
          {departemenOptions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nama}
            </option>
          ))}
        </select>

        <select
          value={jabatanId ?? ""}
          onChange={(e) => handleFilter("jabatan", e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">Filter Jabatan</option>
          {jabatanOptions.map((j) => (
            <option key={j.id} value={j.id}>
              {j.nama}
            </option>
          ))}
        </select>

        <button onClick={resetFilter} className="border px-2 py-1 rounded">
          Reset Filter
        </button>
      </div>

      {/* TABLE */}
      <div className="px-4 pb-4">
        <MainTable columns={columns} data={data} loading={false} />
      </div>
      {showDetail && detailData && (
        <EmployeeDetailModal
          data={detailData}
          onClose={() => {
            setShowDetail(false);
            setDetailData(null);
          }}
        />
      )}
    </div>
  );
}

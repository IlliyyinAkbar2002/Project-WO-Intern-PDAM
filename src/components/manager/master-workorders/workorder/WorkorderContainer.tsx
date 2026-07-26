"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SingleSelect from "@/components/shared/fields/SingleSelect";
import { PlusIcon } from "@phosphor-icons/react";
import { MainTable } from "@/components/shared/tables/MainTable";
import { Pagination } from "@/components/shared/tables/Pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui";
import { columns } from "./columns";
import WorkorderModal from "../modals/master-form-modal/WorkorderModal";
import WorkorderDetailModal from "../modals/detail-form-modal/WorkorderDetailModal";
import { Workorder } from "@/types/workorderTypes";
import { jenisWorkorderOptions } from "@/constants/options";

interface WorkorderContainerProps {
  data: Workorder[];
  totalPages: number;
  currentPage: number;
  search: string;
  itemsPerPage: number;
}

type ModalType = "create" | "edit" | "detail" | null;

export default function WorkorderContainer({
  data,
  totalPages,
  currentPage,
  search,
  itemsPerPage,
}: WorkorderContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // =========================================================
  // QUERY PARAMS
  // =========================================================
  const modal = searchParams.get("modal") as ModalType;
  const modalId = searchParams.get("modal_id");

  const kodePengaduan = searchParams.get("kode_pengaduan");

  // =========================================================
  // LOCAL STATE
  // =========================================================
  const [searchText, setSearchText] = useState(search);
  const [tableData, setTableData] = useState(data);
  const [jenis, setJenis] = useState(searchParams.get("jenis") ?? "");

  // =========================================================
  // SELECTED DATA
  // =========================================================
  const selectedWorkorder = useMemo(() => {
    if (!modalId) return null;

    return data.find((item) => item.id === Number(modalId)) || null;
  }, [tableData, modalId]);

  // =========================================================
  // OPEN MODAL
  // =========================================================
  const openModal = (modalType: "create" | "edit" | "detail", id?: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("modal", modalType);

    if (id) {
      params.set("modal_id", String(id));
    } else {
      params.delete("modal_id");
    }
    router.replace(`?${params.toString()}`, {
      scroll: false,
    });
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================
  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("modal");
    params.delete("modal_id");
    params.delete("kode_pengaduan");
    router.replace(`?${params.toString()}`, {
      scroll: false,
    });
  };

  // =========================================================
  // REALTIME SEARCH
  // =========================================================
  const handleSearchChange = (value: string) => {
    setSearchText(value);

    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  // =========================================================
  // HANDLE PAGE CHANGE
  // =========================================================
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

  // =========================================================
  // HANDLE Filter Lembur/Normal
  // =========================================================
  const handleJenisChange = (selected: { value: string } | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selected?.value) {
      params.set("jenis", selected.value);
    } else {
      params.delete("jenis");
    }
    params.set("page", "1");
    setJenis(selected?.value ?? "");
    router.push(`?${params.toString()}`);
  };

  // =========================================================
  // Use effect untuk update table data ketika props data berubah
  // =========================================================
  useEffect(() => {
    setTableData(data);
  }, [data]);

  return (
    <div className="mx-28 overflow-hidden rounded-xl bg-white">
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}
      <div className="flex items-center justify-between p-4">
        <h2 className="text-3xl font-semibold">Data Workorder</h2>
          <SingleSelect
            placeholder="Normal/Lembur"
            value={
              jenisWorkorderOptions.find((item) => item.value === jenis) ?? null
            }
            options={jenisWorkorderOptions}
            onChange={handleJenisChange}
          />

        <div className="flex items-center gap-4">
          {/* SEARCH */}
          <Input
            placeholder="Pencarian..."
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
          />


          {/* PAGINATION */}
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />

          {/* FLOW A: MANUAL CREATE */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => openModal("create")}
          >
            <PlusIcon size={18} />
            Buat Baru
          </Button>
        </div>
      </div>

      {/* ===================================================== */}
      {/* TABLE */}
      {/* ===================================================== */}
      <MainTable
        columns={columns({
          openModal,
          currentPage,
          itemsPerPage,
          setTableData,
        })}
        data={tableData}
        loading={false}
      />

      {/* ===================================================== */}
      {/* CREATE / EDIT MODAL */}
      {/* ===================================================== */}
      {(modal === "create" || modal === "edit") && (
        <WorkorderModal
          modal={modal}
          id={modalId}
          kodePengaduan={kodePengaduan}
          onClose={closeModal}
          onSuccess={(workorder) => {
            setTableData((prev) => {
              const exists = prev.some((x) => x.id === workorder.id);

              if (exists) {
                return prev.map((x) => (x.id === workorder.id ? workorder : x));
              }

              return [workorder, ...prev];
            });
          }}
        />
      )}

      {/* ===================================================== */}
      {/* DETAIL MODAL */}
      {/* ===================================================== */}
      {modal === "detail" && (
        <WorkorderDetailModal data={selectedWorkorder} onClose={closeModal} />
      )}
    </div>
  );
}

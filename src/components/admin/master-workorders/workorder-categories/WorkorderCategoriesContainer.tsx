"use client";

import { MainTable } from "@/components/shared/tables/MainTable";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "@phosphor-icons/react";
import { deleteJenisWorkorder } from "@/services/jenisWorkorderService";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/shared/tables/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import SingleSelect from "@/components/shared/fields/SingleSelect";
import { sortOptions } from "@/constants/options";
import { columns } from "./columns";
import MasterFormModal from "./modals/master-form-modal/MasterFormModal";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import { useJenisWorkorderStore } from "@/components/admin/master-workorders/workorder-categories/useJenisWorkorderStore";
import { JenisWorkorder } from "@/types";

interface WorkorderCategoriesContainerProps {
  data: JenisWorkorder[];
  totalPages: number;
  currentPage: number;
  search: string;
  sort: string;
  itemsPerPage: number;
}

export default function WorkorderCategoriesContainer({
  data,
  totalPages,
  currentPage,
  search,
  sort,
  itemsPerPage,
}: WorkorderCategoriesContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modal = searchParams.get("modal");
  const modalId = searchParams.get("modal_id");
  const [sortData, setSortData] = useState(sort);
  const [searchText, setSearchText] = useState(search);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { resetForm } = useJenisWorkorderStore();

  useEffect(() => {
    if (searchText.trim() === "") {
      const params = new URLSearchParams(window.location.search);
      if (params.has("search")) {
        params.delete("search");
        params.set("page", currentPage.toString());
        router.push(`?${params.toString()}`);
      }
    }
  }, [searchText]);

  const openModal = (modal: string, id?: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("modal", modal);
    if (id) params.set("modal_id", id.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const closeModal = () => {
    resetForm();
    const params = new URLSearchParams(searchParams);
    params.delete("modal");
    params.delete("modal_id");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.set("search", searchText);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleSortChange = (selected: { value: string } | null) => {
    const sortValue = selected ? selected.value : "";
    setSortData(sortValue);

    const params = new URLSearchParams(searchParams);
    params.set("sort", sortValue);
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteJenisWorkorder(deleteId);
      toast.success("Data berhasil dihapus");
      setShowConfirmModal(false);
      setDeleteId(null);
      router.refresh();
    } catch (err: any) {
      // Display specific error message from the service
      const errorMessage = err.message || "Gagal menghapus data";
      toast.error(errorMessage);
      console.error("Delete error details:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteId(null);
  };

  return (
    <div className="flex-col mx-28 rounded-lg overflow-hidden bg-white">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-semibold">Jenis Workorder</h2>
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
            value={searchText || ""}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Pagination
            totalPages={totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => openModal("create")}
          >
            <PlusCircleIcon size={10} />
            Buat Baru
          </Button>
        </div>
      </div>
      <MainTable
        columns={columns({
          openModal,
          handleDelete,
          currentPage,
          itemsPerPage,
        })}
        data={data}
        loading={false}
      />
      {modal && (
        <MasterFormModal modal={modal} id={modalId} onClose={closeModal} />
      )}

      <ConfirmModal
        open={showConfirmModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus"
        description="Apakah Anda yakin ingin menghapus jenis workorder ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}

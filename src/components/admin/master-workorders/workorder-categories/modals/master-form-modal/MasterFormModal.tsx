"use client";

import SingleSelect from "@/components/shared/fields/SingleSelect";
import { DraggableTable } from "@/components/shared/tables/DraggableTable";
import { columns } from "./columns";
import { useEffect, useRef, useState } from "react";
import { FileMagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useJenisWorkorderStore } from "@/store/useJenisWorkorderStore";
import { useKpi } from "@/hooks/useKpi";
import DetailFormModal from "../detail-form-modal/DetailFormModal";
import { toast } from "sonner";
import PreviewFormModal from "../PreviewFormModal";
import {
  createJenisWorkorder,
  getJenisWorkorderById,
  updateJenisWorkorder,
} from "@/services";
import { Button, Input } from "@/components/ui";

interface MasterFormModalProps {
  modal: string;
  id?: string | null;
  onClose: () => void;
}

export default function MasterFormModal({
  modal,
  id,
  onClose,
}: MasterFormModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submodal = searchParams.get("submodal");
  const mode = modal === "detail";

  const openSubModal = (modal: string, id?: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("submodal", modal);
    if (id) params.set("submodal_id", id.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const closeSubModal = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("submodal");
    params.delete("submodal_id");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const {
    formData,
    setFormData,
    setAllFormData,
    addDetailForm,
    updateDetailForm,
    updateDetailFormOrder,
    removeDetailForm,
  } = useJenisWorkorderStore();

  const hasFetchedRef = useRef(false);
  useEffect(() => {
    const fetchData = async () => {
      if (hasFetchedRef.current) return;
      hasFetchedRef.current = true;

      if ((modal === "edit" || modal === "detail") && id) {
        try {
          const response = await getJenisWorkorderById(Number(id));
          setAllFormData(response);
        } catch (error) {
          toast.error("Gagal mengambil data!");
        }
      } else if (modal === "create") {
        addDetailForm();
      }
    };

    fetchData();
  }, [modal, id, setAllFormData]);

  const kpiData = useKpi();
  const kpiOptions = kpiData.data.map((item) => ({
    value: String(item.id),
    label: item.nama,
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddRow = () => {
    if (!formData.detailForm.every((form) => form.namaField !== "")) {
      toast.error("Isi Nama Field terlebih dahulu");
      return;
    }
    addDetailForm();
  };

  const handleDeleteRow = async (id: number) => {
    const data = formData.detailForm.find((item) => item.id === id);
    if (!data) {
      toast.error("Data tidak ditemukan!");
      return;
    }
    const isSingleRow = formData.detailForm.length === 1;
    const hasValue = data.namaField.trim() !== "";
    if (isSingleRow && hasValue) {
      updateDetailForm(id, {
        namaField: "",
        tipeField: "",
        tipeData: "",
        unitSatuan: null,
        sifat: "",
        min: null,
        max: null,
        parent: null,
        keterangan: null,
        order: 0,
        optionForm: [],
      });
      toast.success("Data berhasil dihapus!");
    } else if (!isSingleRow) {
      removeDetailForm(id);
      if (hasValue) toast.success("Data berhasil dihapus!");
    }
  };

  const handleSubmitRow = (id: number, value: string) => {
    if (!formData.nama.trim() || !formData.kpiId) {
      toast.error("Isi Nama Workorder dan KPI ID terlebih dahulu!");
      return;
    }
    if (!value.trim()) {
      toast.error("Isi Nama Field terlebih dahulu!");
      return;
    }
    updateDetailForm(id, { namaField: value });
    toast.success("Data berhasil ditambahkan!");
  };

  const handleSubmit = async () => {
    if (
      !formData.nama.trim() ||
      !formData.kpiId ||
      !formData.detailForm.every(
        (form) => form.namaField !== "" && form.tipeField !== ""
      )
    ) {
      toast.error("Isi semua field terlebih dahulu!");
      return;
    }
    try {
      setIsSubmitting(true);
      if (formData.id > 0) {
        await updateJenisWorkorder(formData.id, formData);
        toast.success("Data berhasil diperbarui!");
      } else {
        await createJenisWorkorder(formData);
        toast.success("Data berhasil ditambahkan!");
      }
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Gagal menyimpan data!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-80">
      <div className="bg-white rounded-lg overflow-hidden w-full">
        <div className="flex bg-primary-500 justify-between items-center px-6 py-2">
          <h2 className="text-3xl font-semibold text-center text-white">
            {modal === "create"
              ? "Buat"
              : modal === "detail"
              ? "Detail"
              : "Edit"}{" "}
            Jenis Work Order
          </h2>
          <button
            aria-label="Close"
            title="Close"
            className="hover:bg-grey-600 rounded-full p-1"
            onClick={onClose}
          >
            <XIcon className="text-white" size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="rounded-lg border-2 p-4 bg-grey-100 space-y-2">
            <h3 className="text-2xl font-semibold">Form Jenis Work Order</h3>
            <div className="grid grid-cols-3 gap-8">
              <Input
                label="Jenis Work Order"
                placeholder="Isi jenis workorder..."
                value={formData.nama}
                onChange={(e) => setFormData({ nama: e.target.value })}
                disabled={mode}
              />
              <SingleSelect
                label="KPI (Rencana Tindakan)"
                placeholder="Pilih KPI"
                value={
                  kpiOptions.find(
                    (item) => item.value === String(formData.kpiId)
                  ) || null
                }
                onChange={(selected) =>
                  setFormData({ kpiId: Number(selected?.value) })
                }
                options={kpiOptions}
                isDisabled={mode}
              />
            </div>
          </div>
          <div className="bg-grey-100 rounded-lg border-2 p-4">
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="flex p-4 justify-between items-center">
                <h3 className="text-2xl font-semibold">List Field Form</h3>
                <button
                  aria-label="Preview form"
                  title="Preview form"
                  onClick={() => openSubModal("preview")}
                >
                  <FileMagnifyingGlassIcon
                    className="text-primary-500 hover:text-primary-400"
                    size={28}
                  />
                </button>
              </div>
              <div className="overflow-auto max-h-[235px]">
                <DraggableTable
                  columns={columns({
                    openSubModal,
                    handleDeleteRow,
                    handleSubmitRow,
                    handleAddRow,
                    mode,
                  })}
                  data={formData.detailForm}
                  setData={updateDetailFormOrder}
                  isDraggable={!mode}
                />
              </div>
            </div>
          </div>
          {!mode && (
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          )}
        </div>
      </div>
      {submodal === "preview" && <PreviewFormModal onClose={closeSubModal} />}
      {submodal === "detail" && <DetailFormModal onClose={closeSubModal} />}
      {submodal === "edit" && <DetailFormModal onClose={closeSubModal} />}
      {submodal === "create" && <DetailFormModal onClose={closeSubModal} />}
    </div>
  );
}

"use client";

import SingleSelect from "@/components/shared/fields/SingleSelect";
import { FileMagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useJenisWorkorderStore } from "@/components/admin/master-workorders/workorder-categories/useJenisWorkorderStore";
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
import { JenisWorkorderPayload } from "@/types/jenisWorkorderTypes";

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

  const { formData, setFormData, setAllFormData, addDetailForm, removeDetailForm } =
    useJenisWorkorderStore();

  const hasFetchedRef = useRef(false);
  useEffect(() => {
    const fetchData = async () => {
      if (hasFetchedRef.current) return;
      hasFetchedRef.current = true;

      if ((modal === "edit" || modal === "detail") && id) {
        try {
          const response = await getJenisWorkorderById(Number(id));
          setAllFormData(response);
        } catch {
          toast.error("Gagal mengambil data!");
        }
      }

      // Saat create, tambahkan minimal 1 detail form agar list tidak kosong
      if (modal === "create") {
        addDetailForm(formData.id || 0);
      }
    };

    fetchData();
  }, [modal, id, setAllFormData, addDetailForm, formData.id]);

  const kpiData = useKpi();
  const kpiOptions = kpiData.data.map((item) => ({
    value: String(item.id),
    label: item.nama,
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.nama.trim() || !formData.kpiId) {
      toast.error("Isi Nama Workorder dan KPI terlebih dahulu!");
      return;
    }
    try {
      setIsSubmitting(true);
      if (formData.id > 0) {
        const payload: JenisWorkorderPayload = {
          id: formData.id,
          nama: formData.nama,
          kpiId: formData.kpiId,
        };
        await updateJenisWorkorder(formData.id, payload);
        toast.success("Data berhasil diperbarui!");
      } else {
        const payload: JenisWorkorderPayload = {
          nama: formData.nama,
          kpiId: formData.kpiId,
        };
        await createJenisWorkorder(payload);
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
          {/* Form master */}
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

          {/* List Field Form */}
          <div className="bg-grey-100 rounded-lg border-2 p-4">
            <div className="flex justify-between items-center mb-4">
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

            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-grey-200 text-left">
                  <th className="px-4 py-2 border">No</th>
                  <th className="px-4 py-2 border">Nama Field</th>
                  <th className="px-4 py-2 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {formData.detailForm.map((detail, index) => (
                  <tr key={detail.id} className="border-t">
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">
                      {detail.namaField || "—"}
                    </td>
                    <td className="px-4 py-2 border space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openSubModal("detail", detail.id)}
                      >
                        {detail.namaField ? "Lihat Detail" : "Isi Detail"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openSubModal("edit", detail.id)}
                      >
                        ✏️
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDetailForm(formData.id, detail.id)}
                      >
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}

                {/* Baris input field baru */}
                {!mode && (
                  <tr className="border-t">
                    <td className="px-4 py-2 border">
                      {formData.detailForm.length + 1}
                    </td>
                    <td className="px-4 py-2 border">
                      <Input
                        placeholder="Isi nama field..."
                        value={""} // bisa pakai state lokal jika mau
                        onChange={() => {}}
                      />
                    </td>
                    <td className="px-4 py-2 border space-x-2">
                      <Button variant="primary" size="sm">
                        Simpan
                      </Button>
                      <Button variant="secondary" size="sm">
                        Isi Detail
                      </Button>
                      <Button variant="ghost" size="sm">
                        ✏️
                      </Button>
                      <Button variant="ghost" size="sm">
                        ➕
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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

      {/* Submodal */}
      {submodal === "preview" && <PreviewFormModal onClose={closeSubModal} />}
      {(submodal === "detail" ||
        submodal === "edit" ||
        submodal === "create") && <DetailFormModal onClose={closeSubModal} />}
    </div>
  );
}

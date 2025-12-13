"use client";

import SingleSelect from "@/components/shared/fields/SingleSelect";
import {
  DotsNineIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useJenisWorkorderStore } from "@/components/admin/master-workorders/workorder-categories/useJenisWorkorderStore";
import { useKpi } from "@/hooks/useKpi";
import DetailFormModal from "../detail-form-modal/DetailFormModal";
import { toast } from "sonner";
import PreviewFormModal from "../PreviewFormModal";
import {
  getJenisWorkorderById,
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
    removeDetailForm,
    createJenisWorkorder: createJenisWorkorderStore,
    updateJenisWorkorder: updateJenisWorkorderStore,
  } = useJenisWorkorderStore();
  const [newFieldName, setNewFieldName] = useState("");
  const [isAddingField, setIsAddingField] = useState(false);

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
    };

    fetchData();
  }, [modal, id, setAllFormData, addDetailForm, formData.id]);

  const kpiData = useKpi();
  const kpiOptions = kpiData.data.map((item) => ({
    value: String(item.id),
    label: item.nama,
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddField = async (openDetail?: boolean) => {
    if (!newFieldName.trim()) {
      toast.error("Isi nama field terlebih dahulu!");
      return;
    }
    setIsAddingField(true);
    try {
      const newDetail = await addDetailForm(formData.id, {
        namaField: newFieldName.trim(),
        order: formData.detailForm.length + 1,
      });
      setNewFieldName("");
      toast.success(openDetail ? "Field disimpan, isi detail sekarang." : "Field berhasil ditambahkan!");
      if (openDetail) {
        openSubModal("edit", newDetail.id);
      }
    } catch (error) {
      console.error("Error adding detail field:", error);
      toast.error("Gagal menambahkan field!");
    } finally {
      setIsAddingField(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.nama.trim() || !formData.kpiId) {
      toast.error("Isi Nama Workorder dan KPI terlebih dahulu!");
      return;
    }
    try {
      setIsSubmitting(true);
      if (formData.id > 0) {
        await updateJenisWorkorderStore(formData.id, {
          nama: formData.nama,
          kpiId: formData.kpiId,
        });
        toast.success("Data berhasil diperbarui!");
      } else {
        await createJenisWorkorderStore({
          nama: formData.nama,
          kpiId: formData.kpiId,
        });
        toast.success("Data berhasil ditambahkan!");
      }
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      const message =
        error instanceof Error ? error.message : "Gagal menyimpan data!";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-10">
      <div className="bg-white rounded-[10px] overflow-hidden w-full max-w-5xl shadow-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex bg-[#2d499b] justify-between items-center px-8 py-4">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {modal === "create"
              ? "Buat Nama Work Order"
              : modal === "detail"
                ? "Detail Nama Work Order"
                : "Edit Nama Work Order"}
          </h2>
          <button
            aria-label="Close"
            title="Close"
            className="hover:bg-white/20 rounded-full p-1 transition-colors"
            onClick={onClose}
          >
            <XIcon className="text-white" size={24} />
          </button>
        </div>

        <div className="p-8 space-y-5 bg-white overflow-y-auto flex-1">
          {/* Form Tambah Nama Work Order */}
          <div className="rounded-[10px] border border-[#afbaca] p-5 bg-[#f7f7f7]">
            <h3 className="text-xl font-semibold text-[#606977] mb-4">
              Form Tambah Nama Work Order
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Jenis Work Order"
                placeholder="Isi jenis work order..."
                value={formData.nama}
                onChange={(e) => setFormData({ nama: e.target.value })}
                disabled={mode}
                required
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
          <div className="rounded-[10px] border border-[#e9eff6] bg-[#f9fafb] overflow-hidden">
            {/* Header dengan title dan search */}
            <div className="p-5 pb-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-[#455468]">
                  List Field Form
                </h3>
              </div>
              {/* Search bar */}
              <div className="flex items-center gap-2 max-w-md">
                <div className="flex items-center gap-2 border border-[#4c64a7] rounded-md px-3 py-2 bg-white flex-1">
                  <MagnifyingGlassIcon size={20} className="text-[#73aad3]" />
                  <input
                    type="text"
                    placeholder="Cari"
                    className="outline-none text-sm text-[#73aad3] placeholder:text-[#73aad3] flex-1 bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-[#2d499b] text-white">
                  <th className="px-4 py-3 text-left font-bold w-10"></th>
                  <th className="px-4 py-3 text-left font-bold w-16">No</th>
                  <th className="px-4 py-3 text-left font-bold">Nama Field</th>
                  <th className="px-4 py-3 text-center font-bold w-48">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {formData.detailForm.map((detail, index) => (
                  <tr key={detail.id} className="border-b border-[#e9eff6] bg-white">
                    <td className="px-4 py-5">
                      <DotsNineIcon size={20} className="text-[#7e92a2] cursor-grab" />
                    </td>
                    <td className="px-4 py-5 text-[#1c222b]">
                      {index + 1}
                    </td>
                    <td className="px-4 py-5 text-[#1c222b]">
                      {detail.namaField || "—"}
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openSubModal("detail", detail.id)}
                          className={`px-4 py-1 rounded-md text-xs font-medium text-white whitespace-nowrap ${detail.namaField
                            ? "bg-[#2d499b] hover:bg-[#243d82]"
                            : "bg-[#2a83c6] hover:bg-[#2375b0]"
                            }`}
                        >
                          {detail.namaField ? "Lihat Detail" : "Isi Detail"}
                        </button>
                        <button
                          onClick={() => openSubModal("edit", detail.id)}
                          className="p-2 hover:bg-gray-100 rounded-md"
                          aria-label="Edit field"
                        >
                          <PencilSimpleIcon size={20} className="text-[#7e92a2]" />
                        </button>
                        <button
                          onClick={() => removeDetailForm(formData.id, detail.id)}
                          className="p-2 hover:bg-gray-100 rounded-md"
                          aria-label="Hapus field"
                        >
                          <TrashIcon size={20} className="text-[#7e92a2]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Baris input field baru */}
                {!mode && (
                  <tr className="border-b border-[#e9eff6] bg-white">
                    <td className="px-4 py-5">
                      <DotsNineIcon size={20} className="text-[#7e92a2]" />
                    </td>
                    <td className="px-4 py-5 text-[#1c222b]">
                      {formData.detailForm.length + 1}
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Isi nama field..."
                          value={newFieldName}
                          onChange={(e) => setNewFieldName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddField()}
                          className="flex-1 border border-[#4c64a7] rounded-md px-3 py-2 text-sm placeholder:text-[#73aad3] outline-none focus:border-[#2d499b]"
                        />
                        <button
                          onClick={() => handleAddField(false)}
                          disabled={isAddingField}
                          className="px-4 py-2 rounded-md text-xs font-medium text-white bg-[#2a83c6] hover:bg-[#2375b0] disabled:opacity-50"
                        >
                          Simpan
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleAddField(true)}
                          disabled={isAddingField}
                          className="px-4 py-1 rounded-md text-xs font-medium text-white bg-[#2a83c6] hover:bg-[#2375b0] disabled:opacity-50 whitespace-nowrap"
                        >
                          Isi Detail
                        </button>
                        <button
                          onClick={() => openSubModal("edit")}
                          className="p-2 hover:bg-gray-100 rounded-md"
                          aria-label="Edit field"
                        >
                          <PencilSimpleIcon size={20} className="text-[#7e92a2]" />
                        </button>
                        <button
                          onClick={() => setNewFieldName("")}
                          className="p-2 hover:bg-gray-100 rounded-md"
                          aria-label="Clear field"
                        >
                          <TrashIcon size={20} className="text-[#7e92a2]" />
                        </button>
                        <button
                          onClick={() => handleAddField(true)}
                          disabled={isAddingField}
                          className="w-6 h-6 rounded-full bg-[#3abfef] hover:bg-[#2eb0e0] flex items-center justify-center disabled:opacity-50"
                          aria-label="Tambah field"
                        >
                          <PlusIcon size={14} className="text-white" weight="bold" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Submit Button */}
          {!mode && (
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-md text-lg font-medium text-white bg-[#2d499b] hover:bg-[#243d82] disabled:opacity-50"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </button>
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

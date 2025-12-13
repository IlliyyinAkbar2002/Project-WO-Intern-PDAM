"use client";
import { useState, useEffect, useRef } from "react";
import { useJenisWorkorderStore } from "@/components/admin/master-workorders/workorder-categories/useJenisWorkorderStore";
import { XIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import {
  sifatOptions,
  tipeDataOptions,
  tipeFieldOptions,
} from "@/constants/options";
import { DraggableTable } from "@/components/shared/tables/DraggableTable";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import SingleSelect from "@/components/shared/fields/SingleSelect";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import {
  getDisabledFields,
  prepareDetailForm,
  validateDetailForm,
} from "@/utils/detailFormUtils";
import { DetailForm, OptionForm } from "@/types";

interface DetailFormModalProps {
  onClose: () => void;
}

export default function DetailFormModal({ onClose }: DetailFormModalProps) {
  const searchParams = useSearchParams();
  const submodal = searchParams.get("submodal");
  const submodalId = searchParams.get("submodal_id");
  const mode = submodal === "detail";

  const [editRowId, setEditRowId] = useState<number | null>(null);

  // Store: ambil formData (master + detail) dan fungsi update state lokal
  const { formData, updateDetailForm: updateDetailFormStore } =
    useJenisWorkorderStore();

  // Opsi parent field (hanya field bertipe dropdown selain current)
  const parentOptions = [
    { label: "Tanpa Parent", value: "0" },
    ...(formData?.detailForm
      ?.filter(
        (item) =>
          item.id !== Number(submodalId) && item.tipeField === "dropdown"
      )
      .map((item) => ({
        value: String(item.id),
        label: item.namaField,
      })) || []),
  ];

  // State detail form yang sedang diedit/dibuat (wajib punya jenisWorkorderId)
  const [detailForm, setDetailForm] = useState<DetailForm>({
    id: 0,
    jenisWorkorderId: formData.id,
    namaField: "",
    tipeField: "",
    tipeData: "",
    unitSatuan: null,
    sifat: "",
    min: null,
    max: null,
    parent: null,
    keterangan: null,
    hintText: "",
    order: 0,
    optionForm: [],
  });

  // Sync jenisWorkorderId jika formData berubah
  useEffect(() => {
    setDetailForm((prev) => ({
      ...prev,
      jenisWorkorderId: formData.id,
    }));
  }, [formData.id]);

  const disabledFields = getDisabledFields(detailForm.tipeField);

  // State untuk daftar opsi dan opsi yang sedang diedit
  const [options, setOptions] = useState<OptionForm[]>([]);
  const [option, setOption] = useState<OptionForm>({
    id: 0,
    namaOpsi: "",
    parent: null,
    order: 0,
  });

  const resetOption = () => {
    setOption({
      id: 0,
      namaOpsi: "",
      parent: null,
      order: 0,
    });
  };

  // Daftar opsi parent berdasarkan field parent yang dipilih
  const parentOptionField = formData.detailForm.find(
    (form) => form.id === detailForm.parent
  );
  const parentOptionOptions =
    parentOptionField && parentOptionField.optionForm.length > 0
      ? parentOptionField.optionForm.map((item) => ({
        value: String(item.id),
        label: item.namaOpsi,
      }))
      : [{ label: "Tanpa Parent", value: "0" }];

  // Tambah baris opsi baru (local state)
  const handleAddRow = () => {
    if (editRowId) {
      toast.error("Simpan perubahan opsi terlebih dahulu!");
      return;
    }
    if (options.every((opt) => opt.namaOpsi !== "")) {
      setOptions((prev) => [
        ...prev,
        { ...option, id: -Date.now(), order: prev.length + 1 },
      ]);
    } else {
      toast.error("Isi Uraian & Parent terlebih dahulu!");
    }
  };

  // Submit baris opsi yang sedang diedit/dimasukkan (local state)
  const handleSubmitRow = () => {
    if (option.namaOpsi.trim() !== "" && option.parent !== null) {
      setOptions((prev) =>
        prev.map((opt) =>
          opt.id === option.id
            ? { ...opt, namaOpsi: option.namaOpsi, parent: option.parent }
            : opt
        )
      );
      if (editRowId) {
        toast.success("Data berhasil diperbarui!");
        setEditRowId(null);
      } else {
        toast.success("Data berhasil ditambahkan!");
      }
    } else {
      toast.error("Isi Uraian & Parent terlebih dahulu!");
      return;
    }
    resetOption();
  };

  // Prefill data saat membuka modal edit/detail berdasarkan submodal_id
  const hasFetchedRef = useRef(false);
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    if (submodalId) {
      const numericId = Number(submodalId);
      const existingForm = formData.detailForm.find(
        (item) => item.id === numericId
      );
      if (existingForm) {
        setDetailForm({
          ...existingForm,
          jenisWorkorderId: existingForm.jenisWorkorderId ?? formData.id,
        });
        setOptions(existingForm.optionForm);
      }
    }
  }, [submodalId]);

  // Tambahkan nama parent (display) ke tiap opsi untuk tabel
  const modifiedOptions = options.map((opt) => {
    const parentOption = parentOptionOptions.find(
      (parent) => parent.value === String(opt.parent)
    );
    return {
      ...opt,
      namaParent: parentOption ? parentOption.label : "Isi parent...",
    };
  });

  // Edit satu baris opsi
  const handleEditRow = (id: number) => {
    const optionToEdit = options.find((opt) => opt.id === id);
    if (optionToEdit && optionToEdit.namaOpsi !== "") {
      setOption({ ...optionToEdit });
      setEditRowId(id);
    }
  };

  // Batalkan edit opsi
  const handleCancelEditRow = () => {
    setEditRowId(null);
    resetOption();
  };

  // Hapus baris opsi (local state)
  const handleDeleteRow = (id: number) => {
    const data = options.find((item) => item.id === id);
    if (!data) {
      toast.error("Data tidak ditemukan!");
      return;
    }
    const newOptions = options.filter((opt) => opt.id !== id);
    setOptions(newOptions.map((opt, index) => ({ ...opt, order: index + 1 })));
    toast.success("Data berhasil dihapus!");
    resetOption();
  };

  // Input perubahan field pada opsi yang sedang diedit
  const handleInputRow = (
    id: number,
    field: keyof OptionForm,
    value: string | number | null
  ) => {
    setOption((prev) => ({ ...prev, id: id, [field]: value }));
  };

  // Submit detail form: persist ke backend via service, lalu sinkronkan store
  const handleSubmit = async () => {
    const isValid = validateDetailForm(detailForm, options, submodalId);
    if (!isValid) return;

    const cleanedForm = prepareDetailForm(detailForm, options);
    // Catatan:
    // - Untuk master yang belum tersimpan (id=0), updateDetailFormStore akan menyimpan secara lokal.
    // - Untuk master & detail yang sudah tersimpan (id>0), updateDetailFormStore akan memanggil API update.
    try {
      await updateDetailFormStore(formData.id, detailForm.id, cleanedForm);
      toast.success("Data berhasil disimpan!");
      onClose();
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Gagal menyimpan data!";
      toast.error(message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-80">
      <div className="bg-white rounded-lg p-5 space-y-5">
        <div className="relative flex items-center justify-center">
          <h2 className="text-3xl font-semibold text-black">Detail Field</h2>
          <button
            aria-label="Close"
            title="Close"
            className="absolute right-0 hover:bg-grey-200 rounded-full p-1"
            onClick={onClose}
          >
            <XIcon className="text-black" size={20} />
          </button>
        </div>

        {/* Form field utama */}
        <div className="grid grid-cols-3 gap-x-8 gap-y-3">
          <Input label="Jenis Work Order" value={formData.nama} disabled />

          <Input
            label="Nama Field"
            placeholder="Isi nama field..."
            value={detailForm.namaField || ""}
            onChange={(e) =>
              setDetailForm({ ...detailForm, namaField: e.target.value })
            }
            disabled={submodal !== "edit"}
            required
          />

          <SingleSelect
            label="Tipe Field"
            placeholder="Pilih Tipe Field"
            value={
              tipeFieldOptions.find(
                (item) => item.value === String(detailForm.tipeField)
              ) || null
            }
            onChange={(selected) =>
              setDetailForm({
                ...detailForm,
                tipeField: selected?.value,
              })
            }
            options={tipeFieldOptions}
            isDisabled={mode}
            required
          />

          <SingleSelect
            label="Tipe Data"
            placeholder="Pilih Tipe Data"
            value={
              tipeDataOptions.find(
                (item) => item.value === String(detailForm.tipeData)
              ) || null
            }
            onChange={(selected) =>
              setDetailForm({
                ...detailForm,
                tipeData: selected?.value,
              })
            }
            options={tipeDataOptions}
            isDisabled={mode || disabledFields.includes("tipeData")}
            required
          />

          <Input
            label="Satuan Unit"
            placeholder="cm/m/pcs"
            value={detailForm.unitSatuan || ""}
            onChange={(e) =>
              setDetailForm({ ...detailForm, unitSatuan: e.target.value })
            }
            disabled={mode || disabledFields.includes("unitSatuan")}
          />

          <SingleSelect
            label="Sifat"
            placeholder="Pilih Sifat"
            value={
              sifatOptions.find(
                (item) => item.value === String(detailForm.sifat)
              ) || null
            }
            onChange={(selected) =>
              setDetailForm({
                ...detailForm,
                sifat: selected?.value,
              })
            }
            options={sifatOptions}
            isDisabled={mode}
            required
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Minimal"
              type="number"
              min={0}
              value={detailForm.min ?? 0}
              onChange={(e) =>
                setDetailForm({
                  ...detailForm,
                  min: Number(e.target.value),
                })
              }
              disabled={mode || disabledFields.includes("min")}
            />
            <Input
              label="Maksimal"
              type="number"
              min={0}
              value={detailForm.max ?? 0}
              onChange={(e) =>
                setDetailForm({
                  ...detailForm,
                  max: Number(e.target.value),
                })
              }
              disabled={mode || disabledFields.includes("max")}
            />
          </div>

          <SingleSelect
            label="Parent Field"
            placeholder="Pilih Parent Field"
            value={
              parentOptions.find(
                (item) => item.value === String(detailForm.parent)
              ) || null
            }
            onChange={(selected) =>
              setDetailForm({
                ...detailForm,
                parent: Number(selected?.value),
              })
            }
            options={parentOptions}
            isDisabled={mode || disabledFields.includes("parent")}
            required
          />

          <Input
            label="Keterangan"
            placeholder="Isi keterangan..."
            value={detailForm.keterangan || ""}
            onChange={(e) =>
              setDetailForm({
                ...detailForm,
                keterangan: e.target.value,
              })
            }
            disabled={mode}
          />
        </div>

        {/* Tabel opsi untuk tipe dropdown */}
        {detailForm.tipeField === "dropdown" && (
          <div className="bg-grey-100 rounded-lg p-4">
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="flex p-4 justify-between items-center">
                <h3 className="text-2xl font-semibold">Detail Pilihan</h3>
              </div>
              <div className="overflow-auto max-h-[202px]">
                <DraggableTable
                  columns={columns({
                    handleEditRow,
                    handleDeleteRow,
                    handleAddRow,
                    handleInputRow,
                    handleSubmitRow,
                    handleCancelEditRow,
                    parentOptionOptions,
                    option,
                    editRowId,
                    mode,
                  })}
                  data={modifiedOptions}
                  setData={setOptions}
                  isDraggable={!mode}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tombol simpan */}
        {!mode && (
          <div className="flex justify-end">
            <Button variant="primary" size="md" onClick={handleSubmit}>
              Simpan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

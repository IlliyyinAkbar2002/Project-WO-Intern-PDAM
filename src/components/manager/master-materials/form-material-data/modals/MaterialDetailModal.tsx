"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { XIcon } from "@phosphor-icons/react";
import {
  getMaterialById,
  updateMaterial,
  editMaterial,
} from "@/services/materialService";
import { Material } from "@/types/materialTypes";
import Swal from "sweetalert2";

interface MaterialDetailModalProps {
  onClose?: () => void;
  onSuccess?: (material: Material) => void;
}

export default function MaterialDetailModal({
  onClose,
  onSuccess,
}: MaterialDetailModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submodal = searchParams.get("submodal");
  const submodalId = searchParams.get("submodal_id");
  const mode = submodal === "detail";
  const [material, setMaterial] = useState<Material | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!submodalId) return;
      try {
        const data = await getMaterialById(submodalId);
        setMaterial(data);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Gagal mengambil data material",
        });
        closeModal();
      }
    };
    fetch();
  }, [submodalId]);

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("submodal");
    params.delete("submodal_id");
    router.replace(`?${params.toString()}`, { scroll: false });
    if (onClose) onClose();
  };

  const handleSave = async () => {
    if (!material) return;
    if (!material.nama || material.nama.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Validasi",
        text: "Nama material wajib diisi",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Simpan Perubahan?",
      text: "Data material akan diperbarui",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Simpan",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      setIsSubmitting(true);
      Swal.fire({
        title: "Memperbarui material...",
        text: "Mohon tunggu",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      let updatedMaterial: Material;

      if (searchParams.get("submodal") === "edit") {
        updatedMaterial = await editMaterial(material.kode_material, {
          nama: material.nama,
          jumlah_stok: material.jumlah_stok,
        });
      } else {
        updatedMaterial = await updateMaterial(material.kode_material, {
          nama: material.nama,
          jumlah_stok: material.jumlah_stok,
        });
      }
      onSuccess?.(updatedMaterial);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data material berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
      });
      closeModal();
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err.message || "Gagal memperbarui data material",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!material) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-8">
      <div className="bg-white rounded-lg overflow-hidden w-full max-w-2xl">
        <div className="flex bg-primary-500 justify-between items-center px-6 py-2">
          <h2 className="text-2xl font-semibold text-white">
            {mode ? "Detail Material" : "Edit Material"}
          </h2>
          <button
            aria-label="Close"
            title="Close"
            className="hover:bg-grey-600 rounded-full p-1"
            onClick={closeModal}
          >
            <XIcon className="text-white" size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nama"
              placeholder="Nama material"
              value={material.nama}
              onChange={(e) =>
                setMaterial({ ...material, nama: e.target.value })
              }
              disabled={mode}
              className="disabled:bg-grey-300 disabled:placeholder-grey-700"
            />
            <Input
              label="Kode"
              placeholder="Kode material"
              value={material.kode_material || ""}
              disabled
              className="disabled:bg-grey-300"
            />
            <Input
              label="Jumlah Stok"
              placeholder="Stok material"
              type="number"
              value={String(material.jumlah_stok)}
              onChange={(e) =>
                setMaterial({
                  ...material,
                  jumlah_stok: Number(e.target.value || 0),
                })
              }
              disabled={mode}
              className="disabled:bg-grey-300"
            />
            <Input
              label="Pembuat"
              value={material.pegawai?.nama || ""}
              disabled
              className="disabled:bg-grey-300"
            />
          </div>

          <div className="flex justify-end">
            <Button variant="secondary" size="md" onClick={closeModal}>
              Tutup
            </Button>
            {!mode && (
              <>
                <div className="w-4" />
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSave}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

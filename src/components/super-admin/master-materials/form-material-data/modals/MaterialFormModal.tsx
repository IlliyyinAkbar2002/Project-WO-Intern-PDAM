"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import SingleSelect from "@/components/shared/fields/SingleSelect";
import { getUsers } from "@/services/userService";
import { createMaterial, getMaterials } from "@/services/materialService";
import { toast } from "sonner";

interface MaterialFormModalProps {
  onClose?: () => void;
}

export default function MaterialFormModal({ onClose }: MaterialFormModalProps) {
  const router = useRouter();
  const [kodeMaterial, setKodeMaterial] = useState(0);
  const [nama, setNama] = useState("");
  const [jumlahStok, setJumlahStok] = useState("");
  const [pegawaiId, setPegawaiId] = useState<number | null>(null);
  const [usersOptions, setUsersOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getMaterials()
      .then((users) =>
        setUsersOptions(
          users.map((u) => ({ value: String(u.kode_material), label: u.nama })),
        ),
      )
      .catch(() => setUsersOptions([]));
  }, []);

  const handleSubmit = async () => {
    if (!nama.trim()) {
      toast.error("Isi nama material terlebih dahulu");
      return;
    }

    const payload: any = {
      kode_material: Number(kodeMaterial),
      nama: nama.trim(),
      jumlah_stok: Number(jumlahStok),
    };

    if (!kodeMaterial) {
      toast.error("Kode material wajib diisi");
      return;
    }

    if (!nama.trim()) {
      toast.error("Nama material wajib diisi");
      return;
    }

    if (!jumlahStok) {
      toast.error("Jumlah stok wajib diisi");
      return;
    }

    try {
      setIsSubmitting(true);
      await createMaterial(payload);
      toast.success("Material berhasil ditambahkan");
      // Close or navigate back to list
      if (onClose) onClose();
      else router.push("/protected/admin/master-materials/material-data");
      router.refresh();
    } catch (error) {
      toast.error("Gagal menyimpan data material");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-8">
      <div className="bg-white rounded-lg overflow-hidden w-full max-w-2xl">
        <div className="flex bg-primary-500 justify-between items-center px-6 py-2">
          <h2 className="text-2xl font-semibold text-white">
            Form Data Material
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nama"
              placeholder="Nama material"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
            <Input
              label="Kode"
              placeholder="Kode material"
              value={kodeMaterial || ""}
              onChange={(e) => setKodeMaterial(Number(e.target.value || 0))}
            />
            <Input
              label="Jumlah Stok"
              placeholder="Stok material"
              value={jumlahStok}
              onChange={(e) => setJumlahStok(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={() => (onClose ? onClose() : router.back())}
            >
              Batal
            </Button>
            <div className="w-4" />
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

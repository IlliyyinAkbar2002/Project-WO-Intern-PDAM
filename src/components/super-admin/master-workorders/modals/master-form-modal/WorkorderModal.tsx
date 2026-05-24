"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { XIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import SingleSelect from "@/components/shared/fields/SingleSelect";
import { Button } from "@/components/ui";
import { useWorkorderStore } from "../../workorder/useWorkorderStore";
import {
  createWorkorder,
  getWorkorderById,
  updateWorkorder,
} from "@/services/workorderService";
import { getPegawai } from "@/services/pegawaiService";
import { getPengaduan } from "@/services/pengaduanService";
import { getJenisWorkorders } from "@/services/jenisWorkorderService";
import { JenisWorkorder, KategoriWorkorder } from "@/types/jenisWorkorderTypes";
import { WorkorderInput } from "@/types/workorderTypes";

interface MasterFormModalProps {
  modal: "create" | "edit" | "detail";
  id?: string | null;
  onClose: () => void;
}

interface SelectOption {
  value: string;
  label: string;
  kategori?: KategoriWorkorder | null;
}

interface PegawaiResponse {
  pegawai: {
    id: number;
    nama: string;
  };
}

interface PengaduanResponse {
  kode_pengaduan: string;
  judul: string;
}

const FIELDS_MAP: Record<KategoriWorkorder, string[]> = {
  meter: [
    "Nomor Meter",
    "Kondisi Meter Awal",
    "Kondisi Meter Akhir",
    "Hasil Kalibrasi",
  ],
  jaringan: [
    "Jenis Pipa",
    "Diameter Pipa",
    "Panjang Pipa",
    "Tingkat Kerusakan",
    "Tindakan Perbaikan",
    "Hasil Inspeksi",
  ],
  infrastruktur: [
    "Nama Aset",
    "Jenis Aset",
    "Kapasitas",
    "Kondisi Awal",
    "Kondisi Akhir",
    "Jadwal Pemeliharaan",
    "Tindakan",
  ],
};

interface PreviewFieldProps {
  number: number;
  label: string;
}

function PreviewField({ number, label }: PreviewFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">
        {number}. {label}
      </label>
      <div className="rounded-md border bg-grey-50 px-3 py-2 text-sm text-muted-foreground">
        Akan diisi oleh SPV di mobile
      </div>
    </div>
  );
}

export default function JenisWorkorderModal({
  modal,
  id,
  onClose,
}: MasterFormModalProps) {
  const router = useRouter();
  const isCreate = modal === "create";
  const isEdit = modal === "edit";
  const isDetail = modal === "detail";
  const { formData, setFormData, resetForm } = useWorkorderStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pegawaiOptions, setPegawaiOptions] = useState<SelectOption[]>([]);
  const [pengaduanOptions, setPengaduanOptions] = useState<SelectOption[]>([]);
  const [jenisWorkorderOptions, setJenisWorkorderOptions] = useState<
    SelectOption[]
  >([]);

  // =========================================================
  // SELECTED JENIS WORKORDER
  // =========================================================
  const selectedJenisWorkorder = useMemo(() => {
    return jenisWorkorderOptions.find(
      (item) => item.value === String(formData.jenisWorkorderId),
    );
  }, [jenisWorkorderOptions, formData.jenisWorkorderId]);

  // =========================================================
  // SELECTED KATEGORI
  // =========================================================
  const selectedKategori = useMemo(() => {
    return selectedJenisWorkorder?.kategori ?? null;
  }, [selectedJenisWorkorder]);

  // =========================================================
  // FETCH INITIAL DATA
  // =========================================================
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [pegawaiResp, pengaduanResp, jenisResp] = await Promise.all([
          getPegawai(1, 1000, "", ""),
          getPengaduan({
            page: 1,
            search: "",
            sort: "desc",
          }),

          getJenisWorkorders(1, 1000, "", "desc", true),
        ]);

        // ===================================================
        // PEGAWAI
        // ===================================================
        setPegawaiOptions(
          pegawaiResp.data.map((item: PegawaiResponse) => ({
            value: String(item.pegawai.id),
            label: item.pegawai.nama,
          })),
        );

        // ===================================================
        // PENGADUAN
        // ===================================================
        setPengaduanOptions(
          (pengaduanResp.data || []).map((item: PengaduanResponse) => ({
            value: item.kode_pengaduan,
            label: `${item.kode_pengaduan} - ${item.judul}`,
          })),
        );

        // ===================================================
        // JENIS WORKORDER
        // ===================================================
        setJenisWorkorderOptions(
          jenisResp.data
            .filter((item: JenisWorkorder) => item.is_active)
            .map((item: JenisWorkorder) => ({
              value: String(item.id),
              label: item.nama,
              kategori: item.kategori,
            })),
        );
      } catch (error) {
        console.error(error);
        toast.error("Gagal mengambil data");
      }
    };
    fetchInitialData();
  }, []);

  // =========================================================
  // FETCH DETAIL
  // =========================================================
  useEffect(() => {
    if (!id || isCreate) return;

    const fetchDetail = async () => {
      try {
        const response = await getWorkorderById(id);

        setFormData({
          id: response.id,
          jenisWorkorderId: response.jenisWorkorderId,
          pengaduanId: response.kodePengaduan ?? "",
          pegawaiId: response.picId,
        });
      } catch (error) {
        console.error(error);
        toast.error("Gagal mengambil detail workorder");
      }
    };
    fetchDetail();
  }, [id, isCreate, setFormData]);

  // =========================================================
  // RESET FORM
  // =========================================================
  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  // =========================================================
  // HANDLE SUBMIT
  // =========================================================
  const handleSubmit = async () => {
    try {
      if (!formData.jenisWorkorderId) {
        toast.error("Jenis workorder wajib dipilih");
        return;
      }

      if (!formData.pengaduanId) {
        toast.error("Pengaduan wajib dipilih");
        return;
      }

      if (!formData.pegawaiId) {
        toast.error("SPV wajib dipilih");
        return;
      }

      setIsSubmitting(true);

      const payload: WorkorderInput = {
        namaWorkorder: selectedJenisWorkorder?.label ?? "",
        kodePengaduan: formData.pengaduanId,
        jenisWorkorderId: formData.jenisWorkorderId,
        picId: formData.pegawaiId,
        userId: 1,
        departemenId: 1,
        deskripsi: "",
        lokasi: "",
        prioritas: "Sedang",
        status: "Open",
      };

      if (id && isEdit) {
        await updateWorkorder(id, payload);
        toast.success("Workorder berhasil diperbarui");
      } else {
        await createWorkorder(payload);
        toast.success("Workorder berhasil dibuat");
      }

      router.refresh();

      onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan workorder",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // PREVIEW FIELD
  // =========================================================
  const renderPreviewFields = () => {
    if (!selectedKategori) {
      return (
        <div className="text-sm text-muted-foreground">
          Pilih jenis workorder terlebih dahulu
        </div>
      );
    }

    const fields = FIELDS_MAP[selectedKategori];

    return (
      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <PreviewField key={field} number={index + 1} label={field} />
        ))}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between bg-primary-500 px-6 py-4">
          <h2 className="text-2xl font-semibold text-white">
            {isCreate
              ? "Buat Workorder"
              : isEdit
                ? "Edit Workorder"
                : "Detail Workorder"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-primary-400"
          >
            <XIcon size={20} className="text-white" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col gap-6 overflow-hidden p-4">
          {/* FORM */}
          <div className="rounded-xl border bg-grey-100 px-6 py-4">
            <h3 className="mb-4 text-xl font-semibold">Informasi Workorder</h3>
            <div className="grid grid-cols-2 gap-6">
              {/* PENGADUAN */}
              <SingleSelect
                label="Pengaduan"
                placeholder="Pilih pengaduan"
                options={pengaduanOptions}
                value={
                  pengaduanOptions.find(
                    (item) => item.value === formData.pengaduanId,
                  ) || null
                }
                onChange={(selected) =>
                  setFormData({
                    pengaduanId: selected.value,
                  })
                }
                isDisabled={isDetail}
              />

              {/* JENIS WORKORDER */}
              <SingleSelect
                label="Jenis Workorder"
                placeholder="Pilih jenis workorder"
                options={jenisWorkorderOptions}
                value={selectedJenisWorkorder || null}
                onChange={(selected) =>
                  setFormData({
                    jenisWorkorderId: Number(selected.value),
                  })
                }
                isDisabled={isDetail}
              />

              {/* SPV */}
              <SingleSelect
                label="Ditujukan Kepada"
                placeholder="Pilih SPV"
                options={pegawaiOptions}
                value={
                  pegawaiOptions.find(
                    (item) => item.value === String(formData.pegawaiId),
                  ) || null
                }
                onChange={(selected) =>
                  setFormData({
                    pegawaiId: Number(selected.value),
                  })
                }
                isDisabled={isDetail}
              />

              {/* KATEGORI */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Kategori
                </label>

                <div className="rounded-lg border bg-white px-4 py-3 text-sm">
                  {selectedKategori || "-"}
                </div>
              </div>
            </div>
          </div>

          {/* PREVIEW */}
          <div className="flex h-[420px] flex-col overflow-hidden rounded-xl border">
            <div className="bg-primary-500 px-6 py-4">
              <h3 className="text-lg font-semibold text-white">
                Preview Field Spesifikasi
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto bg-grey-100 px-6 py-4 pb-10">
              {renderPreviewFields()}
            </div>
          </div>

          {/* FOOTER */}
          {!isDetail && (
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
    </div>
  );
}

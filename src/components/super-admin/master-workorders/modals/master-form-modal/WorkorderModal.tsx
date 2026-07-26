"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
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
import { getPengaduanOptions } from "@/services/pengaduanService";
import { getJenisWorkorders } from "@/services/jenisWorkorderService";
import { JenisWorkorder, KategoriWorkorder } from "@/types/jenisWorkorderTypes";
import { WorkorderInput, PrioritasWorkorder, Workorder } from "@/types/workorderTypes";
import { PegawaiListItem } from "@/types/pegawaiTypes";
import Swal from "sweetalert2";

interface MasterFormModalProps {
  modal: "create" | "edit" | "detail";
  id?: string | null;
  kodePengaduan?: string | null;
  onClose: () => void;
  onSuccess?: (workorder: Workorder) => void;
}

interface SelectOption {
  value: string;
  label: string;
  kategori?: KategoriWorkorder | null;
  lokasi?: string;
}

interface PengaduanResponse {
  kode_pengaduan: string;
  judul: string;
  lokasi?: string;
}

const SPV_JABATAN_ID = 4;
const PRIORITAS_OPTIONS = [
  { value: "Rendah", label: "Rendah" },
  { value: "Sedang", label: "Sedang" },
  { value: "Tinggi", label: "Tinggi" },
  { value: "Urgent", label: "Urgent" },
];

/* ========================================================= */
/* PREVIEW FIELD MAP */
/* ========================================================= */
const PREVIEW_FIELDS_MAP: Record<KategoriWorkorder, string[]> = {
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

export default function WorkorderModal({
  modal,
  id,
  onClose,
  onSuccess,
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
  const roleName = Cookies.get("role_name")?.toLowerCase() ?? "";
  const userId = Number(Cookies.get("user_id") ?? 0);
  const departemenId = Number(Cookies.get("departemen_id") ?? 0);

  /* ========================================================= */
  /* SELECTED DATA */
  /* ========================================================= */
  const selectedJenisWorkorder = useMemo(() => {
    return jenisWorkorderOptions.find(
      (item) => item.value === String(formData.jenisWorkorderId),
    );
  }, [jenisWorkorderOptions, formData.jenisWorkorderId]);

  const selectedKategori = selectedJenisWorkorder?.kategori ?? null;

  const previewFields = useMemo(() => {
    if (!selectedKategori) return [];

    return PREVIEW_FIELDS_MAP[selectedKategori] ?? [];
  }, [selectedKategori]);

  /* ========================================================= */
  /* INITIAL DATA */
  /* ========================================================= */
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const pegawaiPromise =
          roleName === "superadmin"
            ? getPegawai(1, 1000, "", "", undefined, SPV_JABATAN_ID)
            : getPegawai(1, 1000, "", "", departemenId, SPV_JABATAN_ID);

        const [pegawaiResp, pengaduanResp, jenisResp] = await Promise.all([
          pegawaiPromise,
          getPengaduanOptions(),
          getJenisWorkorders(1, 1000, "", "desc", true),
        ]);

        setPegawaiOptions(
          pegawaiResp.data.map((item: PegawaiListItem) => ({
            value: String(item.id),
            label: item.pegawai?.nama ?? "Tanpa Nama",
          })),
        );

        setPengaduanOptions(
          (pengaduanResp.data ?? []).map((item: any) => ({
            value: item.kode_pengaduan,
            label: `${item.kode_pengaduan} - ${item.judul}`,
            lokasi: item.lokasi ?? "",
          })),
        );

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
        toast.error("Gagal mengambil data awal");
      }
    };
    fetchInitialData();
  }, [roleName, departemenId]);

  /* ========================================================= */
  /* FETCH DETAIL */
  /* ========================================================= */
  useEffect(() => {
    if (!id || isCreate) return;
    const fetchDetail = async () => {
      try {
        const res = await getWorkorderById(id);
        setFormData({
          id: res.id,
          jenisWorkorderId: res.jenisWorkorder?.id ?? res.jenisWorkorderId ?? 0,
          kodePengaduan: res.kodePengaduan ?? "",
          assignedTo: Number(res.assignedTo ?? 0),
          namaWorkorder: res.namaWorkorder ?? "",
          deskripsi: res.deskripsi ?? "",
          lokasi: res.lokasi ?? "",
          prioritas: res.prioritas,
          status: res.status,
          departemenId: res.departemenId,
          createdBy: res.createdBy,
        });
        Swal.close();
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Gagal mengambil detail workorder",
        });
      }
    };
    fetchDetail();
  }, [id, isCreate, setFormData]);

  /* ========================================================= */
  /* RESET */
  /* ========================================================= */
  useEffect(() => {
    return () => resetForm();
  }, [resetForm]);

  /* ========================================================= */
  /* SUBMIT */
  /* ========================================================= */
  const handleSubmit = async () => {
    try {
      if (
        !formData.kodePengaduan &&
        !formData.jenisWorkorderId &&
        !formData.assignedTo &&
        !formData.prioritas
      ) {
        return Swal.fire({
          icon: "warning",
          title: "Validasi",
          text: "Semua inputan wajib dipilih",
        });
      }
      if (!formData.kodePengaduan) {
        return Swal.fire({
          icon: "warning",
          title: "Validasi",
          text: "Pengaduan wajib dipilih",
        });
      }
      if (!formData.jenisWorkorderId) {
        return Swal.fire({
          icon: "warning",
          title: "Validasi",
          text: "Jenis workorder wajib dipilih",
        });
      }
      if (!formData.assignedTo) {
        return Swal.fire({
          icon: "warning",
          title: "Validasi",
          text: "SPV wajib dipilih",
        });
      }
      if (!formData.prioritas) {
        return Swal.fire({
          icon: "warning",
          title: "Validasi",
          text: "Prioritas wajib dipilih",
        });
      }
      setIsSubmitting(true);
      Swal.fire({
        title: isEdit ? "Memperbarui workorder..." : "Membuat workorder...",
        text: "Mohon tunggu",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const payload: WorkorderInput = {
        namaWorkorder: selectedJenisWorkorder?.label ?? "",
        kodePengaduan: formData.kodePengaduan,
        jenisWorkorderId: formData.jenisWorkorderId,
        assignedTo: formData.assignedTo,
        createdBy: userId,
        departemenId,
        deskripsi: formData.deskripsi,
        lokasi: formData.lokasi,
        prioritas: formData.prioritas,
        status: formData.status,
      };

      let savedWorkorder: Workorder;

      if (id && isEdit) {
        await updateWorkorder(id, payload);
        savedWorkorder = await getWorkorderById(id);
        savedWorkorder = await getWorkorderById(String(savedWorkorder.id));
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Workorder berhasil diperbarui",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        savedWorkorder = await createWorkorder(payload);
        savedWorkorder = await getWorkorderById(String(savedWorkorder.id));
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Workorder berhasil dibuat",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      onSuccess?.(savedWorkorder);
      onClose();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error instanceof Error ? error.message : "Gagal menyimpan workorder",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePengaduanChange = (selected: SelectOption) => {
    const selectedData = pengaduanOptions.find(
      (item) => item.value === selected.value,
    );

    setFormData({
      kodePengaduan: selected.value,
      lokasi: selectedData?.lokasi ?? "",
    });
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 py-24"
      onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white mt-16"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between bg-primary-500 px-6 py-4">
          <h2 className="text-2xl font-semibold text-white">
            {isCreate
              ? "Buat Workorder"
              : isEdit
                ? "Edit Workorder"
                : "Detail Workorder"}
          </h2>

          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-primary-400">
            <XIcon size={20} className="text-white" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-2 overflow-hidden p-4">
          <div className="rounded-xl border bg-grey-100 px-3 py-400">
            <h3 className="mb-4 text-xl font-semibold">Informasi Workorder</h3>

            <div className="grid grid-cols-2 gap-4">
              <SingleSelect
                label="Pengaduan"
                placeholder="Pilih pengaduan"
                options={pengaduanOptions}
                value={
                  pengaduanOptions.find(
                    (item) => item.value === formData.kodePengaduan,
                  ) ??
                  (formData.kodePengaduan
                    ? {
                        value: formData.kodePengaduan,
                        label: formData.kodePengaduan,
                        lokasi: formData.lokasi,
                      }
                    : null)
                }
                onChange={handlePengaduanChange}
                isDisabled={isDetail || isEdit}/>
              <SingleSelect
                label="Jenis Workorder"
                placeholder="Pilih jenis workorder"
                options={jenisWorkorderOptions}
                value={selectedJenisWorkorder ?? null}
                onChange={(selected) =>
                  setFormData({
                    jenisWorkorderId: Number(selected.value),
                  })
                }
                isDisabled={isDetail}/>

              <SingleSelect
                label="Ditujukan Kepada"
                placeholder="Pilih SPV"
                options={pegawaiOptions}
                value={
                  pegawaiOptions.find(
                    (item) => item.value === String(formData.assignedTo),
                  ) ?? null
                }
                onChange={(selected) =>
                  setFormData({
                    assignedTo: Number(selected.value),
                  })
                }
                isDisabled={isDetail}/>

              <SingleSelect
                label="Prioritas"
                placeholder="Pilih prioritas"
                options={PRIORITAS_OPTIONS}
                value={
                  PRIORITAS_OPTIONS.find(
                    (item) => item.value === formData.prioritas,
                  ) ?? null
                }
                onChange={(selected) =>
                  setFormData({
                    prioritas: selected.value as PrioritasWorkorder,
                  })
                }
                isDisabled={isDetail}/>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Kategori
                </label>

                <div className="rounded-lg border bg-white px-4 py-3 text-sm">
                  {selectedKategori ?? "-"}
                </div>
              </div>
            </div>
          </div>

          {/* PREVIEW FIELD SPESIFIKASI */}
          <div className="flex h-[420px] flex-col overflow-hidden rounded-xl border">
            <div className="bg-primary-500 px-6 py-4">
              <h3 className="text-lg font-semibold text-white">
                Preview Field Spesifikasi
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto bg-grey-100 px-6 py-4 pb-10">
              {previewFields.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {previewFields.map((field, index) => (
                    <PreviewField
                      key={field}
                      number={index + 1}
                      label={field}/>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Pilih jenis workorder terlebih dahulu
                </div>
              )}
            </div>
          </div>

          {!isDetail && (
            <div className="sticky bottom-0 flex justify-end border-t bg-white px-6 py-4">
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewField({ number, label }: { number: number; label: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">
        {number}. {label}
      </label>

      <div className="rounded-md border bg-grey-50 px-3 py-2 text-sm text-muted-foreground">
        Akan diisi oleh Staff dibagian mobile
      </div>
    </div>
  );
}

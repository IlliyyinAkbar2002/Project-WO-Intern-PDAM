"use client";

import { XIcon } from "@phosphor-icons/react";
import { Workorder } from "@/types/workorderTypes";

interface WorkorderDetailModalProps {
  data: Workorder | null;
  onClose: () => void;
}

const previewFieldsMap: Record<string, string[]> = {
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

interface DetailItemProps {
  label: string;
  value?: string | null;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="rounded-md border bg-white px-4 py-3 text-sm">
        {value || "-"}
      </div>
    </div>
  );
}

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

export default function WorkorderDetailModal({
  data,
  onClose,
}: WorkorderDetailModalProps) {
  if (!data) return null;
  const kategori = data.jenisWorkorder?.kategori ?? "";
  const previewFields = previewFieldsMap[kategori] || [];

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
            Detail Workorder
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-primary-400"
          >
            <XIcon size={20} className="text-white" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col gap-6 overflow-hidden p-4">
          {/* INFORMASI */}
          <div className="rounded-xl border bg-grey-100 px-6 py-4">
            <h3 className="mb-4 text-xl font-semibold">Informasi Workorder</h3>
            <div className="grid grid-cols-2 gap-6">
              <DetailItem label="Kode Pengaduan" value={data.kodePengaduan} />
              <DetailItem label="Nama Workorder" value={data.namaWorkorder} />
              <DetailItem label="Status" value={data.status} />
              <DetailItem label="Prioritas" value={data.prioritas} />
              <DetailItem label="PIC" value={data.pic?.pegawai?.nama} />
              <DetailItem label="Kategori" value={kategori} />
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
              {previewFields.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {previewFields.map((field, index) => (
                    <PreviewField
                      key={field}
                      number={index + 1}
                      label={field}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Tidak ada field spesifikasi
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

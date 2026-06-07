"use client";

import { XIcon } from "@phosphor-icons/react";
import { PegawaiDetail } from "@/types/pegawaiTypes";

interface EmployeeDetailModalProps {
  data: PegawaiDetail | null;
  onClose: () => void;
}

interface DetailItemProps {
  label: string;
  value?: string | number | null;
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

export default function EmployeeDetailModal({
  data,
  onClose,
}: EmployeeDetailModalProps) {
  if (!data) return null;

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
          <h2 className="text-2xl font-semibold text-white">Detail Pegawai</h2>

          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-primary-400"
          >
            <XIcon size={20} className="text-white" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto bg-grey-100 p-6">
          <div className="rounded-xl border bg-white p-6">
            <h3 className="mb-6 text-xl font-semibold">Informasi Pegawai</h3>

            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Nama" value={data.nama} />
              <DetailItem label="Email" value={data.user?.email} />
              <DetailItem label="Role" value={data.user?.role} />
              <DetailItem
                label="Status Akun"
                value={data.user?.is_active ? "Aktif" : "Nonaktif"}
              />
              <DetailItem label="NIP" value={data.nip} />
              <DetailItem label="Departemen" value={data.departemen} />
              <DetailItem label="Jabatan" value={data.jabatan} />
              <DetailItem label="Jenis Kelamin" value={data.jenis_kelamin} />
              <DetailItem label="Tanggal Lahir" value={data.tanggal_lahir} />
              <DetailItem label="Nomor Telepon" value={data.telepon} />
            </div>

            <div className="mt-4">
              <DetailItem label="Alamat" value={data.alamat} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

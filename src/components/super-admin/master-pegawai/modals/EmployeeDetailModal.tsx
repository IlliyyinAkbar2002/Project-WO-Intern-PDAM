"use client";

import { XIcon } from "@phosphor-icons/react";
import { PegawaiDetail } from "@/types/pegawaiTypes";

interface Props {
  data: PegawaiDetail | null;
  onClose: () => void;
}

function Field({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex flex-col gap-1 p-3 border-b border-r last:border-r-0">
      <span className="text-base text-gray-700">{label}</span>
      <span className="text-base font-medium text-gray-800">{value ?? "-"}</span>
    </div>
  );
}

export default function EmployeeDetailModal({ data, onClose }: Props) {
  if (!data) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between bg-primary-500 px-6 py-4">
          <h2 className="text-white text-2xl font-semibold">Detail Pegawai</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-primary-400 rounded-full p-1"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4 overflow-y-auto space-y-6 bg-gray-50">
          {/* ================= DATA PEGAWAI ================= */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="px-2 py-2 border-b bg-gray-100 font-semibold text-lg">
              Data Pegawai
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y">
              <Field label="Nama" value={data.nama} />
              <Field label="NIP" value={data.nip} />
              <Field label="Tanggal Lahir" value={data.tanggal_lahir} />
              <Field label="Jenis Kelamin" value={data.jenis_kelamin} />
              <Field label="Telepon" value={data.telepon} />
              <Field label="Alamat" value={data.alamat} />
              <Field label="Departemen" value={data.departemen} />
              <Field label="Jabatan" value={data.jabatan} />
            </div>
          </div>

          {/* ================= DATA AKUN ================= */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="px-2 py-2 border-b bg-gray-100 font-semibold text-lg">
              Data Akun
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y">
              <Field label="Email" value={data.user?.email} />

              <Field label="Role" value={data.user?.role} />

              <Field
                label="Status Akun"
                value={data.user?.is_active ? "Aktif" : "Nonaktif"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { PegawaiDetail } from "@/types/pegawaiTypes";
import { getPegawaiById } from "@/services/pegawaiService";

function Field({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-r p-4 last:border-r-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-base font-medium text-gray-800">
        {value || "-"}
      </span>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<PegawaiDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const pegawaiId = Cookies.get("pegawai_id");

        if (!pegawaiId) {
          throw new Error("Pegawai ID tidak ditemukan");
        }

        const result = await getPegawaiById(Number(pegawaiId));
        setData(result);
      } catch (err: any) {
        console.error(err);
        setError(
          err?.message || "Terjadi kesalahan saat mengambil data profile",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        Memuat data profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-500">
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* ================================================= */}
      {/* PROFILE HEADER */}
      {/* ================================================= */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="bg-primary-500 px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-4xl font-bold text-primary-500">
                {data.nama?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-white">{data.nama}</h1>

                <p className="mt-1 text-white/90">
                  {data.jabatan || "-"} • {data.departemen || "-"}
                </p>

                <p className="mt-1 text-sm text-white/80">
                  NIP : {data.nip || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* INFORMASI PEGAWAI */}
      {/* ================================================= */}
      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="border-b bg-gray-100 px-4 py-3 text-lg font-semibold">
          Informasi Pegawai
        </div>

        <div className="grid grid-cols-1 divide-x divide-y md:grid-cols-3">
          <Field label="Nama" value={data.nama} />
          <Field label="NIP" value={data.nip} />
          <Field label="Tanggal Lahir" value={data.tanggal_lahir} />
          <Field label="Jenis Kelamin" value={data.jenis_kelamin} />
          <Field label="Nomor Telepon" value={data.telepon} />
          <Field label="Alamat" value={data.alamat} />
          <Field label="Departemen" value={data.departemen} />
          <Field label="Jabatan" value={data.jabatan} />
        </div>
      </div>

      {/* ================================================= */}
      {/* INFORMASI AKUN */}
      {/* ================================================= */}
      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="border-b bg-gray-100 px-4 py-3 text-lg font-semibold">
          Informasi Akun
        </div>

        <div className="grid grid-cols-1 divide-x divide-y md:grid-cols-3">
          <Field label="Email" value={data.user?.email} />

          <Field label="Role" value={data.user?.role} />

          <Field
            label="Status Akun"
            value={data.user?.is_active ? "Aktif" : "Nonaktif"}
          />
        </div>
      </div>
    </div>
  );
}

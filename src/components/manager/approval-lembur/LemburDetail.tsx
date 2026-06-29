"use client";

import React from "react";
import { LemburSpl } from "@/types/lemburSpl";

interface Props {
  data: LemburSpl;
  onBack: () => void;
}

const LemburDetail: React.FC<Props> = ({ data, onBack }) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "approved":
        return {
          label: "APPROVED",
          desc: "Pengajuan telah disetujui",
          color: "from-green-600 to-emerald-500",
        };
      case "rejected":
        return {
          label: "REJECTED",
          desc: "Pengajuan ditolak",
          color: "from-red-600 to-rose-500",
        };
      default:
        return {
          label: "PENDING",
          desc: "Menunggu verifikasi",
          color: "from-blue-700 to-sky-500",
        };
    }
  };

  const statusInfo = getStatusInfo(data.status);

  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    return new Date(value).toLocaleString();
  };

  const formatOnlyDate = (value?: string | null) => {
    if (!value) return "-";
    return new Date(value).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <div>
          <h1 className="text-xl font-bold">Detail Lembur SPL</h1>
          <p className="text-sm text-gray-500">WO #{data.workorder?.id}</p>
        </div>

        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 active:scale-[0.98] transition">
          Kembali
        </button>
      </div>

      {/* HERO STATUS */}
      <div
        className={`p-6 rounded-xl bg-gradient-to-r ${statusInfo.color} text-white`}
      >
        <div className="text-sm opacity-80">STATUS</div>
        <div className="text-3xl font-bold">{statusInfo.label}</div>
        <div className="text-sm opacity-80">{statusInfo.desc}</div>

        <div className="text-xs mt-3">
          Diajukan: {formatDate(data.waktu_pengajuan)}
        </div>
      </div>

      {/* ALERT REJECTED */}
      {data.status === "rejected" && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700">
          <div className="font-semibold">Alasan Penolakan</div>
          <div className="text-sm">{data.alasan_ditolak || "-"}</div>
        </div>
      )}

      {/* GRID INFO */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card label="Workorder" value={data.workorder?.nama_workorder} />
        <Card label="Jenis" value={data.jenis_pekerjaan} />
        <Card label="Judul" value={data.judul_pekerjaan} />
        <Card label="Tanggal" value={formatOnlyDate(data.tanggal_lembur)} />
        <Card label="Jam" value={data.jam_mulai} />
        <Card label="Estimasi" value={`${data.estimasi_jam} jam`} />
      </div>

      {/* PEMOHON + VERIFIKATOR */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-semibold">Pemohon</div>
          <div>{data.pemohon?.pegawai?.nama}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-semibold">Verifikator</div>
          <div>{data.verifikator?.pegawai?.nama || "-"}</div>
        </div>
      </div>

      {/* ANGGOTA TIM FIX */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="font-semibold mb-2">Anggota Tim</div>

        {data.members?.length ? (
          <div className="grid md:grid-cols-2 gap-3">
            {data.members.map((m) => (
              <div key={m.id} className="p-3 border rounded-lg bg-blue-50">
                <div className="font-medium">
                  {m.user?.pegawai?.nama || "-"}
                </div>
                <div className="text-xs text-gray-500">
                  {m.user?.pegawai?.nip || "-"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">Tidak ada anggota</div>
        )}
      </div>

      {/* ALASAN */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="font-semibold">Alasan Lembur</div>
        <div className="text-sm">{data.alasan_lembur}</div>
      </div>

      {/* WAKTU */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card
          label="Waktu Verifikasi"
          value={formatDate(data.waktu_verifikasi)}
        />
        <Card label="Dibuat" value={formatDate(data.created_at)} />
      </div>

      {/* LOKASI */}
      {(data.latitude || data.longitude) && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="font-semibold">Lokasi</div>
          <div className="text-sm">Lat: {data.latitude}</div>
          <div className="text-sm">Lng: {data.longitude}</div>
        </div>
      )}
    </div>
  );
};

const Card = ({ label, value }: { label: string; value: any }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="font-medium text-sm">{value || "-"}</div>
  </div>
);

export default LemburDetail;

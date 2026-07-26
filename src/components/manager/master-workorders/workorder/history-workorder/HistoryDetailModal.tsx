"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui";
import StatusBadge from "@/components/shared/StatusBadge";
import { HistoryWorkorder } from "@/types/workorderTypes";

interface Props {
  open: boolean;
  onClose: () => void;
  data: HistoryWorkorder | null;
}

export default function HistoryDetailModal({ open, onClose, data }: Props) {
  if (!data) return null;

  const assignment = data.workorderAssignment;
  const members = data.workorderAssignment?.members || [];
  const progress = data.progressWorkorder || [];
  const laporan = data.laporanWorkorder;

  const tanggalMulai = assignment?.tanggalMulai
    ? new Date(assignment.tanggalMulai).toLocaleString("id-ID")
    : "-";

  const tanggalSelesai = assignment?.tanggalSelesai
    ? new Date(assignment.tanggalSelesai).toLocaleString("id-ID")
    : "-";

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Tutup":
        return {
          label: "SELESAI",
          desc: "Workorder telah ditutup dan masuk history",
          color: "from-green-600 to-emerald-500",
        };

      case "Selesai":
        return {
          label: "SELESAI",
          desc: "Workorder telah selesai dikerjakan",
          color: "from-green-600 to-emerald-500",
        };

      default:
        return {
          label: status.toUpperCase(),
          desc: "Status workorder",
          color: "from-blue-600 to-sky-500",
        };
    }
  };
console.log("History Detail", data);
  const statusInfo = getStatusInfo(data.status);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="hidden">Detail History Workorder</DialogTitle>

        <div className="space-y-6">
          {/* HEADER */}
          <div className="flex items-center justify-between rounded-lg bg-white">
            <div>
              <h1 className="text-2xl font-bold">Detail History Workorder</h1>
            </div>
          </div>

          {/* HERO STATUS */}
          <div
            className={`rounded-xl bg-gradient-to-r ${statusInfo.color} p-6 text-white`}>
            <div className="text-sm opacity-80">STATUS WORKORDER</div>
            <div className="text-3xl font-bold">{statusInfo.label}</div>
            <div className="text-sm opacity-80">{statusInfo.desc}</div>
          </div>

          {/* INFORMASI WORKORDER */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card label="Kode Pengaduan" value={data.kodePengaduan} />
            <Card label="Nama Workorder" value={data.namaWorkorder} />
            <Card label="Prioritas" value={data.prioritas} />
            <Card label="Lokasi" value={data.lokasi} />
            <Card label="Tanggal Mulai" value={tanggalMulai} />
            <Card label="Tanggal Selesai" value={tanggalSelesai} />
          </div>

          {/* STATUS + ASSIGNED */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-white p-4 shadow">
              <div className="mb-2 text-sm font-semibold">Status</div>
              <StatusBadge status={data.status} />
            </div>
          </div>

          {/* ASSIGNMENT */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card label="SPV" value={assignment?.spv?.nama} />
            <Card label="PIC" value={assignment?.picMember?.pegawai?.nama} />
          </div>

          {/* TIM */}
          <div className="rounded-lg bg-white p-4 shadow">
            <div className="mb-4 font-semibold">Tim Pelaksana</div>

            {members.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="rounded-lg border bg-gray-50 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {member.pegawai?.nama}
                        </div>

                        <div className="text-xs text-gray-500">
                          {member.pegawai?.nip || "-"}
                        </div>
                      </div>

                      <Badge variant={member.isPic ? "success" : "outline"}>
                        {member.isPic ? "PIC" : "Anggota"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Tidak ada anggota tim.
              </div>
            )}
          </div>

          {/* PROGRESS */}
          <div className="rounded-lg bg-white p-4 shadow">
            <div className="mb-4 font-semibold">Progress Workorder</div>

            {progress.length > 0 ? (
              <div className="space-y-4">
                {progress.map((item) => (
                  <div key={item.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">
                        Tahapan {item.tahapan}
                      </div>

                      <Badge variant="outline">
                        {item.tipeProgress || "-"}
                      </Badge>
                    </div>

                    <div className="mt-2 text-sm text-gray-700">
                      {item.hasilPengerjaan || "-"}
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      {item.waktuSubmit || "-"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">Belum ada progress.</div>
            )}
          </div>

          {/* LAPORAN */}
          <div className="rounded-lg bg-white p-4 shadow">
            <div className="mb-4 font-semibold">Laporan Workorder</div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card label="Nomor Laporan" value={laporan?.nomorLaporan} />

              <Card label="Tanggal Terbit" value={laporan?.tanggalTerbit} />
            </div>

            <div className="mt-4">
              <div className="mb-1 text-sm text-gray-500">
                Ringkasan Pekerjaan
              </div>

              <div className="rounded-lg border bg-gray-50 p-4">
                {laporan?.ringkasanPekerjaan || "-"}
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-1 text-sm text-gray-500">Catatan SPV</div>

              <div className="rounded-lg border bg-gray-50 p-4">
                {laporan?.catatanSpv || "-"}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Card({ label, value }: { label: string; value?: any }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="text-xs text-gray-500">{label}</div>

      <div className="mt-1 font-medium">{value || "-"}</div>
    </div>
  );
}

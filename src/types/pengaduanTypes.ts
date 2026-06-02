export type PengaduanStatus = "Pending" | "Proses" | "Selesai" | "Ditolak";

export interface Pengaduan {
  kode_pengaduan: string;
  judul: string;
  deskripsi: string;
  lokasi?: string;
  status: PengaduanStatus;
  tanggal_pengaduan: string;
}

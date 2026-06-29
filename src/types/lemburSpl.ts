export type LemburStatus = "pending" | "approved" | "rejected";

export interface LemburSplMember {
  id: number;
  user_id: number;
  user?: {
    id: number;
    pegawai?: {
      id: number;
      nama?: string;
      nip?: string;
    };
  };
}

export interface Workorder {
  id: number;
  nama_workorder: string;
  status: string;
}

export interface Pegawai {
  id: number;
  nama: string;
  nip: string;
}

export interface LemburSpl {
  id: number;
  workorder?: Workorder;
  pemohon?: {
    id: number;
    pegawai?: Pegawai;
  };
  verifikator?: {
    id: number;
    pegawai?: Pegawai;
  };
  members: LemburSplMember[];
  judul_pekerjaan: string;
  jenis_pekerjaan: string;
  tanggal_lembur: string;
  jam_mulai?: string;
  estimasi_jam: number;
  alasan_lembur: string;
  latitude?: number;
  longitude?: number;
  nama_lokasi?: string;
  status: LemburStatus;
  waktu_pengajuan?: string;
  waktu_verifikasi?: string;
  alasan_ditolak?: string;
  created_at: string;
  updated_at?: string;
}

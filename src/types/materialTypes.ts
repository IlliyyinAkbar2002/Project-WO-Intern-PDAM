export interface Material {
  kode_material: string;
  nama: string;
  jumlah_stok: number;
  tersedia: number;
  terpakai: number;
  rusak: number;
  created_at: string;
  updated_at: string;
  pegawai_id: number;
  pegawai: {
    id: number;
    nama: string;
    nip: string;
    departemen?: string | null;
    jabatan?: string | null;
  };
}

export interface MaterialResponse {
  data: Material[];
  totalPages: number;
  currentPage: number;
}

export interface CreateMaterialPayload {
  kode_material: string;
  nama: string;
  jumlah_stok: number;
}

export interface Departemen {
  id: number;
  nama: string;
}

export interface Jabatan {
  id: number;
  nama: string;
}

export interface MaterialSummary {
  total_material: number;
  total_stok: number;
  total_terpakai: number;
  total_rusak: number;
  total_tersedia: number;
}

export interface WoPeminjamanMaterial {
  id: number;
  workorder_id: number;
  material_kode: string;
  jumlah_pinjam: number;
  jumlah_kembali?: number | null;
  jumlah_rusak?: number | null;
  status: "DIPINJAM" | "PENDING_KEMBALI" | "DIKEMBALIKAN";
  catatan?: string | null;
  kondisi_kembali?: string | null;
  catatan_verifikator?: string | null;
  diajukan_at: string;
  dikembalikan_at?: string | null;
  diverifikasi_at?: string | null;
  workorder: {
    id: number;
    nama_workorder: string;
    status: string;
  };
  material: {
    kode_material: string;
    nama: string;
    jumlah_stok: number;
    rusak: number;
  };
  pengaju: {
    id: number;
    nama: string;
    nip: string;
  };
  verifier: {
    id: number;
    nama: string;
    nip: string;
  } | null;
}
export interface Material {
  kode_material: number;
  nama: string;
  jumlah_stok: number;
  tersedia: number;
  terpakai: number;
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
  kode_material: number;
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
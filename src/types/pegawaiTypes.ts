export interface Pegawai {
  id: number;
  pegawai_id: number;
  name: string;
  email: string | null;
  role_id: number | null;
  created_at: string;
  updated_at: string;
  pegawai: {
    id: number;
    nama: string;
    nip: string;
    departemen?: string | null;
    jabatan?: string | null;
  };
}

export interface PegawaiResponse {
  data: Pegawai[];
  totalPages: number;
  currentPage: number;
}

export interface Departemen {
  id: number;
  nama: string;
}

export interface Jabatan {
  id: number;
  nama: string;
}
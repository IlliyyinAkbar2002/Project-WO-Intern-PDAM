export interface PegawaiListItem {
  id: number;
  pegawai_id: number;
  user_id?: number | null;
  name: string;
  email: string | null;
  role_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  departemen_id?: number | null;
  jabatan_id?: number | null;
  pegawai: {
    id: number;
    nama: string;
    nip: string;
    jenis_kelamin?: string | null;
    tanggal_lahir?: string | null;
    alamat?: string | null;
    telepon?: string | null;
    departemen?: string | null;
    jabatan?: string | null;
  };
}

export interface PegawaiDetail {
  id: number;
  nama: string;
  nip: string | null;
  tanggal_lahir: string | null;
  jenis_kelamin: string | null;
  alamat: string | null;
  telepon: string | null;
  departemen_id: number;
  departemen: string;
  jabatan_id: number;
  jabatan: string;
  user: {
    id: number;
    email: string;
    role_id: number;
    role: string;
    is_active: boolean;
  };
}

export interface PegawaiPayload {
  nama: string;
  email: string;
  nip: string;
  role_id: number;
  departemen_id: number;
  jabatan_id: number;
  tanggal_lahir?: string;
  jenis_kelamin?: string;
  alamat?: string;
  telepon?: string;
}

export interface PegawaiResponse {
  data: PegawaiListItem[];
  totalPages: number;
  currentPage: number;
}

export interface PegawaiCreatePayload {
  nama: string;
  departemen_id: number;
  jabatan_id: number;
  email: string;
  password: string;
  role_id: number;
}

export interface Departemen {
  id: number;
  nama: string;
}

export interface Jabatan {
  id: number;
  nama: string;
}

export interface Role {
  id: number;
  nama: string;
}

export interface PegawaiMetaResponse {
  departemen: Departemen[];
  jabatan: Jabatan[];
  role: Role[];
}
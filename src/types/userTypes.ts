export interface UserPegawai {
  id: number;
  nama: string;
  nip: string;
  departemenId?: number | null;
  departemenNama?: string | null;
  jabatanId?: number | null;
  jabatanNama?: string | null;
}

export interface User {
  id: number;
  email: string;
  roleId: number;
  roleName?: string;
  pegawaiId?: number;
  departemenId?: number | null;
  departemenNama?: string | null;
  jabatanId?: number | null;
  jabatanNama?: string | null;
  isActive?: boolean;
  pegawai?: UserPegawai;
};

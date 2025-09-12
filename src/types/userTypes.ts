export interface Pegawai {
  id: number;
  nama: string;
  nip: string
}

export interface User  {
  id: number;
  email: string;
  roleId: number;
  pegawai: Pegawai;
};

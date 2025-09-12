import { User } from "./userTypes";

export interface SimpleEntity {
  id: number;
  nama: string;
}

export interface WorkorderBase {
  judulPekerjaan: string;
  waktuPenugasan: string;
  estimasiDurasi: number;
  unitWaktu: string;
  estimasiSelesai: string;
  longitude?: number | null;
  latitude?: number | null;
}

export interface Workorder extends WorkorderBase {
  id: number;
  pic: User;
  lemburSpl?: {id: number, alasanDitolak?: string} | null;
  status: SimpleEntity;
  jenisWorkorder: SimpleEntity;
  jenisLokasi: SimpleEntity;
  tipeWorkorder: SimpleEntity;
  petugas: User;
  latestFreeze?: {id: number, keterangan: string, waktuMulai: string} | null;
}

export interface WorkorderResponse {
  data: Workorder[];
  totalPages: number;
  currentPage: number;
}

export interface WorkorderInput extends WorkorderBase {
  picId: number;
  lemburSplId?: number | null;
  statusId?: number;
  jenisWorkorderId: number;
  jenisLokasiId: number;
  tipeWorkorderId: number;
  petugasId: number[];
}

import { User } from "./userTypes";
import { KategoriWorkorder } from "./jenisWorkorderTypes";
export interface SimpleEntity {
  id: number;
  nama: string;
  kategori?: string | null;
}

export type PrioritasWorkorder = "Rendah" | "Sedang" | "Tinggi" | "Urgent";

export type StatusWorkorder = "Pending" | "Proses" | "Selesai" | "Ditolak";

export interface WorkorderBase {
  namaWorkorder: string;
  deskripsi?: string | null;
  lokasi: string;
  prioritas: PrioritasWorkorder;
  status: StatusWorkorder;
  kodePengaduan: string;
  departemenId: number;
  jenisWorkorderId: number;
  assignedTo: number;
  createdBy: number;
}

export interface Workorder extends WorkorderBase {
  id: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  kategori?: KategoriWorkorder | null;
  assignedToUser?: User;
  assignedToName?: string;
  createdByUser?: User;
  jenisWorkorder?: SimpleEntity;
  departemen?: SimpleEntity;
}

export interface WorkorderResponse {
  data: Workorder[];
  totalPages: number;
  currentPage: number;
}

export interface WorkorderInput extends WorkorderBase {}

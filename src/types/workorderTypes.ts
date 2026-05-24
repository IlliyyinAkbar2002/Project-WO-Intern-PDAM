import { User } from "./userTypes";
import { KategoriWorkorder } from "./jenisWorkorderTypes";

export interface SimpleEntity {
  id: number;
  nama: string;
  kategori?: string | null;
}

export type PrioritasWorkorder = "Rendah" | "Sedang" | "Tinggi" | "Urgent";

export type StatusWorkorder =
  | "Open"
  | "Progress"
  | "Pending"
  | "Done"
  | "Cancel";

export interface WorkorderBase {
  namaWorkorder: string;
  deskripsi?: string | null;
  lokasi?: string | null;
  prioritas: PrioritasWorkorder;
  status: StatusWorkorder;
  kodePengaduan?: string | null;
  departemenId: number;
  jenisWorkorderId: number;
  picId: number;
  userId: number;
}

export interface Workorder extends WorkorderBase {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  kategori?: KategoriWorkorder | null;
  // relations
  pic?: User;
  user?: User;
  jenisWorkorder?: SimpleEntity;
  departemen?: SimpleEntity;
}

export interface WorkorderResponse {
  data: Workorder[];
  totalPages: number;
  currentPage: number;
}

export interface WorkorderInput extends WorkorderBase {}

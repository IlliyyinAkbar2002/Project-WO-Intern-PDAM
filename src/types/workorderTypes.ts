import { User } from "./userTypes";
import { KategoriWorkorder } from "./jenisWorkorderTypes";

export interface SimpleEntity {
  id: number;
  nama: string;
  kategori?: string | null;
}

export type PrioritasWorkorder = "Rendah" | "Sedang" | "Tinggi" | "Urgent";

export type StatusWorkorder = "Pending" | "Proses" | "Selesai" | "Tutup";

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
  lemburSplId?: number | null;
  jenisWorkorderLabel?: "Normal" | "Lembur";
}

export interface WorkorderResponse {
  data: Workorder[];
  totalPages: number;
  currentPage: number;
}

export interface WorkorderInput extends WorkorderBase {}

/* ========================================================= */
/* PENGADUAN */
/* ========================================================= */
export interface PengaduanDetail {
  kodePengaduan?: string;
  judul?: string;
  deskripsi?: string;
  lokasi?: string;
  status?: string;
  tanggalPengaduan?: string;
  createdAt?: string;
  updatedAt?: string;
}

/* ========================================================= */
/* HISTORY WORKORDER */
/* ========================================================= */

export interface HistoryWorkorder extends Workorder {
  progresPersen?: number;
  pengaduan?: PengaduanDetail;
  workorderAssignment?: WorkorderAssignment;
  progressWorkorder?: ProgressWorkorder[];
  laporanWorkorder?: LaporanWorkorder;
}

export interface HistoryWorkorderResponse {
  data: HistoryWorkorder[];
  totalPages: number;
  currentPage: number;
}

export interface HistoryWorkorderDetailResponse {
  success: boolean;
  workorder: HistoryWorkorder;
  assignment?: WorkorderAssignment;
  members?: AssignmentMember[];
  progress?: ProgressWorkorder[];
  laporan?: LaporanWorkorder;
}

/* ========================================================= */
/* ASSIGNMENT */
/* ========================================================= */
export interface AssignmentMember {
  id: number;
  assignmentId?: number;
  pegawaiId: number;
  userId: number;
  isPic: boolean;
  peran: string;
  pegawai?: {
    id: number;
    nama: string;
    nip?: string;
  };
  user?: {
    id: number;
    nama: string;
    nip?: string;
  };
}

export interface WorkorderAssignment {
  id: number;
  assignedAt?: string;
  tanggalMulai?: string;
  tanggalSelesai?: string | null;
  estimasiSelesai?: string;
  deskripsi?: string | null;
  spv?: {
    id: number;
    nama: string;
    nip?: string;
  };
  location?: {
    id: number;
    nama: string;
  };
  picMember?: AssignmentMember;
  members?: AssignmentMember[];
}

/* ========================================================= */
/* PROGRESS */
/* ========================================================= */
export interface ProgressDetail {
  id: number;
  status: string;
  reviewedAt?: string;
  alasanRevisi?: string | null;
}

export interface DokumentasiProgress {
  id: number;
  url: string;
  jenis?: string;
}

export interface ProgressWorkorder {
  id: number;
  tipeProgress?: string;
  hasilPengerjaan?: string;
  order?: number;
  tahapan: number;
  waktuSubmit?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  submittedByPegawaiId?: number;
  dokumentasiProgress?: DokumentasiProgress[];
  latestDetail?: ProgressDetail | null;
}

/* ========================================================= */
/* LAPORAN WORKORDER */
/* ========================================================= */
export interface LaporanWorkorder {
  id: number;
  nomorLaporan: string;
  tanggalTerbit: string;
  ringkasanPekerjaan: string;
  hasilAkhirSnapshot?: any;
  petugasSnapshot?: any;
  catatanSpv?: string;
  issuedByUserId?: number;
  approvedByUserId?: number;
  approvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
// ===============================
// WORKORDER SUMMARY (MASTER)
// ===============================
export interface WorkorderBasicInfo {
  id: number;
  nama_workorder: string;
  status: string;
  tanggal_mulai?: string | null;
  estimasi_selesai?: string | null;
  estimasi_hari: number;
}

export interface MemberStatistics {
  tahapan_tertinggi: number | null;
  progress_tahapan: number | null;
  progress_percentage: number | null;
  first_submission: string | null;
  last_submission: string | null;
}

export interface WorkorderMemberSummaryItem {
  pegawai_id: number;
  nama: string;
  nip: string | null;
  jabatan: string | null;
  is_pic: boolean;
  statistics: MemberStatistics;
}

export interface WorkorderMemberSummaryResponse {
  workorder: WorkorderBasicInfo;
  team_statistics: {
    total_members: number;
    avg_progress_percentage: number | null;
  };
  members: WorkorderMemberSummaryItem[];
}

// ===============================
// DOCUMENTATION
// ===============================
export interface DokumentasiProgress {
  id: number;
  url: string;
  jenis: string | null;
}

// ===============================
// PROGRESS PER MEMBER (DETAIL)
// ===============================
export type TipeProgress = "inspeksi" | "mulai" | "progress" | "selesai";

export interface ProgressItem {
  id: number;
  workorder_id: number;
  tipe_progress: TipeProgress;
  submitted_by_pegawai_id: number;
  hasil_pengerjaan: string;
  waktu_submit: string | null;
  order: number;
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  tahapan: number;
  dokumentasi_progress?: DokumentasiProgress[];
}

export interface MemberProgress {
  pegawai_id: number;
  nama: string;
  nip: string | null;
  jabatan: string | null;
  is_pic: boolean;
  tahapan_tertinggi: number | null;
  progress_tahapan: number | null;
  progress_list: ProgressItem[];
}

export interface ProgressByMemberResponse {
  workorder_id: number;
  workorder_name: string;
  estimasi_hari: number;
  members: MemberProgress[];
}

// ===============================
// PROGRESS DETAIL (REVIEW LOG)
// ===============================
export interface ProgressWorkorderRef {
  id: number;
}

export interface Reviewer {
  id: number;
  nama?: string;
}

export interface ProgressDetail {
  id: number;
  progress_workorder_id: number;
  status: "pending" | "approved" | "rejected";
  reviewed_by_user_id?: number | null;
  reviewed_at?: string | null;
  alasan_revisi?: string | null;
  progress_workorder?: ProgressWorkorderRef;
  reviewer?: Reviewer;
}

export type MonitoringWorkorder = {
  id: number;
  nama_workorder: string;
  status: string;
  progress_percentage: number;
  summary?: {
    team_statistics?: {
      total_members: number;
      avg_progress: number;
    };
  };
};

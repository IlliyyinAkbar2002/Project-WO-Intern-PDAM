export interface WorkorderByJenis {
  id: number;
  nama: string;
  total: number;
}

export interface KpiSummary {
  pengaduan_total: number;
  pengaduan_pending: number;
  pengaduan_proses: number;
  pengaduan_selesai: number;
  pengaduan_ditolak: number;
  workorder_total: number;
  workorder_pending: number;
  workorder_proses: number;
  workorder_selesai: number;
  workorder_ditolak: number;
  material_total: number;
  material_terpakai: number;
  material_rusak: number;
  material_tersedia: number;
  workorder_by_jenis: WorkorderByJenis[];
}

export interface KpiResponse {
  success: boolean;
  data: KpiSummary;
  completion_rate: number;
}
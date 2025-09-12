export interface ProgressWorkorderDetail {
  id: number;
  progressWorkorderId: number;
  detailFormId: number;
  value: string;
}

export interface DokumentasiProgress{
  id: number;
  url: string;
  progressWorkorderId: number;
}

export interface ProgressWorkorder {
  id: number;
  order: number;
  workorderId: number;
  tipeProgress: string;
  hasilPengerjaan: string;
  waktuSubmit: string;
  dokumentasiProgress: DokumentasiProgress[];
  detailProgress: ProgressWorkorderDetail[];
}


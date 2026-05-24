export type KategoriWorkorder = "meter" | "jaringan" | "infrastruktur";

export interface JenisWorkorder {
  id: number;
  nama: string;
  kategori: KategoriWorkorder | null;
  is_active: boolean;

  formWorkorder?: unknown[];
}

export interface JenisWorkorderPayload {
  id?: number;
  nama: string;
  kategori: KategoriWorkorder | null;
  pegawaiId?: number | null;
  pengaduanId?: string | null;
  is_active?: boolean;
}

export interface JenisWorkorderResponse {
  data: JenisWorkorder[];
  totalPages: number;
  currentPage: number;
  totalData?: number;
}

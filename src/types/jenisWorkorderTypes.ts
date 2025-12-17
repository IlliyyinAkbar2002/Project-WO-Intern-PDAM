// DetailForm sekarang untuk opsi dropdown (dulunya OptionForm)
export interface DetailForm {
  id: number;
  namaOpsi: string;
  parent: number | null;
  order: number;
  namaParent?: string | null;
};

// FormWorkorder adalah form field dengan kpi_id (dulunya DetailForm)
export interface FormWorkorder {
  id: number;
  jenisWorkorderId: number;
  kpiId: number; // kpi_id pindah ke sini
  namaField: string;
  tipeField: string;
  tipeData: string | null;
  unitSatuan: string | null;
  sifat: string;
  min: number | null;
  max: number | null;
  parent: number | null;
  keterangan: string | null;
  hintText: string;
  order: number;
  detailForm: DetailForm[]; // opsi dropdown (dulunya optionForm)
};

export interface JenisWorkorder {
  id: number;
  nama: string;
  kpiId: number; // kpiId di root level
  formWorkorder: FormWorkorder[]; // dulunya detailForm
}

export interface JenisWorkorderPayload {
  id?: number;
  nama: string;
  kpiId?: number; // kpiId di root level
  formWorkorder?: FormWorkorder[]; // dulunya detailForm
}

export interface JenisWorkorderResponse {
  data: JenisWorkorder[];
  totalPages: number;
  currentPage: number;
};

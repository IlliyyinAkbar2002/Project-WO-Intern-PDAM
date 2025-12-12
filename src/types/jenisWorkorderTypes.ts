export interface OptionForm  {
  id: number;
  namaOpsi: string;
  parent: number | null;
  order: number;
  namaParent?: string | null;
};

export interface DetailForm  {
  id: number;
  jenisWorkorderId: number;
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
  optionForm: OptionForm[];
};

export interface JenisWorkorder  {
  id : number;
  nama: string;
  kpiId: number;
  detailForm: DetailForm[];
}

export interface JenisWorkorderPayload {
  id?: number;
  nama: string;
  kpiId: number;
  detailForm?: DetailForm[];
}

export interface JenisWorkorderResponse  {
  data: JenisWorkorder[]; 
  totalPages: number; 
  currentPage: number; 
};

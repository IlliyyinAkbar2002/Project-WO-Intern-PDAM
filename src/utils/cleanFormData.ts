import { JenisWorkorder, DetailForm, OptionForm } from "@/types";

export function cleanJenisWorkorder(raw: any): JenisWorkorder {
  return {
    id: raw.id,
    nama: raw.nama,
    kpiId: raw.kpi_id,
    detailForm: (raw.detail_form || []).map((df: any) => cleanDetailForm(df)),
  };

}

// Bersihkan data detail form
export function cleanDetailForm(raw: any): DetailForm {
  return {
    id: raw.id,
    jenisWorkorderId: raw.jenis_workorder_id,
    namaField: raw.nama_field,
    tipeField: raw.tipe_field,
    tipeData: raw.tipe_data,
    unitSatuan: raw.unit_satuan,
    sifat: raw.sifat,
    min: raw.min,
    max: raw.max,
    parent: raw.parent,
    keterangan: raw.keterangan,
    hintText: raw.hint_text,
    order: raw.order,
    optionForm: (raw.option_form || []).map((opt: any) => cleanOptionForm(opt)),
  };
}

// Bersihkan data option form
export function cleanOptionForm(raw: any): OptionForm {
  return {
    id: raw.id,
    namaOpsi: raw.nama_opsi,
    parent: raw.parent,
    order: raw.order,
  };
}

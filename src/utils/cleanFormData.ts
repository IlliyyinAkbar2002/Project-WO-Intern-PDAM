import { JenisWorkorder, FormWorkorder, DetailForm } from "@/types";

export function cleanJenisWorkorder(raw: any): JenisWorkorder {
  return {
    id: raw.id,
    nama: raw.nama,
    // kpiId dihapus dari root - sekarang di setiap formWorkorder
    formWorkorder: (raw.form_workorder || []).map((fw: any) => cleanFormWorkorder(fw)),
  };

}

// Bersihkan data form workorder (dulunya detail form)
export function cleanFormWorkorder(raw: any): FormWorkorder {
  return {
    id: raw.id,
    jenisWorkorderId: raw.jenis_workorder_id,
    kpiId: raw.kpi_id, // kpi_id sekarang di sini
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
    detailForm: (raw.detail_form || []).map((df: any) => cleanDetailForm(df)), // opsi dropdown (dulunya option_form)
  };
}

// Bersihkan data detail form (dulunya option form - untuk opsi dropdown)
export function cleanDetailForm(raw: any): DetailForm {
  return {
    id: raw.id,
    namaOpsi: raw.nama_opsi,
    parent: raw.parent,
    order: raw.order,
  };
}

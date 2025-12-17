import { JenisWorkorder, FormWorkorder, DetailForm } from "@/types";

export function cleanJenisWorkorder(raw: any): JenisWorkorder {
  const formWorkorders = (raw.form_workorder || []).map((fw: any) =>
    cleanFormWorkorder(fw),
  );

  // kpiId di root level, fallback ke kpi_id dari formWorkorder pertama jika tidak ada di root
  const kpiId = raw.kpi_id ?? raw.kpiId ?? formWorkorders[0]?.kpiId ?? 0;

  return {
    id: raw.id,
    nama: raw.nama,
    kpiId: kpiId,
    formWorkorder: formWorkorders,
  };
}

// Bersihkan data form workorder (dulunya detail form)
export function cleanFormWorkorder(raw: any): FormWorkorder {
  return {
    id: raw.id,
    jenisWorkorderId: raw.jenis_workorder_id,
    kpiId: raw.kpi_id ?? raw.kpiId ?? 0, // kpi_id sekarang di sini, dengan fallback
    namaField: raw.nama_field,
    tipeField: raw.tipe_field,
    tipeData: raw.tipe_data,
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

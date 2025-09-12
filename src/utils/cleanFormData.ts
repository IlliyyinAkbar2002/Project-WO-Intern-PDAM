import { JenisWorkorder } from "@/types";

export function cleanFormData(raw: any): JenisWorkorder {
  return {
    id: raw.id,
    nama: raw.nama,
    kpiId: raw.kpi_id,
    detailForm: (raw.detail_form || []).map((df: any) => ({
      id: df.id,
      namaField: df.nama_field,
      tipeField: df.tipe_field,
      tipeData: df.tipe_data,
      unitSatuan: df.unit_satuan,
      sifat: df.sifat,
      min: df.min,
      max: df.max,
      parent: df.parent,
      keterangan: df.keterangan,
      hintText: df.hint_text,
      order: df.order,
      optionForm: (df.option_form || []).map((opt: any) => ({
        id: opt.id,
        namaOpsi: opt.nama_opsi,
        parent: opt.parent,
        order: opt.order,
      })),
    })),
  };
}
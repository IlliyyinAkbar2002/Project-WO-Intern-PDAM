
import { FormWorkorder, DetailForm } from "@/types";
import { toast } from "sonner";

export const getDisabledFields = (tipeField: string): string[] => {
  switch (tipeField) {
    case "text":
      return ["parent"];
    case "dropdown":
      return ["tipeData", "min", "max"];
    case "image":
      return ["tipeData", "min", "max", "parent"];
    case "date":
      return ["tipeData", "min", "max", "parent"];
    default:
      return [];
  }
};

export const getHintText = (tipeField: string, namaField: string): string => {
  switch (tipeField) {
    case "text":
      return `Isi ${namaField}`;
    case "dropdown":
      return `Pilih ${namaField}`;
    case "image":
      return `Pilih gambar`;
    case "date":
      return `Pilih tanggal`;
    default:
      return "";
  }
};

export const prepareDetailForm = (formWorkorder: FormWorkorder, options: DetailForm[]): FormWorkorder => {
  const cleaned = { ...formWorkorder };
  switch (formWorkorder.tipeField) {
    case "text":
      cleaned.parent = 0;
      cleaned.hintText = getHintText(formWorkorder.tipeField, formWorkorder.namaField);
      cleaned.detailForm = [];
      break;
    case "dropdown":
      cleaned.tipeData = null;
      cleaned.min = null;
      cleaned.max = null;
      cleaned.hintText = getHintText(formWorkorder.tipeField, formWorkorder.namaField);
      cleaned.detailForm = options;
      break;
    case "image":
      cleaned.tipeData = null;
      cleaned.min = null;
      cleaned.max = null;
      cleaned.parent = 0;
      cleaned.hintText = getHintText(formWorkorder.tipeField, formWorkorder.namaField);
      cleaned.detailForm = [];
      break;
    case "date":
      cleaned.tipeData = null;
      cleaned.min = null;
      cleaned.max = null;
      cleaned.parent = 0;
      cleaned.hintText = getHintText(formWorkorder.tipeField, formWorkorder.namaField);
      cleaned.detailForm = [];
      break;
    default:
      cleaned.detailForm = [];
      cleaned.hintText = "";
      break;
  }

  return cleaned;
};

export const validateDetailForm = (formWorkorder: FormWorkorder, options: DetailForm[], submodalId: string | null): boolean => {
  const numericId = Number(submodalId);

  if (!submodalId || isNaN(numericId)) {
    toast.error("ID tidak valid!");
    return false;
  }
  if (!formWorkorder.namaField.trim()) {
    toast.error("Nama field tidak boleh kosong!");
    return false;
  }
  if (!formWorkorder.tipeField) {
    toast.error("Tipe field tidak boleh kosong!");
    return false;
  }
  if (!formWorkorder.kpiId || formWorkorder.kpiId <= 0) {
    toast.error("KPI tidak boleh kosong!");
    return false;
  }
  if (!formWorkorder.tipeData && formWorkorder.tipeField !== "dropdown" && formWorkorder.tipeField !== "image" && formWorkorder.tipeField !== "date") {
    toast.error("Tipe data tidak boleh kosong!");
    return false;
  }
  if (!formWorkorder.sifat) {
    toast.error("Sifat tidak boleh kosong!");
    return false;
  }
  if (formWorkorder.tipeField === "dropdown" && formWorkorder.parent === null) {
    toast.error("Parent tidak boleh kosong!");
    return false;
  }
  if (
    formWorkorder.tipeField === "dropdown" &&
    !options.every((opt) => opt.namaOpsi.trim() !== "")
  ) {
    toast.error("Isi opsi dropdown dengan benar!");
    return false;
  }

  return true;
}

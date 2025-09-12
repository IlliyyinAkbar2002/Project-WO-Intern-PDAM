
import { DetailForm, OptionForm } from "@/types";
import { toast } from "sonner";

export const getDisabledFields = (tipeField: string): string[] => {
  switch (tipeField) {
    case "text":
      return ["parent"];
    case "dropdown":
      return ["tipeData", "min", "max"];
    case "image":
      return [ "tipeData", "unitSatuan", "min", "max", "parent"];
    case "date":
      return [ "tipeData", "unitSatuan", "min", "max", "parent"];
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

export const prepareDetailForm = (detailForm: DetailForm, options: OptionForm[]): DetailForm => {
  const cleaned = { ...detailForm};
  switch (detailForm.tipeField) {
    case "text":
      cleaned.parent = 0;
      cleaned.hintText = getHintText(detailForm.tipeField, detailForm.namaField);
      cleaned.optionForm = [];
      break;
    case "dropdown":
      cleaned.tipeData = null;
      cleaned.min = null;
      cleaned.max = null;
      cleaned.hintText = getHintText(detailForm.tipeField, detailForm.namaField);
      cleaned.optionForm = options;
      break;
    case "image":
      cleaned.tipeData = null;
      cleaned.unitSatuan = null;
      cleaned.min = null;
      cleaned.max = null;
      cleaned.parent = 0;
      cleaned.hintText = getHintText(detailForm.tipeField, detailForm.namaField);
      cleaned.optionForm = [];
      break;
    case "date":
      cleaned.tipeData = null;
      cleaned.unitSatuan = null;
      cleaned.min = null;
      cleaned.max = null;
      cleaned.parent = 0;
      cleaned.hintText = getHintText(detailForm.tipeField, detailForm.namaField);
      cleaned.optionForm = [];
      break;
    default:
      cleaned.optionForm = [];
      cleaned.hintText = "";
      break;
    }

  return cleaned;
};

export const validateDetailForm = (detailForm: DetailForm, options: OptionForm[], submodalId: string | null): boolean => {
  const numericId = Number(submodalId);

  if (!submodalId || isNaN(numericId)) {
    toast.error("ID tidak valid!");
    return false;
  }
  if (!detailForm.namaField.trim()) {
    toast.error("Nama field tidak boleh kosong!");
    return false;
  }
  if (!detailForm.tipeField) {
    toast.error("Tipe field tidak boleh kosong!");
    return false;
  }
  if (!detailForm.tipeData && detailForm.tipeField !== "dropdown" && detailForm.tipeField !== "image" && detailForm.tipeField !== "date") {
    toast.error("Tipe data tidak boleh kosong!");
    return false;
  }
  if (!detailForm.sifat) {
    toast.error("Sifat tidak boleh kosong!");
    return false;
  }
  if (detailForm.tipeField === "dropdown" && detailForm.parent === null) {
    toast.error("Parent tidak boleh kosong!");
    return false;
  }
  if (
    detailForm.tipeField === "dropdown" &&
    !options.every((opt) => opt.namaOpsi.trim() !== "")
  ) {
    toast.error("Isi opsi dropdown dengan benar!");
    return false;
  }

  return true;
}

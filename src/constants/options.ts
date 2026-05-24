import { KategoriWorkorder } from "@/types";

export interface OptionType {
  value: string;
  label: string;
  kategori?: KategoriWorkorder | null;
}

export const tipeFieldOptions: OptionType[] = [
  { value: "text", label: "Text Field" },
  { value: "dropdown", label: "Dropdown" },
  { value: "image", label: "Image" },
  { value: "date", label: "Date Picker" },
];

export const tipeDataOptions: OptionType[] = [
  { value: "string", label: "String" },
  { value: "integer", label: "Integer" },
  {value: "float", label: "Float"},
];

export const sifatOptions: OptionType[] = [
  { value: "mandatory", label: "Mandatory" },
  { value: "opsional", label: "Opsional" },
];

export const jenisLokasiOptions: OptionType[] = [
  { value: "1", label: "Statis" },
  { value: "2", label: "Dinamis" },
];

export const unitOptions: OptionType[] = [
  { value: "Hari", label: "Hari" },
  { value: "Jam", label: "Jam" },
  { value: "Bulan", label: "Bulan" },
];

export const sortOptions: OptionType[] = [
  { value: "desc", label: "Terbaru" },
  { value: "asc", label: "Terlama" },
];

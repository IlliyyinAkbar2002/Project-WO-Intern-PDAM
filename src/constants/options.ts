import { KategoriWorkorder } from "@/types";

export interface OptionType {
  value: string;
  label: string;
  kategori?: KategoriWorkorder | null;
}

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

export const jenisWorkorderOptions = [
  {
    value: "",
    label: "Semua",
  },
  {
    value: "normal",
    label: "Normal",
  },
  {
    value: "lembur",
    label: "Lembur",
  },
];

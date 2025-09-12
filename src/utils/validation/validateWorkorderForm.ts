import { toast } from "sonner";

export const validateWorkorderForm = (form: any): boolean => {
  if (!form.judulPekerjaan.trim()) {
    toast.error("Judul pekerjaan tidak boleh kosong");
    return false;
  }

  if (!form.jenisWorkorderId) {
    toast.error("Jenis workorder tidak boleh kosong");
    return false;
  }

  if (!form.jenisLokasiId) {
    toast.error("Jenis lokasi tidak boleh kosong");
    return false;
  }

  if (form.jenisLokasiId === 1 && (!form.latitude || !form.longitude)) {
    toast.error("Harap pilih lokasi pada peta");
    return false;
  }

  if (!form.startDate) {
    toast.error("Pilih Tanggal mulai");
    return false;
  }
  
  if (!form.startTime) {
    toast.error("Pilih Waktu mulai");
    return false;
  }

  if (!form.estimasiDurasi) {
    toast.error("Estimasi durasi tidak boleh kosong");
    return false;
  }

  if (!form.unitWaktu) {
    toast.error("Unit waktu tidak boleh kosong");
    return false;
  }

  if (!form.petugasId || form.petugasId.length === 0) {
    toast.error("Petugas tidak boleh kosong");
    return false;
  }

  return true;
};


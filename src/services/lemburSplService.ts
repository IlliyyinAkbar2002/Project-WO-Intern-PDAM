import { api } from "@/lib/api";

export const rejectLemburSpl = async (id: string, verifikatorId: number, reason: string | null) => {
  try {
    const response = await api.patch(`/lembur-spl/${id}`, {
      verifikator_id: verifikatorId,
      status_id: 4, 
      alasan_ditolak: reason,
    });
    return response.data;
  } catch (error: any) { 
    // Mengambil pesan dari response body (data.message) atau error Axios umum (error.message)
    const apiErrorMessage = 
      error.response?.data?.message || 
      error.message || 
      "Gagal menolak SPL. Cek server.";

    // Melempar pesan error yang spesifik agar bisa ditampilkan di UI
    throw new Error(apiErrorMessage);
  }
};

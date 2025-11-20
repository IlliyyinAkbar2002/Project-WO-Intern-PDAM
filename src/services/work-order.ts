import { api } from "@/lib/api";

export const acceptWo = async (id: string, verifikatorId: number, reason: string | null) => {
return api.post("/workorder/accept/" + id)
}
export const rejectWo = async (id: string, verifikatorId: number, reason: string | null) => {
  try {
    const response = await api.patch(`/workorder/reject/${id}`, {
      verifikator_id: verifikatorId,
      status_id: 4, 
      alasan_ditolak: reason,
    });
    return response.data;
  } catch (error: any) { 
    const apiErrorMessage = 
      error.response?.data?.message || 
      error.message || 
      "Gagal menolak SPL. Cek server.";
    throw new Error(apiErrorMessage);
  }
};

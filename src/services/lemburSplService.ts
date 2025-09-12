import { api } from "@/lib/api";

export const approveLemburSpl = async  (id: string, verifikatorId: number) => {
  try {
    const response = await api.patch(`/lembur-spl/${id}`, {
      status_id: 2, 
      verifikator_id: verifikatorId
    });   
    return response.data;
  } catch (error) {
    throw new Error("Gagal menyetujui SPL.");
  }
}

export const rejectLemburSpl = async (id: string, verifikatorId: number, reason: string | null) => {
  try {
    const response = await api.patch(`/lembur-spl/${id}`, {
      verifikator_id: verifikatorId,
      status_id: 4, 
      alasan_ditolak: reason,
    });
    return response.data;
  } catch (error) {
    throw new Error("Gagal menolak SPL.");
  }
};

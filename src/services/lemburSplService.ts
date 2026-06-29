import { api } from "@/lib/api";
import { LemburSpl } from "@/types/lemburSpl";

export const getLemburSplList = async ({
  page = 1,
  search = "",
  sort = "desc",
}) => {
  const response = await api.get("/v1/lembur-spl", {
    params: {
      page,
      search,
      sort,
    },
  });
  return response.data;
};

export const getLemburSplDetail = async (id: number): Promise<LemburSpl> => {
  const response = await api.get(`/v1/lembur-spl/${id}`);
  return response.data;
};

export const approveLemburSpl = async (id: number) => {
  const response = await api.put(`/v1/lembur-spl/${id}`, {
    status: "approved",
  });
  return response.data;
};

export const rejectLemburSpl = async (
  id: number,
  reason: string | null,
) => {
  const response = await api.put(`/v1/lembur-spl/${id}`, {
    status: "rejected",
    alasan_ditolak: reason,
  });
  return response.data;
};

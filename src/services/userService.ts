import { api } from "@/lib/api";
import { User } from "@/types/userTypes";

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>("/v1/user");
    return response.data;
  } catch (error) {
    throw new Error("Gagal mengambil data user.");
  }
};

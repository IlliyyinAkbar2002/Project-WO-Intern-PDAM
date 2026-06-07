import { api } from "@/lib/api";
import { User } from "@/types/userTypes";

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>("/v1/users");
    return response.data;
  } catch (error) {
    throw new Error("Gagal mengambil data user.");
  }
};

export const resetUserPassword = async (id: number) => {
  try {
    const response = await api.post(`/v1/users/${id}/reset-password`);
    return response.data;
  } catch (error) {
    throw new Error("Gagal reset password.");
  }
};

export const toggleUserStatus = async (id: number) => {
  try {
    const response = await api.patch(`/v1/users/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    throw new Error("Gagal mengubah status user.");
  }
};

export const updateUser = async (id: number, payload: any) => {
  try {
    const response = await api.put(`/v1/users/${id}`, payload);
    return response.data;
  } catch (error) {
    throw new Error("Gagal update user.");
  }
};
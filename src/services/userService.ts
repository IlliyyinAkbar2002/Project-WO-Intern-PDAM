import { api } from "@/lib/api";
import { User } from "@/types/userTypes";
import axios from "axios";

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

export interface ToggleUserStatusResponse {
  message: string;
  is_active: boolean;
  user_id: number;
}

export const toggleUserStatus = async (
  id: number,
): Promise<ToggleUserStatusResponse> => {
  try {
    const response = await api.patch(`/v1/users/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error ?? "Gagal mengubah status user.",
      );
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui.");
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
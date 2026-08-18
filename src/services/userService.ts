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

export interface CheckEmailResponse {
  success: boolean;
  message: string;
  email?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export const checkEmail = async (
  email: string,
): Promise<CheckEmailResponse> => {
  const response = await api.post("/v1/auth/check-email", {
    email,
  });
  return response.data;
};

export const newPassword = async (
  email: string,
  newPassword: string,
): Promise<ResetPasswordResponse> => {
  const response = await api.post("/v1/auth/new-password", {
    email,
    new_password: newPassword,
  });
  return response.data;
};
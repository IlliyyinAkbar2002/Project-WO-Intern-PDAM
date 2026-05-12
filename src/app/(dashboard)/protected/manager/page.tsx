import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function ManagerDashboardPage() {
  // Ambil cookie
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  const role = cookieStore.get("role")?.value;

  // Jika belum login
  if (!token) {
    redirect("/login");
  }

  // Hanya manager (role 3)
  if (role !== "3") {
    redirect("/login");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard Manager</h1>

      <p className="mt-2 text-gray-600">Selamat datang Manager 🔒</p>
    </div>
  );
}

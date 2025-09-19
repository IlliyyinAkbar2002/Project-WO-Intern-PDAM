import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminDashboardPage() {
  // Ambil cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const role = cookieStore.get("role")?.value;

  // Kalau belum login → ke /login
  if (!token) {
    redirect("/login");
  }

  // Kalau role bukan admin (1) → ke /login
  if (role !== "1") {
    redirect("/login");
  }

  // Kalau lolos → tampilkan dashboard admin
  return <div>Admin Dashboard Page 🔒</div>;
}

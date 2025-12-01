import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function UserDashboardPage() {
  // Ambil cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const role = cookieStore.get("role")?.value;

  // Kalau belum login → ke /login
  if (!token) {
    redirect("/login");
  }

  // Kalau role bukan user (2) → ke /login
  if (role !== "2") {
    redirect("/login");
  }

  // Kalau lolos → tampilkan dashboard user
  return <div>User Dashboard Page 🔒</div>;
}

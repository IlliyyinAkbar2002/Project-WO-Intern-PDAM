import AdminDashboardClient from "@/components/super-admin/dashboard/AdminDashboardChart";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function SuperAdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const role = cookieStore.get("role")?.value;

  if (!token) return redirect("/login");

  if (role !== "1") return redirect("/login");

  return <AdminDashboardClient />;
}

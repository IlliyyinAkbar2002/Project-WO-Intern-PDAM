import AdminDashboardClient from "@/components/admin/dashboard/AdminDashboardChart";
import RealtimeClock from "@/components/admin/dashboard/RealTimeClock";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminDashboardPage() {
  // Ambil cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const role = cookieStore.get("role")?.value;
  const userName = cookieStore.get("user_name")?.value ?? "";
  const departmentName = cookieStore.get("departemen_nama")?.value ?? "";

  if (!token) {
    redirect("/login");
  }
  if (role !== "2") {
    redirect("/login");
  }

  // Kalau lolos → tampilkan dashboard user
  return (
      <div className="space-y-6">
        <RealtimeClock userName={userName} departmentName={departmentName} />
        <AdminDashboardClient />
      </div>
    );
}

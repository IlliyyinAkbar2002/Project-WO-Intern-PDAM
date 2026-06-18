import AdminDashboardClient from "@/components/super-admin/dashboard/AdminDashboardChart";
import RealtimeClock from "@/components/super-admin/dashboard/RealTimeClock";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function SuperAdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const role = cookieStore.get("role")?.value;
  const userName = cookieStore.get("user_name")?.value ?? "";
  const departmentName = cookieStore.get("departemen_nama")?.value ?? "";

  if (!token) return redirect("/login");
  if (role !== "1") return redirect("/login");

  return (
    <div className="space-y-6">
      <RealtimeClock userName={userName} departmentName={departmentName} />
      <AdminDashboardClient/>
    </div>
  );
}

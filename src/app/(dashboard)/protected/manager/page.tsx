import AdminDashboardClient from "@/components/manager/dashboard/AdminDashboardChart";
import RealtimeClock from "@/components/manager/dashboard/RealTimeClock";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function ManagerDashboardPage() {
  // Ambil cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const role = cookieStore.get("role")?.value;
  const userName = cookieStore.get("user_name")?.value ?? "";
  const departmentName = cookieStore.get("departemen_nama")?.value ?? "";

  if (!token) {
    redirect("/login");
  }
  if (role !== "3") {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
          <RealtimeClock userName={userName} departmentName={departmentName} />
          <AdminDashboardClient />
        </div>
  );
}

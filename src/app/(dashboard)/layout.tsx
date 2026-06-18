import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Image from "next/image";
import React from "react";
// import { useState } from "react";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //Mengambil token & role dari cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const roleName = cookieStore.get("role_name")?.value ?? "";
  const userName = cookieStore.get("user_name")?.value ?? "";
  const departmentName = cookieStore.get("department_name")?.value ?? "";

  // Jika tidak ada token → login
  if (!token) {
    redirect("/login");
  }

  // Validasi role
  const allowedRoles = ["superadmin", "admin", "manager"];

  if (!allowedRoles.includes(roleName.toLowerCase())) {
    redirect("/login");
  }

  return (
    <div className="relative h-screen w-screen bg-grey-200">
      {/* Navbar */}
      <div className="fixed top-0 h-16 w-full z-[9999]">
        <Navbar roleName={roleName} />
      </div>

      {/* Sidebar */}
      <div className="fixed top-16 h-[calc(100vh-4rem)] w-60 z-10">
        <Sidebar role={roleName.toLowerCase()} departement={departmentName} />
      </div>

      <div className="absolute top-16 left-60 h-[calc(100vh-4rem)] w-[calc(100vw-15rem)] overflow-auto py-12 z-10">
        {children}
      </div>

      <Image
        src="/images/bg-wave.svg"
        alt="Background"
        fill
        className="object-contain object-bottom opacity-15"
        priority
      />
    </div>
  );
  return <>{children}</>;
}

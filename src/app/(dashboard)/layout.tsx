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
  // Ambil token & role dari cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const roleCookie = cookieStore.get("role")?.value;

  // Jika tidak ada token → login
  if (!token) {
    redirect("/login");
  }

  // Validasi role
  if (!["1", "2", "3"].includes(roleCookie ?? "")) {
    redirect("/login");
  }

  // Mapping role untuk Sidebar & Navbar
  let roleType: "admin" | "user";
  let roleName: string;

  switch (roleCookie) {
    case "1":
      roleType = "admin";
      roleName = "Super Admin";
      break;
    case "2":
      roleType = "user";
      roleName = "Manager";
      break;
    case "3":
      roleType = "user";
      roleName = "Employee";
      break;
    default:
      redirect("/login");
  }

  return (
    <div className="relative h-screen w-screen bg-grey-200">
      <div className="fixed top-0 h-16 w-full z-10">
        {/* <Navbar setRole={setRole} /> */}
        <Navbar role={roleType} roleName={roleName} />
      </div>
      <div className="fixed top-16 h-[calc(100vh-4rem)] w-60 z-10">
        <Sidebar role={roleType} />
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

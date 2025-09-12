"use client";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Image from "next/image";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [role, setRole] = useState<"admin" | "user">("admin");

  return (
    <div className="relative h-screen w-screen bg-grey-200">
      <div className="fixed top-0 h-16 w-full z-10">
        <Navbar setRole={setRole} />
      </div>
      <div className="fixed top-16 h-[calc(100vh-4rem)] w-60 z-10">
        <Sidebar role={role} />
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
}

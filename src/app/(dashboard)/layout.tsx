// components/layout/DashboardLayout.tsx
"use client";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation'; 
import Image from "next/image";
import React from "react";

type Role = "superadmin" | "sdm" | "user";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const pathname = usePathname();
  
  // Fungsi untuk menentukan peran yang konsisten berdasarkan URL
  const determineRoleFromPath = (path: string): Role => {
    if (path.startsWith('/admin')) return 'superadmin';
    if (path.startsWith('/sdm')) return 'sdm';
    // Default/fallback ke 'user' jika tidak ada yang cocok (misalnya di /user atau root)
    return 'user'; 
  };
  
  // State diinisialisasi dengan nilai default yang aman ('user')
  const [role, setRole] = useState<Role>('user'); 
  
  // Gunakan useEffect untuk menyinkronkan state 'role' dengan URL
  useEffect(() => {
    const newRole = determineRoleFromPath(pathname);
    // Hanya update state jika peran benar-benar berubah
    if (newRole !== role) {
        setRole(newRole);
    }
  }, [pathname]); // Bergantung pada perubahan URL

  return (
    <div className="relative h-screen w-screen bg-grey-200">
      
      {/* Navbar */}
      <div className="fixed top-0 h-16 w-full z-20">
        {/* Meneruskan role saat ini dan setRole untuk debugging/toggle */}
        <Navbar role={role} setRole={setRole} /> 
      </div>
      
      {/* Sidebar */}
      <div className="fixed top-16 h-[calc(100vh-4rem)] w-60 z-10">
        <Sidebar role={role} />
      </div>
      
      {/* Konten Utama */}
      <div className="absolute top-16 left-60 h-[calc(100vh-4rem)] w-[calc(100vw-15rem)] overflow-auto py-12 px-8 z-10">
        
        {/* Display Role di Dashboard */}
        {/* <h1 className="text-3xl font-bold mb-6 text-primary-900">
            Dashboard {role.toUpperCase()}
        </h1> */}
        
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
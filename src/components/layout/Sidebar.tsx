// components/layout/Sidebar.tsx
"use client";
import {
  ClockCounterClockwiseIcon,
  MapPinAreaIcon,
  PulseIcon,
  SignOutIcon,
  ToolboxIcon,
  UsersThreeIcon,
  ChartBarIcon,
  ClipboardTextIcon,
} from "@phosphor-icons/react";
import SidebarItem from "./SidebarItem"; // Pastikan path benar
import Link from "next/link";
import React from "react"; 

type Role = "superadmin" | "sdm" | "user";

interface SidebarProps {
  role: Role;
}

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  subMenu?: { label: string; href: string }[];
}

const baseUserPath = "/user";
const baseAdminPath = "/admin"; 
const baseSdmPath = "/sdm";

const menuItems: Record<Role, MenuItem[]> = {
  // --- MENU SUPERADMIN (SESUAI GAMBAR KIRI) ---
  superadmin: [
    {
      title: "Dashboard",
      icon: <ChartBarIcon size={24} className="text-primary-500" />,
      href: baseAdminPath,
    },
    {
      title: "Master Nama Work Order", // Sesuai dengan gambar
      icon: <ToolboxIcon size={24} className="text-primary-500" />,
      // Diasumsikan ini mengarah ke halaman daftar work order
      href: `${baseAdminPath}/master/workorder-names`, 
    },
    {
      title: "Manajemen Akun",
      icon: <UsersThreeIcon size={24} className="text-primary-500" />,
      subMenu: [
        { label: "Super Admin", href: `${baseAdminPath}/accounts/superadmin` },
        { label: "SDM", href: `${baseAdminPath}/accounts/sdm` },
        { label: "User Biasa", href: `${baseAdminPath}/accounts/user` },
      ],
    },
    // Master data lainnya dihapus agar sesuai dengan gambar
  ],
  
  // --- MENU SDM (TETAP SAMA, KARENA TIDAK ADA GAMBAR BARU) ---
  sdm: [
    {
      title: "Dashboard",
      icon: <PulseIcon size={24} className="text-primary-500" />,
      href: baseSdmPath,
    },
    {
      title: "Validasi Workorder",
      icon: <ClipboardTextIcon size={24} className="text-primary-500" />,
      subMenu: [
        { label: "Validasi Normal", href: `${baseSdmPath}/validation/normal` },
        { label: "Validasi Lembur", href: `${baseSdmPath}/validation/lembur` },
      ],
    },
    {
      title: "Laporan & Analisis",
      icon: <ChartBarIcon size={24} className="text-primary-500" />,
      href: `${baseSdmPath}/reports`,
    },
  ],

  user: [
    {
      title: "Dashboard",
      icon: <PulseIcon size={24} className="text-primary-500" />,
      href: baseUserPath,
    },
    {
      title: "Work Order",
      icon: <ToolboxIcon size={24} className="text-primary-500" />,
      subMenu: [
        { label: "Normal", href: `${baseUserPath}/workorders/normal/create` },
        { label: "Lembur", href: `${baseUserPath}/workorders/lembur/create` },
      ],
    },
    {
      title: "Riwayat",
      icon: (
        <ClockCounterClockwiseIcon size={24} className="text-primary-500" />
      ),
      subMenu: [
        { label: "Normal", href: `${baseUserPath}/history/normal` },
        { label: "Lembur", href: `${baseUserPath}/history/lembur` },
      ],
    },
    {
        title: "Master Elemen", // Sesuai gambar
        icon: <MapPinAreaIcon size={24} className="text-primary-500" />,
        subMenu: [
            { label: "Elemen Formulir", href: `${baseUserPath}/master-elements/form-elements` }, // Sesuai gambar
        ],
    }
  ],
};

export default function Sidebar({ role }: SidebarProps) {
  const menu = menuItems[role] ?? [];
  
  return (
    <div className="bg-standardWhite text-standardBlack p-4 flex flex-col justify-between border-r-2 border-grey-300 h-full w-full overflow-y-auto">
      <div>
        <div className="flex justify-between items-center mb-4 space-x-3">
          <h2 className="text-primary-500 font-medium">Menu</h2>
        </div>
        <nav className="space-y-4">
          {menu.map((item) =>
            item.subMenu ? (
              <SidebarItem
                key={item.title} 
                title={item.title}
                icon={item.icon}
                subMenu={item.subMenu}
              />
            ) : (
              item.href && (
                <Link
                  key={item.title} 
                  href={item.href}
                  className="flex items-center space-x-3 font-medium text-primary-900 hover:bg-primary-100 pl-1 py-2 rounded"
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              )
            )
          )}
        </nav>
      </div>
      <Link
        href="/logout"
        className="flex space-x-3 hover:bg-primary-100 text-primary-900 font-medium pl-1 py-2 rounded"
      >
        <SignOutIcon size={24} className="text-danger-500" />
        <span>Keluar</span>
      </Link>
    </div>
  );
}
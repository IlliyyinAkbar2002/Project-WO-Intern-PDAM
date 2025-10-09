// components/layout/Navbar.tsx
"use client";
import { 
  ShieldCheckeredIcon, 
  UsersThreeIcon, 
  HardHatIcon,
  UserIcon, // Import UserIcon
  BellIcon, // Import BellIcon
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Role = "superadmin" | "sdm" | "user";

interface NavbarProps {
  role: Role;
  setRole: React.Dispatch<React.SetStateAction<Role>>;
}

export default function Navbar({ role, setRole }: NavbarProps) {
  
  // Logika toggle role untuk debugging
  const toggleRole = () => {
    if (role === "user") {
      setRole("sdm");
    } else if (role === "sdm") {
      setRole("superadmin");
    } else {
      setRole("user");
    }
  };
  
  // Tentukan teks dan link berdasarkan peran
  const accountText = role === "superadmin" ? "Akun Superadmin" : role === "sdm" ? "Akun SDM" : "Akun User";
  const accountLink = role === "superadmin" ? "/admin/profile" : role === "sdm" ? "/sdm/profile" : "/user/profile";
  
  return (
    <div className="flex h-full w-full justify-between items-center bg-standardWhite border-b-2 border-grey-300 text-primary-500 py-4 px-12">
      
      {/* KIRI: Logo PDAM */}
      <Link
        href="https://www.pdam-sby.go.id/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center"
      >
        <Image
          src="/images/logo-pdam.svg"
          alt="logo pdam"
          width={40}
          height={40}
        />
      </Link>
      
      {/* KANAN: Akun [Role] dengan Ikon */}
      <div className="flex items-center space-x-6">
        
        {/* DEBUG: Tombol Toggle Role TERSEMBUNYI */}
        <div 
          onClick={toggleRole} 
          className="absolute top-0 left-1/2 p-2 cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
          title="DEBUG: Click to toggle role"
        >
          DEBUG: {role?.toUpperCase()}
        </div>
        
        {/* Kontainer untuk Ikon User, Link Akun, dan Ikon Notifikasi */}
        <div className="flex items-center space-x-2"> 
          {/* Ikon User */}
          <UserIcon size={24} className="text-primary-500" /> 
          
          {/* Link Akun */}
          <Link 
              href={accountLink} 
              className="text-primary-900 font-medium hover:text-primary-700 transition-colors text-base"
          >
            {accountText}
          </Link>
          
          {/* Ikon Notifikasi */}
          <BellIcon size={24} className="text-primary-500" /> 
        </div>
        
      </div>
    </div>
  );
}
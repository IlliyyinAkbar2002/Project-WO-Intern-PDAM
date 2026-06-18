"use client";

import { BellIcon, UserIcon, CaretDownIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

interface NavbarProps {
  roleName: string;
}

export default function Navbar({ roleName }: NavbarProps) {
  const router = useRouter();
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // =====================================================
  // CLOSE DROPDOWN WHEN CLICK OUTSIDE
  // =====================================================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =====================================================
  // GET ROLE PATH
  // =====================================================
  const getRolePath = () => {
    const role = Cookies.get("role_name");
    switch (role) {
      case "superadmin":
        return "super-admin";
      case "admin":
        return "admin";
      case "manager":
        return "manager";
      default:
        return "";
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Keluar dari aplikasi?",
      text: "Anda harus login kembali untuk mengakses aplikasi.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
      reverseButtons: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    Cookies.remove("token");
    Cookies.remove("role_name");
    Cookies.remove("user_id");
    Cookies.remove("departemen_id");
    Cookies.remove("user_name");
    Cookies.remove("department_name");
    router.replace("/login");
  };

  return (
    <div className="relative z-[9999] flex h-full w-full items-center justify-between border-b-2 border-grey-300 bg-standardWhite px-12 py-4 text-primary-500">
      {/* ================================================= */}
      {/* LOGO */}
      {/* ================================================= */}
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

      {/* ================================================= */}
      {/* RIGHT SECTION */}
      {/* ================================================= */}
      <div className="flex items-center space-x-4">
        <span className="font-semibold capitalize text-primary-500">
          {roleName}
        </span>

        {/* ============================================= */}
        {/* PROFILE DROPDOWN */}
        {/* ============================================= */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpenProfileMenu((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-grey-100"
          >
            <UserIcon size={26} />
            <span>Profile</span>
            <CaretDownIcon
              size={16}
              className={`transition-transform ${
                openProfileMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {openProfileMenu && (
            <div className="fixed right-8 top-14 z-[9999] w-56 overflow-hidden rounded-lg border border-grey-200 bg-white shadow-lg">
              {/* HEADER */}
              <div className="border-b border-grey-200 px-4 py-3">
                <p className="font-semibold text-grey-900">Akun Saya</p>
                <p className="text-xs capitalize text-grey-500">{roleName}</p>
              </div>

              {/* MENU */}
              <button
                onClick={() => {
                  setOpenProfileMenu(false);
                  router.push(`/protected/${getRolePath()}/profile`);
                }}
                className="flex w-full items-center px-4 py-3 text-left text-sm hover:bg-grey-100"
              >
                👤 Profile Saya
              </button>

              <button
                onClick={() => {
                  setOpenProfileMenu(false);
                  router.push(`/protected/${getRolePath()}/profile/edit`);
                }}
                className="flex w-full items-center px-4 py-3 text-left text-sm hover:bg-grey-100"
              >
                ✏️ Edit Profile
              </button>

              <div className="border-t border-grey-200" />

              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>

        {/* ============================================= */}
        {/* NOTIFICATION */}
        {/* ============================================= */}
        <button
          type="button"
          className="rounded-lg p-2 transition hover:bg-grey-100"
        >
          <BellIcon size={26} />
        </button>
      </div>
    </div>
  );
}
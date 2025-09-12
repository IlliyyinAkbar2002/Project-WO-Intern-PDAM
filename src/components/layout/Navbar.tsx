"use client";
import { BellIcon, UserIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
  setRole: (role: "admin" | "user") => void;
}

export default function Navbar({ setRole }: NavbarProps) {
  return (
    <div className="flex h-full w-full justify-between items-center bg-standardWhite border-b-2 border-grey-300 text-primary-500 py-4 px-12">
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
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-green-500">
          <button onClick={() => setRole("user")}>user</button>
          <button onClick={() => setRole("admin")}>admin</button>
        </div>
        <Link href="/login" className="cursor-pointer">
          <UserIcon size={24} />
        </Link>
        <div>Profile</div>
        <div>
          <BellIcon size={24} />
        </div>
      </div>
    </div>
  );
}

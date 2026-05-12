"use client";

import { BellIcon, UserIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavbarProps {
  roleName: string;
}

export default function Navbar({roleName }: NavbarProps) {
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
        <span className="font-semibold text-primary-500 capitalize">
          {roleName}
        </span>

        <Link href="#profile" className="cursor-pointer">
          <UserIcon size={26} />
        </Link>
        <div>Profile</div>

        <div>
          <BellIcon size={26} />
        </div>
      </div>
    </div>
  );
}

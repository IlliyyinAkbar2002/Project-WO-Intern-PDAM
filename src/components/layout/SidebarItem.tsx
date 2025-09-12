"use client";
import { useState } from "react";
import Link from "next/link";
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";

interface SidebarItemProps {
  title: string;
  icon: React.ReactNode;
  subMenu?: { label: string; href: string }[];
}

export default function SidebarItem({
  title,
  icon,
  subMenu,
}: SidebarItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full hover:bg-primary-100 px-1 py-2 rounded"
      >
        <div className="flex items-center space-x-3 text-primary-900 font-medium">
          {icon}
          <span>{title}</span>
        </div>
        {subMenu &&
          (isOpen ? <CaretUpIcon size={16} /> : <CaretDownIcon size={16} />)}
      </button>

      {subMenu && (
        <div
          className={`pl-6 border-l-2 border-primary-300 ml-3.5 overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {subMenu.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex pl-4 hover:bg-primary-100 py-2 rounded"
            >
              <span className="text-grey-600">{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

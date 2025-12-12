"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ClockCounterClockwiseIcon,
  HammerIcon,
  HardHatIcon,
  MapPinAreaIcon,
  PersonIcon,
  PersonSimpleIcon,
  PulseIcon,
  SignOutIcon,
  ToolboxIcon,
  User,
} from "@phosphor-icons/react";
import SidebarItem from "./SidebarItem";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SidebarProps {
  role: "admin" | "user";
}

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  subMenu?: { label: string; href: string }[];
}

const baseUserPath = "/protected/user";
const baseAdminPath = "/protected/admin";

const menuItems: Record<"admin" | "user", MenuItem[]> = {
  admin: [
    {
      title: "Dashboard",
      icon: <PulseIcon size={24} className="text-primary-500" />,
      href: baseAdminPath,
    },
    {
      title: "Master Pegawai",
      icon: <User size={24} className="text-primary-500" />,
      subMenu: [
        {
          label: "Data Pegawai",
          href: `${baseAdminPath}/master-pegawai/employee-data`,
        },
        { label: "Monitoring", href: "/admin/master-formulir/monitoring" },
      ],
    },
    {
      title: "Master Workorder",
      icon: <ToolboxIcon size={24} className="text-primary-500" />,
      subMenu: [
        {
          label: "Jenis Workorder",
          href: `${baseAdminPath}/master-workorders/workorder-categories`,
        },
        {
          label: "List Workorder",
          href: `${baseAdminPath}/master-workorders/workorder-categories`,
        },
        {
          label: "History Workorder",
          href: `${baseAdminPath}/master-workorders/workorder-categories`,
        },
        {
          label: "Parameter Workorder",
          href: `${baseAdminPath}/master-workorders/workorder-categories`,
        },
      ],
    },
    {
      title: "Master Location",
      icon: <MapPinAreaIcon size={24} className="text-primary-500" />,
      subMenu: [
        {
          label: "Radius Lokasi",
          href: `${baseAdminPath}/master-locations/location-radius`,
        },
      ],
    },
    {
      title: "Master Material",
      icon: <HammerIcon size={24} className="text-primary-500" />,
      subMenu: [
        {
          label: "Jenis Material",
          href: `${baseAdminPath}/master-locations/location-radius`,
        },
      ],
    },
  ],
  user: [
    {
      title: "Dashboard",
      icon: <PulseIcon size={24} className="text-primary-500" />,
      href: baseUserPath,
    },
    {
      title: "Buat Workorder",
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
  ],
};

export default function Sidebar({ role }: SidebarProps) {
  const router = useRouter();
  const menu = menuItems[role] ?? [];

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Redirect ke login
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="bg-standardWhite text-standardBlack p-4 flex flex-col justify-between border-r-2 border-grey-300 h-full w-full overflow-y-auto">
      <div>
        <div className="flex justify-between items-center mb-4 space-x-3">
          <h2 className="text-primary-500 font-medium">Menu</h2>
        </div>
        <nav className="space-y-4">
          {menu.map((item, index) =>
            item.subMenu ? (
              <SidebarItem
                key={index}
                title={item.title}
                icon={item.icon}
                subMenu={item.subMenu}
              />
            ) : (
              <Link
                key={index}
                href={item.href!}
                className="flex items-center space-x-3 font-medium text-primary-900 hover:bg-primary-100 pl-1 py-2 rounded"
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            )
          )}
        </nav>
      </div>
      {/* logout alert dialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="flex w-full space-x-3 hover:bg-primary-100 text-primary-900 font-medium pl-1 py-2 rounded">
            <SignOutIcon size={24} className="text-danger-500" />
            <span>Keluar</span>
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar dari aplikasi?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Ya, Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

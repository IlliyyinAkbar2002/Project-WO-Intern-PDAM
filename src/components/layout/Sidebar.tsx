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
  AddressBookIcon,
  ClockCounterClockwiseIcon,
  HammerIcon,
  MapPinAreaIcon,
  PulseIcon,
  SignOutIcon,
  ToolboxIcon,
  User,
} from "@phosphor-icons/react";
import SidebarItem from "./SidebarItem";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface SidebarProps {
  role: string;
  departement?: string;
}

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  subMenu?: { label: string; href: string }[];
}

const baseSuperAdminPath = "/protected/super-admin";
const baseAdminPath = "/protected/admin";
const baseManagerPath = "/protected/manager";

const menuItems: Record<string, MenuItem[]> = {
  // role superadmin
  superadmin: [
    {
      title: "Dashboard",
      icon: <PulseIcon size={24} className="text-primary-500" />,
      href: baseSuperAdminPath,
    },
    {
      title: "List Pengaduan",
      icon: <AddressBookIcon size={24} className="text-primary-500" />,
      href: `${baseSuperAdminPath}/pengaduan`,
    },
    {
      title: "Master Pegawai",
      icon: <User size={24} className="text-primary-500" />,
      subMenu: [
        {
          label: "Data Pegawai",
          href: `${baseSuperAdminPath}/master-pegawai/employee-data`,
        },
        { label: "Monitoring", href: `${baseSuperAdminPath}/master-formulir/monitoring` },
      ],
    },
    {
      title: "Master Workorder",
      icon: <ToolboxIcon size={24} className="text-primary-500" />,
      subMenu: [
        {
          label: "Jenis Workorder",
          href: `${baseSuperAdminPath}/master-workorders/workorder-categories`,
        },
        {
          label: "Workorder",
          href: `${baseSuperAdminPath}/master-workorders/workorder`,
        },
        {
          label: "History Workorder",
          href: `${baseSuperAdminPath}/master-workorders/workorder-categories`,
        },
        {
          label: "Approve Workorder Lembur",
          href: `${baseSuperAdminPath}/master-workorders/workorder-categories`,
        },
      ],
    },
    {
      title: "View Location",
      icon: <MapPinAreaIcon size={24} className="text-primary-500" />,
      subMenu: [
        {
          label: "Radius Lokasi",
          href: `${baseSuperAdminPath}/master-locations/location-radius`,
        },
      ],
    },
    {
      title: "Master Material",
      icon: <HammerIcon size={24} className="text-primary-500" />,
      subMenu: [
        {
          label: "Data Material",
          href: `${baseSuperAdminPath}/master-materials/material-data`,
        },
        {
          label: "Log Penggunaan Material",
          href: `${baseSuperAdminPath}/master-materials/material-`,
        },
      ],
    },
  ],
  // role admin
  admin: [
    {
      title: "Dashboard",
      icon: <PulseIcon size={24} className="text-primary-500" />,
      href: baseAdminPath,
    },
    {
      title: "Buat Workorder",
      icon: <ToolboxIcon size={24} className="text-primary-500" />,
      subMenu: [
        {
          label: "Normal",
          href: `${baseAdminPath}/workorders/normal/create`,
        },
        {
          label: "Lembur",
          href: `${baseAdminPath}/workorders/lembur/create`,
        },
      ],
    },
    {
      title: "Riwayat",
      icon: (
        <ClockCounterClockwiseIcon size={24} className="text-primary-500" />
      ),
      subMenu: [
        { label: "Normal", href: `${baseAdminPath}/history/normal` },
        { label: "Lembur", href: `${baseAdminPath}/history/lembur` },
      ],
    },
  ],
  // role manager
  manager: [
    {
      title: "Dashboard",
      icon: <PulseIcon size={24} className="text-primary-500" />,
      href: baseManagerPath,
    },
    {
      title: "List Pengaduan",
      icon: <AddressBookIcon size={24} className="text-primary-500" />,
      href: `${baseManagerPath}/pengaduan`,
    },
    {
      title: "Master Workorder",
      icon: <ToolboxIcon size={24} className="text-primary-500" />,
      subMenu: [
        {
          label: "Jenis Workorder",
          href: `${baseManagerPath}/master-workorders/workorder-categories`,
        },
        {
          label: "List Workorder",
          href: `${baseManagerPath}/master-workorders/workorder-categories`,
        },
        {
          label: "History Workorder",
          href: `${baseManagerPath}/master-workorders/workorder-categories`,
        },
        {
          label: "Approve Workorder",
          href: `${baseManagerPath}/master-workorders/workorder-categories`,
        },
      ],
    },
    {
      title: "Master Material",
      icon: <HammerIcon size={24} className="text-primary-500" />,
      subMenu: [
        {
          label: "Data Material",
          href: `${baseManagerPath}/master-materials/material-data`,
        },
        {
          label: "Log Penggunaan Material",
          href: `${baseManagerPath}/master-materials/material-`,
        },
      ],
    },
  ],
};

export default function Sidebar({ role }: SidebarProps) {
  const router = useRouter();
  const menu = menuItems[role] ?? [];

  const handleLogout = async () => {
    try {
      await api.post("/v1/auth/logout");

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

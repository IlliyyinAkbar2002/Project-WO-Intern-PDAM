// "use client";
// import { BellIcon, UserIcon } from "@phosphor-icons/react";
// import Image from "next/image";
// import Link from "next/link";

// interface NavbarProps {
//   setRole: (role: "admin" | "user") => void;
// }

// export default function Navbar({ setRole }: NavbarProps) {
//   return (
//     <div className="flex h-full w-full justify-between items-center bg-standardWhite border-b-2 border-grey-300 text-primary-500 py-4 px-12">
//       <Link
//         href="https://www.pdam-sby.go.id/"
//         target="_blank"
//         rel="noopener noreferrer"
//         className="flex items-center"
//       >
//         <Image
//           src="/images/logo-pdam.svg"
//           alt="logo pdam"
//           width={40}
//           height={40}
//         />
//       </Link>
//       <div className="flex items-center space-x-4">
//         <div className="flex items-center space-x-2 text-green-500">
//           <button onClick={() => setRole("user")}>User</button>
//           <button onClick={() => setRole("admin")}>Admin</button>
//         </div>
//         <Link href="/login" className="cursor-pointer">
//           <UserIcon size={24} />
//         </Link>
//         <div>Profile</div>
//         <div>
//           <BellIcon size={24} />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { BellIcon, UserIcon, SignOutIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { confirmDialog } from "@/utils/confirmDialog";

interface NavbarProps {
  role: "admin" | "user";
  roleName: string;
}

export default function Navbar({ role, roleName }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    // Pop up sweet alert
    const ok = await confirmDialog(
      "Yakin logout?",
      "Kamu harus login lagi setelah ini.",
      "Logout",
      "Batal"
    );

    if (ok) {
      // hapus token
      Cookies.remove("token");
      // reset role
      Cookies.remove("role");
      // redirect ke login
      router.push("/login");
    }
  };

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
          {role === "admin" ? "super admin" : "User"}
        </span>
        
        <Link href="#profile" className="cursor-pointer">
          <UserIcon size={24} />
        </Link>
        <div>Profile</div>

        {/* Tambahan Button Logout */}
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-600 font-medium"
        >
          Logout
        </button>

        <div>
          <BellIcon size={24} />
        </div>
      </div>
    </div>
  );
}

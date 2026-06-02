"use client";

import {
  EyeIcon,
  EyeSlashIcon,
  LockKeyIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { api, ensureCsrfToken } from "@/lib/api";

interface LoginUserResponse {
  id: number;
  pegawai_id: number;
  name: string;
  email: string;
  role_id: number;
  role_name: string;
  departemen_id: number;
  departemen_nama: string;
  jabatan_id: number;
  jabatan_nama: string;
}

export default function LoginForm() {
  const router = useRouter();

  // =========================================================
  // STATE
  // =========================================================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // =========================================================
  // VALIDATION
  // =========================================================
  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  // =========================================================
  // HANDLE LOGIN
  // =========================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setEmailError("");
    setPasswordError("");
    try {
      // ===============================================
      // VALIDATION
      // ===============================================
      if (!validateEmail(email)) {
        setEmailError("Format email tidak valid.");
        return;
      }
      if (password.length < 8) {
        setPasswordError("Kata sandi minimal 8 karakter.");
        return;
      }

      // ===============================================
      // GET CSRF
      // ===============================================
      await ensureCsrfToken();

      // ===============================================
      // LOGIN REQUEST
      // ===============================================
      const res = await api.post("/v1/auth/login", {
        email,
        password,
      });

      const token: string = res.data.access_token;
      const user: LoginUserResponse = res.data.user;

      if (!token) {
        throw new Error("Token tidak ditemukan.");
      }
      if (!user) {
        throw new Error("Data user tidak ditemukan.");
      }

      // ===============================================
      // SAVE COOKIE
      // ===============================================
      Cookies.set("token", token, {
        expires: 1,
        path: "/",
      });

      Cookies.set("user_id", String(user.id), {
        expires: 1,
        path: "/",
      });

      Cookies.set("pegawai_id", String(user.pegawai_id), {
        expires: 1,
        path: "/",
      });

      Cookies.set("role", String(user.role_id), {
        expires: 1,
        path: "/",
      });

      Cookies.set("role_name", user.role_name.toLowerCase(), {
        expires: 1,
        path: "/",
      });

      Cookies.set("departemen_id", String(user.departemen_id), {
        expires: 1,
        path: "/",
      });

      Cookies.set("departemen_nama", user.departemen_nama, {
        expires: 1,
        path: "/",
      });

      Cookies.set("jabatan_id", String(user.jabatan_id), {
        expires: 1,
        path: "/",
      });

      Cookies.set("jabatan_nama", user.jabatan_nama, {
        expires: 1,
        path: "/",
      });

      Cookies.set("user_name", user.name, {
        expires: 1,
        path: "/",
      });

      // ===============================================
      // REDIRECT
      // ===============================================
      const roleName = user.role_name.toLowerCase();

      switch (roleName) {
        case "superadmin":
          router.push("/protected/super-admin");
          break;
        case "admin":
          router.push("/protected/admin");
          break;
        case "manager":
          router.push("/protected/manager");
          break;
        default:
          setError("Role tidak dikenali.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat login.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="m-auto w-full px-4 md:max-w-md md:px-0">
      <h2 className="mb-10 text-center text-5xl font-semibold text-primary-500">
        Login
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl bg-standardWhite p-8 shadow-2xl shadow-grey-400"
      >
        {/* EMAIL */}
        <div>
          <label className="text-md font-medium text-primary-500">Email</label>

          <div className="flex items-center border-b-2 border-primary-100 bg-grey-100 py-3 transition-all duration-300 ease-out focus-within:border-primary-500">
            <span className="px-2 text-primary-500">
              <UserCircleIcon size={24} />
            </span>

            <div className="h-4 border-r-2 border-grey-700" />

            <Input
              type="email"
              placeholder="Email"
              variant="auth"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {emailError && <p className="text-sm text-red-500">{emailError}</p>}
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-md font-medium text-primary-500">
            Kata Sandi
          </label>

          <div className="flex items-center border-b-2 border-primary-100 bg-grey-100 py-3 transition-all duration-300 ease-out focus-within:border-primary-500">
            <span className="px-2 text-primary-500">
              <LockKeyIcon size={24} />
            </span>

            <div className="h-4 border-r-2 border-grey-700" />

            <Input
              type={isVisible ? "text" : "password"}
              placeholder="Kata sandi"
              variant="auth"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setIsVisible((prev) => !prev)}
              className="px-2 text-primary-500 hover:text-primary-600"
            >
              {isVisible ? <EyeIcon size={24} /> : <EyeSlashIcon size={24} />}
            </button>
          </div>

          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}
        </div>

        {/* FORGOT PASSWORD */}
        <div>
          <Link
            href="/"
            className="font-medium text-primary-500 hover:underline"
          >
            Lupa kata sandi?
          </Link>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full rounded-lg bg-primary-500 p-3 font-medium text-standardWhite hover:bg-primary-600 ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {isLoading ? "Loading..." : "Masuk"}
        </button>

        {/* ERROR */}
        {error && <p className="text-center text-sm text-red-500">{error}</p>}
      </form>
    </div>
  );
}

// "use client";

// import {
//   EyeIcon,
//   EyeSlashIcon,
//   LockKeyIcon,
//   UserCircleIcon,
// } from "@phosphor-icons/react";
// import Link from "next/link";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { api, ensureCsrfToken } from "@/lib/api";
// import Cookies from "js-cookie";

// export default function LoginForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isVisible, setIsVisible] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [emailError, setEmailError] = useState("");
//   const [passwordError, setPasswordError] = useState("");

//   const router = useRouter();

//   const validateEmail = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");
//     setEmailError("");
//     setPasswordError("");

//     // validasi email
//     if (!validateEmail(email)) {
//       setEmailError("Format email tidak valid.");
//       setIsLoading(false);
//       return;
//     }

//     // validasi password
//     if (password.length < 8) {
//       setPasswordError("Kata sandi harus minimal 8 karakter.");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // memanggil csrf
//       await ensureCsrfToken();
//       //login request
//       const res = await api.post("/v1/auth/login", { email, password });

//       // Debug: Log the actual response structure
//       console.log("Login response data:", res.data);
//       console.log("Response structure:", {
//         hasAccessToken: !!res.data.access_token,
//         hasToken: !!res.data.token,
//         hasUser: !!res.data.user,
//         userData: res.data.user,
//         userRoleId: res.data.user?.role_id,
//         userRole: res.data.user?.role,
//         fullResponse: res.data,
//       });

//       // Ambil token
//       const token = res.data.access_token;
//       // Ambil data user
//       const userData = res.data.user;

//       if (!token) {
//         throw new Error("Token tidak ditemukan");
//       }
//       if (!userData) {
//         throw new Error("User data tidak ditemukan");
//       }

//       // Ambil role
//       const roleName = userData.role_name?.toLowerCase() ?? "";
//       const roleId = userData.role_id;
//       const userName = userData.name;

//       // Simpan cookies
//       Cookies.set("token", token, {
//         expires: 1,
//         path: "/",
//       });

//       Cookies.set("role", String(roleId), {
//         expires: 1,
//         path: "/",
//       });

//       Cookies.set("role_name", roleName, {
//         expires: 1,
//         path: "/",
//       });

//       Cookies.set("user_name", userName, {
//         expires: 1,
//         path: "/",
//       });

//       // Redirect berdasarkan role
//       if (roleName === "superadmin") {
//         router.push("/protected/super-admin");
//       } else if (roleName === "admin") {
//         router.push("/protected/admin");
//       } else if (roleName === "manager") {
//         router.push("/protected/manager");
//       } else {
//         setError("Role tidak dikenali");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="w-full px-4 md:px-0 md:max-w-md m-auto ">
//       <h2 className="text-5xl font-semibold text-primary-500 text-center mb-10">
//         Login
//       </h2>
//       <form
//         onSubmit={handleSubmit}
//         className="space-y-4 p-8 rounded-3xl shadow-2xl shadow-grey-400 bg-standardWhite"
//       >
//         <div>
//           <label
//             htmlFor="email"
//             className="text-primary-500 text-md font-medium"
//           >
//             Email
//           </label>
//           <div className="flex items-center py-3 border-b-2 border-primary-100 bg-grey-100  focus-within:border-primary-500 transition-all duration-300 ease-out">
//             <span className="px-2 text-primary-500">
//               <UserCircleIcon size={24} />
//             </span>
//             <div className="h-4 border-r-2 border-grey-700"></div>
//             <Input
//               type={"email"}
//               placeholder="Email"
//               variant="auth"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           {emailError && (
//             <p className="text-red-500 text-sm text-start">{emailError}</p>
//           )}
//         </div>
//         <div>
//           <label
//             htmlFor="password"
//             className="text-primary-500 text-md font-medium"
//           >
//             Kata Sandi
//           </label>
//           <div className="flex items-center py-3 border-b-2 border-primary-100 bg-grey-100  focus-within:border-primary-500 transition-all duration-300 ease-out">
//             <span className="px-2 text-primary-500">
//               <LockKeyIcon size={24} />
//             </span>
//             <div className="h-4 border-r-2 border-grey-700"></div>
//             <Input
//               type={isVisible ? "text" : "password"}
//               placeholder="Kata Sandi"
//               variant="auth"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <button
//               type="button"
//               onClick={() => setIsVisible(!isVisible)}
//               className="px-2 text-primary-500 hover:text-primary-600 "
//             >
//               {isVisible ? <EyeIcon size={24} /> : <EyeSlashIcon size={24} />}
//             </button>
//           </div>
//           {passwordError && (
//             <p className="text-red-500 text-sm text-start">{passwordError}</p>
//           )}
//         </div>
//         <div>
//           <Link
//             href="/"
//             className="text-primary-500 font-medium hover:underline"
//           >
//             Lupa kata sandi?
//           </Link>
//         </div>

//         <button
//           disabled={isLoading}
//           type="submit"
//           className={`w-full text-standardWhite p-3 font-medium bg-primary-500 rounded-lg hover:bg-primary-600 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//         >
//           {isLoading ? "Loading..." : "Masuk"}
//         </button>
//         {error && <p className="text-red-500 text-sm text-center">{error}</p>}
//       </form>
//     </div>
//   );
// }

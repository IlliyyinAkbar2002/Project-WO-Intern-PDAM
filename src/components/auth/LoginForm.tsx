"use client";

import {
  EyeIcon,
  EyeSlashIcon,
  LockKeyIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import Cookies from "js-cookie";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Format email tidak valid.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setPasswordError("Kata sandi harus minimal 8 karakter.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. login request
      // await api.get("/sanctum/csrf-cookie");
      const res = await api.post("/login", { email, password });

      // Debug: Log the actual response structure
      console.log("Login response data:", res.data);
      console.log("Response structure:", {
        hasAccessToken: !!res.data.access_token,
        hasToken: !!res.data.token,
        hasUser: !!res.data.user,
        userData: res.data.user,
        userRoleId: res.data.user?.role_id,
        userRole: res.data.user?.role,
        fullResponse: res.data
      });

      // 2. ambil token & role dari response backend
      // Try different possible token field names
      const token = res.data.access_token || res.data.token;
      const userData = res.data.user || res.data;

      // Try different possible role field names
      const roleId = userData?.role_id || userData?.role?.id || userData?.role;

      if (!token) {
        throw new Error(`Token tidak ditemukan di response. Available fields: ${Object.keys(res.data).join(', ')}`);
      }

      if (!roleId) {
        throw new Error(`Role tidak ditemukan di response. User data: ${JSON.stringify(userData)}`);
      }

      // 3. simpan ke cookie agar bisa diakses di server component
      Cookies.set("token", token, { expires: 1 }); // 1 hari
      Cookies.set("role", roleId.toString(), { expires: 7 });

      // 4. set header default axios (optional, kalau mau auto-auth setelah login)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 5. ambil data user (karena token sudah tersimpan, otomatis keikut di header Authorization)
      const me = await api.get("/me");
      const user = me.data;

      // 6. redirect sesuai role
      const numericRoleId = typeof roleId === 'string' ? parseInt(roleId) : roleId;
      if (numericRoleId === 1) {
        router.push("/protected/admin");
      } else if (numericRoleId === 2 || numericRoleId === 3) {
        router.push("/protected/user");
      } else {
        setError("Role tidak dikenali");
      }

    } catch (err: any) {
      if (err.response) {
        console.error("Login error response:", err.response.data);
      } else if (err.request) {
        console.error("Login error request:", err.request);
      } else {
        console.error("Login error message:", err.message);
      }
      setError("Login gagal. Periksa email dan password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full px-4 md:px-0 md:max-w-md m-auto ">
      <h2 className="text-5xl font-semibold text-primary-500 text-center mb-10">
        Login
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-8 rounded-3xl shadow-2xl shadow-grey-400 bg-standardWhite"
      >
        <div>
          <label
            htmlFor="email"
            className="text-primary-500 text-md font-medium"
          >
            Email
          </label>
          <div className="flex items-center py-3 border-b-2 border-primary-100 bg-grey-100  focus-within:border-primary-500 transition-all duration-300 ease-out">
            <span className="px-2 text-primary-500">
              <UserCircleIcon size={24} />
            </span>
            <div className="h-4 border-r-2 border-grey-700"></div>
            <Input
              type={"email"}
              placeholder="Email"
              variant="auth"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {emailError && (
            <p className="text-red-500 text-sm text-start">{emailError}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="text-primary-500 text-md font-medium"
          >
            Kata Sandi
          </label>
          <div className="flex items-center py-3 border-b-2 border-primary-100 bg-grey-100  focus-within:border-primary-500 transition-all duration-300 ease-out">
            <span className="px-2 text-primary-500">
              <LockKeyIcon size={24} />
            </span>
            <div className="h-4 border-r-2 border-grey-700"></div>
            <Input
              type={isVisible ? "text" : "password"}
              placeholder="Kata Sandi"
              variant="auth"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              className="px-2 text-primary-500 hover:text-primary-600 "
            >
              {isVisible ? <EyeIcon size={24} /> : <EyeSlashIcon size={24} />}
            </button>
          </div>
          {passwordError && (
            <p className="text-red-500 text-sm text-start">{passwordError}</p>
          )}
        </div>
        <div>
          <Link
            href="/"
            className="text-primary-500 font-medium hover:underline"
          >
            Lupa kata sandi?
          </Link>
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className={`w-full text-standardWhite p-3 font-medium bg-primary-500 rounded-lg hover:bg-primary-600 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          {isLoading ? "Loading..." : "Masuk"}
        </button>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>
    </div>
  );
}

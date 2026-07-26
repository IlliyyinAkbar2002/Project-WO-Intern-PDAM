"use client";

import {
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  EnvelopeSimpleIcon,
  LockKeyIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { checkEmail, newPassword } from "@/services/userService";
import Swal from "sweetalert2";

export default function ForgotPasswordForm() {
  const router = useRouter();
  // =========================================================
  // STATE
  // =========================================================
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  // =========================================================
  // VALIDATION
  // =========================================================
  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const resetErrors = () => {
    setError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
  };

  // =========================================================
  // STEP 1 : CHECK EMAIL
  // =========================================================
  const handleCheckEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    resetErrors();

    if (!validateEmail(email)) {
      setEmailError("Format email tidak valid.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await checkEmail(email);

      if (response.success) {
        await Swal.fire({
          icon: "success",
          title: "Email Ditemukan",
          text: response.message,
          timer: 1500,
          showConfirmButton: false,
        });
        setStep(2);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.message ?? "Email tidak ditemukan.";
      setError(message);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // STEP 2 : RESET PASSWORD
  // =========================================================
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetErrors();

    let hasError = false;

    if (password.length < 8) {
      setPasswordError("Kata sandi minimal 8 karakter.");
      hasError = true;
    }

    if (confirmPassword.length < 8) {
      setConfirmPasswordError("Konfirmasi kata sandi minimal 8 karakter.");
      hasError = true;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Konfirmasi kata sandi tidak sama.");
      hasError = true;
    }

    if (hasError) return;

    try {
      setIsLoading(true);
      const response = await newPassword(email, password);

      if (response.success) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Password berhasil diperbarui. Silakan login menggunakan password baru.",
          confirmButtonColor: "#0F766E",
        });
        router.push("/login");
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message ?? "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <div className="m-auto w-full px-4 md:max-w-md md:px-0">
      <h2 className="mb-10 text-center text-5xl font-semibold text-primary-500">
        Lupa Kata Sandi
      </h2>

      {step === 1 ? (
        <form
          onSubmit={handleCheckEmail}
          className="space-y-4 rounded-3xl bg-standardWhite p-8 shadow-2xl shadow-grey-400">
          {/* EMAIL */}
          <div>
            <label className="text-md font-medium text-primary-500">
              Email
            </label>

            <div className="flex items-center border-b-2 border-primary-100 bg-grey-100 py-3 transition-all duration-300 ease-out focus-within:border-primary-500">
              <span className="px-2 text-primary-500">
                <EnvelopeSimpleIcon size={24} />
              </span>

              <div className="h-4 border-r-2 border-grey-700" />

              <Input
                type="email"
                variant="auth"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}/>
            </div>

            {emailError && (
              <p className="mt-1 text-sm text-red-500">{emailError}</p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full rounded-lg bg-primary-500 p-3 font-medium text-standardWhite transition-all hover:bg-primary-600 ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}>
            {isLoading ? "Memeriksa..." : "Cek Email"}
          </button>

          {/* ERROR */}
          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          {/* BACK */}
          <div className="pt-2">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 font-medium text-primary-500 hover:underline">
              <ArrowLeftIcon size={18} />
              Kembali ke Login
            </Link>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleResetPassword}
          className="space-y-4 rounded-3xl bg-standardWhite p-8 shadow-2xl shadow-grey-400"
        >
          {/* EMAIL */}
          <div>
            <label className="text-md font-medium text-primary-500">
              Email
            </label>

            <div className="flex items-center border-b-2 border-primary-100 bg-grey-100 py-3">
              <span className="px-2 text-primary-500">
                <EnvelopeSimpleIcon size={24} />
              </span>

              <div className="h-4 border-r-2 border-grey-700" />

              <Input variant="auth" value={email} disabled />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-md font-medium text-primary-500">
              Password Baru
            </label>

            <div className="flex items-center border-b-2 border-primary-100 bg-grey-100 py-3 transition-all duration-300 ease-out focus-within:border-primary-500">
              <span className="px-2 text-primary-500">
                <LockKeyIcon size={24} />
              </span>

              <div className="h-4 border-r-2 border-grey-700" />

              <Input
                type={showPassword ? "text" : "password"}
                variant="auth"
                placeholder="Password baru"
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-2 text-primary-500 hover:text-primary-600">
                {showPassword ? (
                  <EyeIcon size={24} />
                ) : (
                  <EyeSlashIcon size={24} />
                )}
              </button>
            </div>

            {passwordError && (
              <p className="mt-1 text-sm text-red-500">{passwordError}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-md font-medium text-primary-500">
              Konfirmasi Password
            </label>

            <div className="flex items-center border-b-2 border-primary-100 bg-grey-100 py-3 transition-all duration-300 ease-out focus-within:border-primary-500">
              <span className="px-2 text-primary-500">
                <LockKeyIcon size={24} />
              </span>

              <div className="h-4 border-r-2 border-grey-700" />

              <Input
                type={showConfirmPassword ? "text" : "password"}
                variant="auth"
                placeholder="Konfirmasi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}/>

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="px-2 text-primary-500 hover:text-primary-600">
                {showConfirmPassword ? (
                  <EyeIcon size={24} />
                ) : (
                  <EyeSlashIcon size={24} />
                )}
              </button>
            </div>

            {confirmPasswordError && (
              <p className="mt-1 text-sm text-red-500">
                {confirmPasswordError}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full rounded-lg bg-primary-500 p-3 font-medium text-standardWhite transition-all hover:bg-primary-600 ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}>
            {isLoading ? "Menyimpan..." : "Simpan Password Baru"}
          </button>

          {/* ERROR */}
          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          {/* BACK */}
          <button
            type="button"
            onClick={() => {
              setStep(1);
              resetErrors();
              setPassword("");
              setConfirmPassword("");
            }}
            className="flex w-full items-center justify-center gap-2 font-medium text-primary-500 hover:underline">
            <ArrowLeftIcon size={18} />
            Kembali
          </button>
        </form>
      )}
    </div>
  );
}

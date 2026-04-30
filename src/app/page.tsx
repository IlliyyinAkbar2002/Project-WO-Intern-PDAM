"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/login");
  };
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      <img
        src="/images/bg-wave.svg"
        alt="Background"
        className="absolute bottom-0 left-0 w-full h-auto object-contain max-h-screen opacity-30 pointer-events-none z-0"
      />

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <Button
          className="pointer-events-auto"
          size="lg"
          onClick={handleRedirect}
        >
          Selamat Datang
        </Button>
      </div>
    </main>
  );
}

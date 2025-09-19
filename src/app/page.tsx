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
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <Button className="mt-4" size="lg" onClick={handleRedirect}>
        Selamat Datang
      </Button>
    </main>
  );
}

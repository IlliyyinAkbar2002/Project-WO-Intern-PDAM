import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <Button className="mt-4" size="lg">
        Selamat Datang
      </Button>
    </main>
  );
}

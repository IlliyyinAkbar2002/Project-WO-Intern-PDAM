"use client";

import { MainTable } from "@/components/shared/tables/MainTable";
import { Pagination } from "@/components/shared/tables/Pagination";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { columns } from "./columns";
import { Workorder } from "@/types";

interface HistoryContainerProps {
  data: Workorder[];
  totalPages: number;
  currentPage: number;
  search: string;
  type: "normal" | "lembur";
  itemsPerPage: number;
}

export default function HistoryContainer({
  data,
  totalPages,
  currentPage,
  search,
  type,
  itemsPerPage,
}: HistoryContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = 3;
  const [searchText, setSearchText] = useState(search);

  useEffect(() => {
    if (searchText.trim() === "") {
      const params = new URLSearchParams(window.location.search);
      if (params.has("search")) {
        params.delete("search");
        params.set("page", currentPage.toString());
        router.push(`?${params.toString()}`);
      }
    }
  }, [searchText]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.set("search", searchText.trim());
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex-col mx-10 rounded-lg overflow-hidden bg-white">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-2xl font-semibold">
          Monitoring Riwayat Pengajuan WO
          {type === "normal" ? " Normal" : " Lembur"}
        </h2>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Pencarian"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Pagination
            totalPages={totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
          {role === 3 && (
            <Link href={`/user/workorders/${type}/create`}>
              <Button variant="primary" size="sm">
                <PlusCircleIcon size={50} />
                Pengajuan Baru
              </Button>
            </Link>
          )}
        </div>
      </div>
      <MainTable
        columns={columns({ currentPage, itemsPerPage, type })}
        data={data}
        loading={false}
      />
    </div>
  );
}

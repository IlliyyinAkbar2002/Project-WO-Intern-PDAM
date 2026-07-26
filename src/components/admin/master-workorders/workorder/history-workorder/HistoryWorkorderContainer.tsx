"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MainTable } from "@/components/shared/tables/MainTable";
import { Pagination } from "@/components/shared/tables/Pagination";
import SingleSelect from "@/components/shared/fields/SingleSelect";
import { Input } from "@/components/ui/input";
import { sortOptions } from "@/constants/options";
import { HistoryWorkorder } from "@/types/workorderTypes";
import { columns } from "./columns";

interface Props {
  data: HistoryWorkorder[];
  totalPages: number;
  currentPage: number;
  search: string;
  sort: string;
  itemsPerPage: number;
  openDetail: (id: number) => void;
}

export default function HistoryWorkorderContainer({
  data,
  totalPages,
  currentPage,
  search,
  sort,
  itemsPerPage,
  openDetail,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState(search);
  const [sortData, setSortData] = useState(sort);

  const handleSearchChange = (value: string) => {
    setSearchText(value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("search", value);
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  const handleSortChange = (selected: any) => {
    const value = selected?.value || "desc";

    setSortData(value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mx-28 overflow-hidden rounded-lg bg-white">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-semibold">History Workorder</h2>

          <SingleSelect
            placeholder="Terbaru"
            options={sortOptions}
            value={sortOptions.find((item) => item.value === sortData) || null}
            onChange={handleSortChange}/>
        </div>

        <div className="flex items-center gap-4">
          <Input
            placeholder="Cari workorder..."
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}/>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}/>
        </div>
      </div>

      <div className="px-4 pb-4">
        <MainTable
          loading={false}
          data={data}
          columns={columns({
            currentPage,
            itemsPerPage,
            openDetail,
          })}
        />
      </div>
    </div>
  );
}

"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import notFoundAnimation from "@/../public/animation/notfound.json";
import loadingAnimation from "@/../public/animation/loading.json";

interface MainTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
  renderActions?: (row: TData) => React.ReactNode;
}

export function MainTable<TData, TValue>({
  columns,
  data,
  loading,
  renderActions,
}: MainTableProps<TData, TValue>) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="bg-primary-500 text-white text-center"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="bg-white">
              <div className="flex flex-col items-center justify-center">
                <Lottie animationData={loadingAnimation} className="w-32" />
                <p className="text-lg text-gray-600 pb-5">Memuat data...</p>
              </div>
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="bg-white text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
              {renderActions && (
                <TableCell>{renderActions(row.original)}</TableCell>
              )}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="bg-white">
              <div className="flex flex-col items-center justify-center">
                <Lottie animationData={notFoundAnimation} className="w-32" />
                <p className="text-lg text-gray-600 pb-5">Data tidak ada</p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

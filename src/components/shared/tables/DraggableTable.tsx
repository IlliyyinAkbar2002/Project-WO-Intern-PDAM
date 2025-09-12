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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableRow from "./DraggableRow";

interface DraggableTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  setData: (data: TData[]) => void;
  isDraggable?: boolean;
}

export function DraggableTable<TData extends { id: number; order: number }>({
  columns,
  data,
  setData,
  isDraggable = true,
}: DraggableTableProps<TData>) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = data.findIndex((item) => item.id === active.id);
    const newIndex = data.findIndex((item) => item.id === over.id);

    const newData = arrayMove(data, oldIndex, newIndex).map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setData(newData);
  };

  const tableContent = (
    <Table className="overflow-hidden">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            <TableHead className="bg-primary-500"></TableHead>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="text-center bg-primary-500 text-white"
                style={{ width: `${header.column.getSize()}px` }}
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
        {table.getRowModel().rows.map((row) => (
          <DraggableRow
            key={row.original.id}
            row={row}
            isDraggable={isDraggable}
          />
        ))}
      </TableBody>
    </Table>
  );

  return isDraggable ? (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={data.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {tableContent}
      </SortableContext>
    </DndContext>
  ) : (
    tableContent
  );
}

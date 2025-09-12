"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableRow, TableCell } from "@/components/ui/table";
import { flexRender, Row } from "@tanstack/react-table";
import { GripVertical } from "lucide-react";
import { is } from "date-fns/locale";

interface DraggableRowProps<TData extends { id: number }> {
  row: Row<TData>;
  isDraggable: boolean;
}

export default function DraggableRow<TData extends { id: number }>({
  row,
  isDraggable,
}: DraggableRowProps<TData>) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: row.original.id,
      disabled: !isDraggable,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`cursor-default bg-white text-center ${
        isDraggable ? "hover:bg-gray-50" : "hover:bg-white"
      }`}
    >
      <TableCell className="w-10">
        {isDraggable && (
          <div
            {...listeners}
            {...attributes}
            title="Drag"
            className="cursor-grab"
          >
            <GripVertical className="text-grey-600" />
          </div>
        )}
      </TableCell>

      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          style={{ width: `${cell.column.getSize()}px` }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

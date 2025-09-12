"use client";

import { ProgressWorkorder } from "@/types";
import WorkorderProgressCard from "./WorkorderProgressCard";

interface WorkorderProgressListProps {
  items: ProgressWorkorder[];
  jenisWorkorder: number;
}

export default function WorkorderProgressList({
  items,
  jenisWorkorder,
}: WorkorderProgressListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <WorkorderProgressCard key={item.id} item={item} jenisWorkorder={jenisWorkorder}/>
      ))}
    </div>
  );
}

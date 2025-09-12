import HistoryContainer from "@/components/user/history/HistoryContainer";
import { getWorkorders } from "@/services/workorderService";
import { notFound } from "next/navigation";

type WorkorderType = "normal" | "lembur";

const typeToIdMap: Record<WorkorderType, number> = {
  normal: 1,
  lembur: 2,
};

interface HistoryPageProps {
  params: { type: string };
  searchParams?: { page?: string; search?: string };
}

export default async function HistoryPage({
  params,
  searchParams,
}: HistoryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const type = resolvedParams.type as WorkorderType;
  const validType = type in typeToIdMap;
  if (!validType) notFound();

  const rawPage = parseInt(resolvedSearchParams?.page || "1", 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const search = resolvedSearchParams?.search || "";
  const itemsPerPage = 5;

  const workordersData = await getWorkorders(
    typeToIdMap[type],
    page,
    itemsPerPage,
    search
  );

  return (
    <HistoryContainer
      data={workordersData.data}
      totalPages={workordersData.totalPages}
      currentPage={page}
      search={search}
      type={type}
      itemsPerPage={itemsPerPage}
    />
  );
}

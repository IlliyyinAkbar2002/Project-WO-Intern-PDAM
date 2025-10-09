import DetailWorkorderContainer from "@/components/user/workorders/detail/DetailWorkorderContainer";
import { getProgressWorkorders } from "@/services/progressWorkorderService";
import { getWorkorderById } from "@/services/workorderService";
import { notFound } from "next/navigation";

type WorkorderType = "normal" | "lembur";

const typeToIdMap: Record<WorkorderType, number> = {
  normal: 1,
  lembur: 2,
};

interface DetailWorkorderPageProps {
  params: { type: string; id: string };
}

export default async function DetailWorkorderPage({
  params,
}: DetailWorkorderPageProps) {
  const resolvedParams = await params;
  const type = resolvedParams.type as WorkorderType;
  const validType = type in typeToIdMap;
  const idNumber = parseInt(resolvedParams.id, 10);
  if (isNaN(idNumber) || idNumber <= 0 || !validType) notFound();

  const [workorderData, progressWorkorderData] = await Promise.all([
    getWorkorderById(idNumber.toString()),
    getProgressWorkorders(idNumber.toString()),
  ]);

  if (!workorderData) notFound();

  return (
    <DetailWorkorderContainer
      workorder={workorderData}
      progressWorkorder={progressWorkorderData}
    />
  );
}
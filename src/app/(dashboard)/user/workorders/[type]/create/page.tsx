import CreateWorkorderContainer from "@/components/user/workorders/create/CreateWorkorderContainer";
import { getJenisWorkorders } from "@/services/jenisWorkorderService";
import { getUsers } from "@/services/userService";
import { notFound } from "next/navigation";

type WorkorderType = "normal" | "lembur";

const typeToIdMap: Record<WorkorderType, number> = {
  normal: 1,
  lembur: 2,
};
interface CreateWorkorderPageProps {
  params: { type: string };
}

export default async function CreateWorkorderPage({
  params,
}: CreateWorkorderPageProps) {
  const resolvedParams = await params;
  const type = resolvedParams.type as WorkorderType;
  const validType = type in typeToIdMap;
  if (!validType) notFound();

  const [jenisWorkordersData, usersData] = await Promise.all([
    getJenisWorkorders(undefined, undefined, undefined, undefined, true),
    getUsers(),
  ]);

  return (
    <CreateWorkorderContainer
      type={type}
      jenisWorkorders={jenisWorkordersData.data}
      users={usersData}
    />
  );
}

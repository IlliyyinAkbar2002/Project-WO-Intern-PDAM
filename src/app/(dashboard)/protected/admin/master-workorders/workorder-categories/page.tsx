import { getJenisWorkorders } from "@/services/jenisWorkorderService";
import WorkorderCategoriesContainer from "@/components/admin/master-workorders/workorder-categories/WorkorderCategoriesContainer";
import { JenisWorkorderResponse } from "@/types/jenisWorkorderTypes";

interface WorkorderCategoriesPageProps {
  searchParams?: {
    page?: string;
    search?: string;
    sort?: string;
    modal?: string;
  };
}

export default async function WorkorderCategoriesPage({
  searchParams,
}: WorkorderCategoriesPageProps) {
  const resolvedSearchParams = await searchParams;
  const rawPage = parseInt(resolvedSearchParams?.page || "1", 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const search = resolvedSearchParams?.search || "";
  const sort = resolvedSearchParams?.sort || "desc";
  const modal = resolvedSearchParams?.modal || null;
  const itemsPerPage = 5;

  let jenisWorkorderData: JenisWorkorderResponse = {
    data: [],
    totalPages: 0,
    currentPage: 0,
  };

  if (!modal) {
    jenisWorkorderData = await getJenisWorkorders(
      page,
      itemsPerPage,
      search,
      sort
    );
  }

  return (
    <WorkorderCategoriesContainer
      data={jenisWorkorderData.data}
      totalPages={jenisWorkorderData.totalPages}
      currentPage={page}
      search={search}
      sort={sort}
      itemsPerPage={itemsPerPage}
    />
  );
}

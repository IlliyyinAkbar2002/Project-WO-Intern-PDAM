"use client";

import { useEffect, useState } from "react";
import HistoryWorkorderContainer from "@/components/manager/master-workorders/workorder/history-workorder/HistoryWorkorderContainer";
import HistoryDetailModal from "@/components/manager/master-workorders/workorder/history-workorder/HistoryDetailModal";
import {
  getWorkorderHistory,
  getWorkorderHistoryDetail,
} from "@/services/workorderService";
import {
  HistoryWorkorder,
  HistoryWorkorderDetailResponse,
} from "@/types/workorderTypes";

export default function HistoryWorkorderPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<HistoryWorkorder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDetail, setSelectedDetail] =
    useState<HistoryWorkorder | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const response = await getWorkorderHistory(currentPage);

      setData(response.data || []);

      setCurrentPage(response.currentPage || 1);

      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (id: number) => {
    try {
      const detail = await getWorkorderHistoryDetail(id);

      setSelectedDetail({
        ...detail.workorder,
        workorderAssignment: detail.assignment,
        progressWorkorder: detail.progress,
        laporanWorkorder: detail.laporan,
      });
      setOpenModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [currentPage]);

  return (
    <>
      <HistoryWorkorderContainer
        data={data}
        totalPages={totalPages}
        currentPage={currentPage}
        search=""
        sort="desc"
        itemsPerPage={10}
        openDetail={handleOpenDetail}/>

      <HistoryDetailModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        data={selectedDetail}/>
    </>
  );
}

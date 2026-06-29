"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import LemburList from "@/components/super-admin/approval-lembur/LemburList";
import LemburDetail from "@/components/super-admin/approval-lembur/LemburDetail";
import {
  getLemburSplList,
  getLemburSplDetail,
  approveLemburSpl,
  rejectLemburSpl,
} from "@/services/lemburSplService";
import { LemburSpl } from "@/types/lemburSpl";
import Swal from "sweetalert2";

interface LemburResponseState {
  data: LemburSpl[];
  totalPages: number;
  currentPage: number;
}

export default function ApprovalLemburPage() {
  const searchParams = useSearchParams();
  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "desc";
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<LemburSpl | null>(null);
  const [lemburData, setLemburData] = useState<LemburResponseState>({
    data: [],
    totalPages: 0,
    currentPage: 1,
  });

  const loadData = async () => {
    try {
      setLoading(true);

      const res = await getLemburSplList({
        page,
        search,
        sort,
      });

      setLemburData({
        data: res.data,
        totalPages: res.last_page,
        currentPage: res.current_page,
      });
    } catch (error) {
      console.error("Failed to fetch lembur SPL:", error);

      setLemburData({
        data: [],
        totalPages: 0,
        currentPage: 1,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, search, sort]);

  const handleSelect = async (item: LemburSpl) => {
    try {
      setLoading(true);

      const detail = await getLemburSplDetail(item.id);

      setSelected(detail);
    } catch (error) {
      console.error("Failed to fetch detail lembur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelected(null);
  };

  const handleApprove = async (id: number) => {
    const result = await Swal.fire({
      title: "Setujui Pengajuan?",
      text: "Pengajuan lembur akan disetujui dan Work Order akan diproses.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Setujui",
      cancelButtonText: "Batal",
      confirmButtonColor: "#16a34a",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await approveLemburSpl(id);

      await Swal.fire({
        title: "Berhasil",
        text: "Pengajuan lembur berhasil disetujui.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      await loadData();

      if (selected?.id === id) {
        const detail = await getLemburSplDetail(id);
        setSelected(detail);
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menyetujui pengajuan.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    const result = await Swal.fire({
      title: "Tolak Pengajuan",
      input: "textarea",
      inputLabel: "Alasan Penolakan",
      inputPlaceholder: "Masukkan alasan penolakan...",
      inputAttributes: {
        maxlength: "500",
      },
      showCancelButton: true,
      confirmButtonText: "Tolak",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
      inputValidator: (value) => {
        if (!value) {
          return "Alasan penolakan wajib diisi";
        }
      },
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await rejectLemburSpl(id, result.value);

      await Swal.fire({
        title: "Berhasil",
        text: "Pengajuan lembur berhasil ditolak.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      await loadData();

      if (selected?.id === id) {
        const detail = await getLemburSplDetail(id);

        setSelected(detail);
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menolak pengajuan.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (selected) {
    return <LemburDetail data={selected} onBack={handleBack} />;
  }

  return (
    <LemburList
      data={lemburData.data}
      totalPages={lemburData.totalPages}
      currentPage={lemburData.currentPage}
      search={search}
      sort={sort}
      loading={loading}
      onSearch={() => {}}
      onSort={() => {}}
      onPageChange={() => {}}
      onSelect={handleSelect}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
}

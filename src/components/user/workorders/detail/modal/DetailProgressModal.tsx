"use client";

import ImageUpload from "@/components/shared/fields/ImageUpload";
import { getJenisWorkorderById } from "@/services";
import { JenisWorkorder, ProgressWorkorder } from "@/types";
import { XIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DetailProgressModalProps {
  onClose: () => void;
  item: ProgressWorkorder;
  jenisWorkorder: number;
}

export default function DetailProgressModal({
  onClose,
  item,
  jenisWorkorder,
}: DetailProgressModalProps) {
  const [jenisWorkorders, setJenisWorkorders] = useState<JenisWorkorder | null>(
    null
  );
  useEffect(() => {
    if (item.tipeProgress !== "Selesai") return;
    const fetchData = async () => {
      try {
        const response = await getJenisWorkorderById(jenisWorkorder);
        setJenisWorkorders(response);
      } catch (error) {
        toast.error("Coba Reload ulang halaman!");
      }
    };

    fetchData();
  }, [item.tipeProgress, jenisWorkorder]);

  const imageUrls = item.dokumentasiProgress.map(
    (img) => `${process.env.NEXT_PUBLIC_API_URL}/storage/${img.url}`
  );

  return (
    <div className="fixed inset-0 z-99 flex items-center justify-center bg-black bg-opacity-50 px-96">
      <div className="flex flex-col bg-white rounded-lg overflow-hidden w-full max-h-[90vh]">
        <div className="flex bg-primary-500 justify-between items-center px-6 py-3">
          <h2 className="text-2xl font-semibold text-white">
            {item.tipeProgress}
          </h2>
          <button
            aria-label="Close"
            title="Close"
            className="hover:bg-gray-600 rounded-full p-1"
            onClick={onClose}
          >
            <XIcon className="text-white" size={20} />
          </button>
        </div>
        <div className="flex-col p-6 space-y-4 overflow-y-auto">
          <div className="p-4 space-y-4 bg-gray-100 rounded-lg">
            <div className="space-y-2">
              <p>
                <strong>Deskripsi:</strong>{" "}
                {item.hasilPengerjaan || "Dalam proses pengerjaan..."}
              </p>
              <p>
                <strong>Waktu:</strong> {item.waktuSubmit || "-"}
              </p>
            </div>
            {imageUrls.length > 0 ? (
              <div className="cursor-pointer">
                <ImageUpload images={imageUrls} readOnly />
              </div>
            ) : (
              <p className="text-gray-500">Tidak ada dokumentasi</p>
            )}
          </div>
          {item.tipeProgress === "Selesai" && (
            <div className="p-4 space-y-2 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold">Formulir Pengumpulan</h3>
              {item.detailProgress.length > 0 ? (
                item.detailProgress.map((dp) => {
                  const formInfo = jenisWorkorders?.detailForm.find(
                    (df) => df.id === dp.detailFormId
                  );

                  if (!formInfo) return null;

                  if (formInfo.tipeField === "image") {
                    const imageUrl = dp.value.startsWith("http")
                      ? dp.value
                      : `${process.env.NEXT_PUBLIC_API_URL}/storage/${dp.value}`;
                    return (
                      <div key={dp.id} className="mb-2">
                        <p className="text-sm text-gray-600 mb-1">
                          {formInfo.namaField}
                        </p>
                        <ImageUpload images={[imageUrl]} readOnly />
                      </div>
                    );
                  }

                  return (
                    <div key={dp.id} className="mb-2">
                      <p className="text-sm text-gray-600">
                        {formInfo.namaField}
                      </p>
                      <p className="text-base font-medium text-gray-800">
                        {dp.value}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">Tidak ada dokumentasi</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

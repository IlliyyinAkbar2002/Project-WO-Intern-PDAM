import React from "react";
import { MemberProgress } from "@/types/progressWorkorderTypes";

type Props = {
  open: boolean;
  member: MemberProgress | null;
  onClose: () => void;
};

const ProgressDetailModal: React.FC<Props> = ({ open, member, onClose }) => {
  if (!open || !member) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[600px] p-5 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Detail Progress - {member.nama}</h3>

          <button onClick={onClose} className="text-red-500">
            Close
          </button>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-auto">
          {member.progress_list?.length ? (
            member.progress_list.map((p) => (
              <div key={p.id} className="border p-3 rounded">
                <p className="font-medium">{p.tipe_progress}</p>
                <p className="text-sm text-gray-600">{p.hasil_pengerjaan}</p>
                <p className="text-xs text-gray-400">
                  {p.waktu_submit ?? "Belum submit"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Belum ada progress</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressDetailModal;

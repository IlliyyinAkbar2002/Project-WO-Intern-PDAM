import React from "react";
import { getProgressPercentage } from "@/utils/progressHelper";
import { MemberProgress } from "@/types/progressWorkorderTypes";

type Props = {
  members: MemberProgress[];
  onClickDetail: (member: MemberProgress) => void;
};

const ProgressMemberList: React.FC<Props> = ({ members, onClickDetail }) => {
  return (
    <div className="space-y-3">
      {members.map((m) => (
        <div
          key={m.pegawai_id}
          className="border rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="font-semibold">
              {m.nama}{" "}
              {m.is_pic && <span className="text-blue-500">(PIC)</span>}
            </p>

            <p className="text-sm text-gray-500">
              {m.jabatan ?? "-"} • {m.nip ?? "-"}
            </p>

            <div className="mt-2 text-sm">
              Progress: {getProgressPercentage(m.progress_tahapan)}%
            </div>
          </div>

          <button
            onClick={() => onClickDetail(m)}
            className="px-3 py-1 bg-primary text-white rounded">
            Detail
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProgressMemberList;

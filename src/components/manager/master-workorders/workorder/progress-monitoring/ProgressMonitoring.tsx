"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ProgressMemberList from "./ProgressMemberList";
import ProgressDetailModal from "./ProgressDetailModal";
import type { MemberProgress } from "@/types/progressWorkorderTypes";

type Props = {
  workorderId?: number;
};

const ProgressMonitoring: React.FC<Props> = ({ workorderId }) => {
  const [members, setMembers] = useState<MemberProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberProgress | null>(
    null,
  );
  const [openModal, setOpenModal] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    try {
      const url = workorderId
        ? `/progress-workorder/member-summary/${workorderId}`
        : `/progress-workorder/by-member/${workorderId ?? ""}`;
      const res = await api.get(url);
      // fallback aman
      setMembers(res.data.members ?? res.data);
    } catch (err) {
      console.error("Failed load progress monitoring", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [workorderId]);
  const handleOpenDetail = (member: MemberProgress) => {
    setSelectedMember(member);
    setOpenModal(true);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Monitoring Progress Workorder</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ProgressMemberList
          members={members}
          onClickDetail={handleOpenDetail}/>
      )}

      <ProgressDetailModal
        open={openModal}
        member={selectedMember}
        onClose={() => setOpenModal(false)}/>
    </div>
  );
};

export default ProgressMonitoring;

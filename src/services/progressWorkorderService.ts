import { api } from "@/lib/api";
import {
  MonitoringWorkorder,
  WorkorderMemberSummaryResponse,
  ProgressByMemberResponse,
  ProgressDetail,
} from "@/types/progressWorkorderTypes";

export const ProgressWorkorderService = {
  /**
   * MONITORING LIST (ADMIN / MANAGER)
   * menampilkan semua workorder + progress percentage
   */
  getMonitoring: async () => {
    const { data } = await api.get<MonitoringWorkorder[]>(
      `/v1/progress-workorder/monitoring`,
    );
    return data;
  },

  /**
   * DETAIL MEMBER SUMMARY (1 workorder)
   */
  getMemberSummary: async (workorderId: number) => {
    const { data } = await api.get<WorkorderMemberSummaryResponse>(
      `/v1/progress-workorder/member-summary/${workorderId}`,
    );
    return data;
  },

  /**
   * PROGRESS BY MEMBER (timeline detail per pegawai)
   */
  getProgressByMember: async (workorderId: number) => {
    const { data } = await api.get<ProgressByMemberResponse>(
      `/v1/progress-workorder/by-member/${workorderId}`,
    );
    return data;
  },

  /**
   * REVIEW HISTORY (progress detail log)
   */
  getProgressDetail: async (progressWorkorderId: number) => {
    const { data } = await api.get<ProgressDetail[]>(
      `/v1/progress-detail?progress_workorder_id=${progressWorkorderId}`,
    );
    return data;
  },
};

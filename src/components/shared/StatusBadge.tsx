import { Badge, BadgeProps } from "../ui";

/**
 * SUPPORT:
 * - legacy system: statusId (number)
 * - new system: status string (pengaduan/workorder)
 */

const statusVariantById: Record<number, BadgeProps["variant"]> = {
  1: "warning",
  2: "success",
  3: "warning",
  4: "danger",
  5: "info",
  6: "success",
  7: "info",
  8: "outline",
};

const statusLabelById: Record<number, string> = {
  1: "Belum disetujui",
  2: "Disetujui",
  3: "Revisi",
  4: "Ditolak",
  5: "Pengecekan",
  6: "Selesai",
  7: "Sedang Berjalan",
  8: "Ditunda",
};

/**
 * NEW SYSTEM (Pengaduan & Workorder)
 */
const statusVariantByString: Record<string, BadgeProps["variant"]> = {
  // Pengaduan & Workorder
  Pending: "warning",
  Proses: "info",
  Selesai: "success",
  Ditolak: "danger",
  // Lembur SPL
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

const statusLabelByString: Record<string, string> = {
  // Pengaduan & Workorder
  Pending: "Pending",
  Proses: "Proses",
  Selesai: "Selesai",
  Ditolak: "Ditolak",
  // Lembur SPL
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

interface StatusBadgeProps {
  statusId?: number;
  status?: string;
}

export default function StatusBadge({ statusId, status }: StatusBadgeProps) {
  // PRIORITY: string status (new system)
  if (status) {
    const variant = statusVariantByString[status] ?? "info";
    const label = statusLabelByString[status] ?? "Tidak Diketahui";

    return <Badge variant={variant}>{label}</Badge>;
  }

  // fallback legacy system
  const variant = statusId ? statusVariantById[statusId] : "info";
  const label = statusId ? statusLabelById[statusId] : "Tidak Diketahui";

  return <Badge variant={variant}>{label}</Badge>;
}

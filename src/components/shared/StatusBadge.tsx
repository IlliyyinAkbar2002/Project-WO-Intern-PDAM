import { Badge, BadgeProps } from "../ui";

const statusVariant: Record<number, BadgeProps["variant"]> = {
  1: "warning",
  2: "success",
  3: "warning",
  4: "danger",
  5: "info",
  6: "success",
  7: "info",
  8: "outline",
};

const statusLabel: Record<number, string> = {
  1: "Belum disetujui",
  2: "Disetujui",
  3: "Revisi",
  4: "Ditolak",
  5: "Pengecekan",
  6: "Selesai",
  7: "Sedang Berjalan",
  8: "Ditunda",
};

interface StatusBadgeProps {
  statusId: number;
}

export default function StatusBadge({ statusId }: StatusBadgeProps) {
  const variant = statusVariant[statusId] ?? "info";
  const label = statusLabel[statusId] ?? "Tidak Diketahui";

  return <Badge variant={variant}>{label}</Badge>;
}

import { ColumnDef } from "@tanstack/react-table";
import { MapPinIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Workorder } from "@/types";
import StatusBadge from "@/components/shared/StatusBadge";

interface ColumnsProps {
  currentPage: number;
  itemsPerPage: number;
  type: string;
}

export const columns = ({
  currentPage,
  itemsPerPage,
  type,
}: ColumnsProps): ColumnDef<Workorder>[] => [
  {
    header: "No",
    cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1,
  },
  {
    accessorKey: "judulPekerjaan",
    header: "Judul Pekerjaan",
  },
  {
    accessorKey: "jenisWorkorder.nama",
    header: "Jenis Workorder",
  },
  {
    accessorKey: "jenisLokasi.nama",
    header: "Jenis Lokasi",
  },
  {
    header: "Lokasi",
    cell: ({ row }) => {
      const { latitude, longitude, jenisLokasi } = row.original;
      const lat = Number(latitude);
      const lng = Number(longitude);
      if (jenisLokasi.id === 2) {
        return (
          <span className="text-muted-foreground italic">Tidak ada lokasi</span>
        );
      }
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;

      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
          title="Lihat di Google Maps"
        >
          <MapPinIcon size={16} />
          <span>
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </span>
        </a>
      );
    },
  },
  {
    header: "Estimasi Waktu",
    cell: ({ row }) => {
      const mulai = format(
        new Date(row.original.waktuPenugasan),
        "dd MMM yyyy HH:mm",
        { locale: id }
      );
      const selesai = format(
        new Date(row.original.estimasiSelesai),
        "dd MMM yyyy HH:mm",
        { locale: id }
      );

      return (
        <>
          {mulai} -<br /> {selesai}
        </>
      );
    },
  },
  {
    accessorKey: "estimasiDurasi",
    header: "Durasi",
  },
  {
    accessorKey: "unitWaktu",
    header: "Satuan",
  },
  {
    header: "Petugas",
    cell: ({ row }) => (
      <span>
        {row.original.petugas.pegawai.nip}
        <br />
        {row.original.petugas.pegawai.nama}
      </span>
    ),
  },
  {
    header: "Status",
    cell: ({ row }) => <StatusBadge statusId={row.original.status.id} />,
  },
  {
    header: "Aksi",
    cell: ({ row }) => (
      <Link href={`/user/workorders/${type}/${row.original.id}`}>
        <Button variant={"primary"}>Detail</Button>
      </Link>
    ),
  },
];

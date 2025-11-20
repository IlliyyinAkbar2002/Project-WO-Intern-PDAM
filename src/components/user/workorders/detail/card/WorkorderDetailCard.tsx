import StatusBadge from "@/components/shared/StatusBadge";
import { Workorder } from "@/types/workorderTypes";
import {
CalendarCheckIcon,
CalendarIcon,
ClockIcon,
MapPinIcon,
UserGearIcon,
UserIcon,
} from "@phosphor-icons/react";
import { WorkorderActionButtons } from "../handle-button/WorkorderActionButton";
import { useWorkorderAction } from "@/hooks/useWorkorderAction";

interface WorkorderDetailProps {
workorder: Workorder;
}

export default function WorkorderDetailCard({ workorder }: WorkorderDetailProps) {
const hasMap =
!!workorder.latitude &&
!!workorder.longitude &&
workorder.jenisLokasi.id === 1;

const handlerBase = useWorkorderAction(
String(workorder.id),
String(workorder.lemburSpl?.id)
);

const handlers = {
// approve: handlerBase.approve,
reject: handlerBase.reject,
resume: handlerBase.resume,
accept: handlerBase.accept,
extend: handlerBase.extend,
delay: handlerBase.delay,
revise: handlerBase.revise,
finish: handlerBase.finish
};

return (
<div className="flex gap-8 p-6 bg-white rounded-xl">
<div className="flex-[1] space-y-4">
<div className="w-full">
<h2 className="text-2xl font-bold text-black">
{workorder.judulPekerjaan}
</h2>
<p className="text-sm text-gray-500">
{workorder.jenisWorkorder.nama}
</p>
</div>

    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700">
      <div>
        <span className="flex font-medium items-center gap-2">
          <UserGearIcon size={20} />
          PIC:
        </span>
        {workorder.pic.pegawai.nip} - {workorder.pic.pegawai.nama}
      </div>

      <div>
        <span className="flex font-medium items-center gap-2">
          <UserIcon size={18} />
          Penerima Tugas:
        </span>
        {workorder.petugas.pegawai.nip} - {workorder.petugas.pegawai.nama}
      </div>

      <div>
        <span className="flex font-medium items-center gap-2">
          <ClockIcon size={18} />
          Estimasi Durasi:
        </span>
        {workorder.estimasiDurasi} {workorder.unitWaktu}
      </div>

      <div>
        <span className="flex font-medium items-center gap-2">
          <MapPinIcon size={18} />
          Jenis Lokasi:
        </span>
        {workorder.jenisLokasi.nama}
      </div>

      <div>
        <span className="flex font-medium items-center gap-2">
          <CalendarIcon size={18} />
          Waktu Penugasan:
        </span>
        {new Date(workorder.waktuPenugasan).toLocaleString("id-ID")}
      </div>

      <div>
        <span className="flex font-medium items-center gap-2">
          <CalendarCheckIcon size={18} />
          Estimasi Selesai:
        </span>
        {new Date(workorder.estimasiSelesai).toLocaleString("id-ID")}
      </div>
    </div>

    <WorkorderActionButtons
      status={workorder.status}
      handlers={handlers}
    />
  </div>

  <div className="flex-[1] flex flex-col space-y-4">
    <StatusBadge statusId={workorder.status.id} />

    <div className="flex h-full bg-grey-100 rounded-lg overflow-hidden items-center justify-center">
      {hasMap ? (
        <iframe
          className="w-full h-full"
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps?q=${workorder.latitude},${workorder.longitude}&hl=en&z=14&output=embed`}
        ></iframe>
      ) : (
        <p className="text-grey-500 italic">Lokasi Statis</p>
      )}
    </div>
  </div>
</div>


);
}
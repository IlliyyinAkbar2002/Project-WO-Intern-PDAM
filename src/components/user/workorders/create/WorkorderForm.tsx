import { useEffect, useMemo, useState } from "react";
import { jenisLokasiOptions, unitOptions } from "@/constants/options";
import { calculateEndDate, formatDate } from "@/utils/dateFormatter";
import { validateWorkorderForm } from "@/utils/validation/validateWorkorderForm";
import { prepareWorkorderForm } from "@/utils/form/workorder-form/prepareWorkorderForm";
import { Input } from "@/components/ui/input";
import SingleSelect from "@/components/shared/fields/SingleSelect";
import MultiSelect from "@/components/shared/fields/MultiSelect";
import { Button } from "@/components/ui/button";
import { JenisWorkorder } from "@/types/jenisWorkorderTypes";
import { User } from "@/types/userTypes";
import dynamic from "next/dynamic";
const MapField = dynamic(() => import("@/components/shared/fields/MapField"), {
  ssr: false,
});

interface WorkorderFormProps {
  type: number;
  jenisWorkorders: JenisWorkorder[];
  users: User[];
  onOpenSubmitModal: (data: any, resetForm: () => void) => void;
}

export default function WorkorderForm({
  type,
  jenisWorkorders,
  users,
  onOpenSubmitModal,
}: WorkorderFormProps) {
  const picId = 2;
  const jenisWorkorderOptions = useMemo(
    () =>
      jenisWorkorders.map((item) => ({
        value: String(item.id),
        label: item.nama,
      })),
    [jenisWorkorders]
  );
  const userOptions = useMemo(
    () =>
      users.map((item) => ({
        value: String(item.id),
        label: `${item.pegawai.nip} ${item.pegawai.nama}`,
      })),
    [users]
  );

  const [judulPekerjaan, setJudulPekerjaan] = useState("");
  const [jenisWorkorderId, setJenisWorkorderId] = useState<number>(0);
  const [jenisLokasiId, setJenisLokasiId] = useState<number>(0);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const dateTime = `${startDate} ${startTime}:00`;
  const [estimasiDurasi, setEstimasiDurasi] = useState<number>(0);
  const [unit, setUnit] = useState(type === 2 ? "Jam" : "");
  const [endDate, setEndDate] = useState("");
  const [petugasId, setPetugasId] = useState<number[]>([]);

  useEffect(() => {
    const newEndDate = calculateEndDate(
      startDate,
      startTime,
      estimasiDurasi,
      unit
    );
    setEndDate(newEndDate);
  }, [startDate, startTime, estimasiDurasi, unit]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const resetForm = () => {
    setJudulPekerjaan("");
    setJenisWorkorderId(0);
    setJenisLokasiId(0);
    setLocation(null);
    setStartDate("");
    setStartTime("");
    setEstimasiDurasi(0);
    setUnit(type === 2 ? "Jam" : "");
    setEndDate("");
    setPetugasId([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = {
      judulPekerjaan,
      waktuPenugasan: dateTime,
      startDate,
      startTime,
      estimasiDurasi,
      unitWaktu: unit,
      estimasiSelesai: formatDate(endDate),
      longitude: location?.lng ?? null,
      latitude: location?.lat ?? null,
      picId,
      jenisWorkorderId,
      jenisLokasiId,
      tipeWorkorderId: type,
      petugasId: petugasId,
    };
    const isValid = validateWorkorderForm(form);
    if (!isValid) return;
    const cleanedForm = prepareWorkorderForm(form);
    onOpenSubmitModal(cleanedForm, resetForm);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
      <Input
        label="Judul Pekerjaan"
        placeholder="isi Judul"
        value={judulPekerjaan}
        onChange={(e) => setJudulPekerjaan(e.target.value)}
      />
      <SingleSelect
        label="Jenis Workorder"
        placeholder="Pilih Jenis Workorder"
        value={
          jenisWorkorderOptions.find(
            (item) => item.value === String(jenisWorkorderId)
          ) || null
        }
        onChange={(selected) => setJenisWorkorderId(Number(selected?.value))}
        options={jenisWorkorderOptions}
      />
      <SingleSelect
        label="Jenis Lokasi"
        placeholder="Pilih Jenis Lokasi"
        value={
          jenisLokasiOptions.find(
            (item) => item.value === String(jenisLokasiId)
          ) || null
        }
        onChange={(selected) => setJenisLokasiId(Number(selected.value))}
        options={jenisLokasiOptions}
      />
      {jenisLokasiId === 1 && (
        <div className="col-span-3 z-0">
          <MapField onLocationSelect={handleLocationSelect} showSearch={true} />
          {location && (
            <div className="mt-2 flex justify-end space-x-3 text-sm font-medium text-gray-400">
              <p>Long {location.lng}</p>
              <p>Lat {location.lat}</p>
            </div>
          )}
        </div>
      )}
      <div className="flex col-span-3 w-full gap-4">
        <div className="border-2 p-4 rounded-lg col-span-3 w-full space-y-2">
          <h2 className="text-base font-medium text-primary-500">
            Estimasi Waktu WO Normal
          </h2>
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-900">Mulai</h3>
            <div className="flex gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-900">Estimasi</h3>
            <div className="flex gap-2">
              <Input
                className="w-16"
                placeholder="0"
                value={estimasiDurasi || ""}
                onChange={(e) =>
                  setEstimasiDurasi(
                    e.target.value === "" ? 0 : Number(e.target.value)
                  )
                }
              />
              {type === 2 ? (
                <Input className="w-16" disabled value="Jam" />
              ) : (
                <SingleSelect
                  variant="clear"
                  placeholder="H/J/B"
                  value={
                    unitOptions.find((item) => item.value === unit) || null
                  }
                  onChange={(selected) =>
                    setUnit(selected ? selected.value : "")
                  }
                  options={unitOptions}
                />
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-900">Selesai</h3>
            <div className="flex gap-2">
              <p className="text-gray-400 text-md">
                {endDate || "Pilih waktu mulai dan estimasi"}
              </p>
            </div>
          </div>
        </div>

        <div className="border-2 p-4 rounded-lg col-span-3 w-full space-y-2">
          <h2 className="text-md font-medium text-primary-500">Petugas</h2>
          <MultiSelect
            placeholder="Cari petugas..."
            value={userOptions.filter((item) =>
              petugasId.includes(Number(item.value))
            )}
            onChange={(selected) =>
              setPetugasId(selected.map((item) => Number(item.value)))
            }
            options={userOptions}
          />
        </div>
      </div>
      <div className="col-span-3 flex justify-end">
        <Button type="submit" variant="thirtiary" size="md">
          Ajukan
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button, Input } from "@/components/ui";
import SingleSelect from "@/components/shared/fields/SingleSelect";
import { updateLocationById } from "@/services/masterLocationService";
import { MasterLocation } from "@/types/masterLocationTypes";
import { toast } from "sonner";

const MapField = dynamic(() => import("@/components/shared/fields/MapField"), {
  ssr: false,
});

interface LocationRadiusContainerProps {
  locations: MasterLocation[];
}

export default function LocationRadiusContainer({
  locations,
}: LocationRadiusContainerProps) {
  const locationOptions = useMemo(
    () =>
      locations.map((item) => ({
        value: String(item.id),
        label: `${item.nama} (${item.radiusMeter} meter)`,
      })),
    [locations]
  );

  const [selectedId, setSelectedId] = useState<number>(
    locations.length ? locations[0].id : 0
  );
  const selectedLocation = locations.find((l) => l.id === selectedId) || null;

  const [radius, setRadius] = useState<number>(
    selectedLocation?.radiusMeter || 0
  );
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    selectedLocation
      ? { lat: selectedLocation.latitude, lng: selectedLocation.longitude }
      : null
  );

  // Sync coords when selectedId changes
  useEffect(() => {
    const loc = locations.find((l) => l.id === selectedId);
    if (loc) {
      setRadius(loc.radiusMeter);
      setCoords({ lat: loc.latitude, lng: loc.longitude });
    }
  }, [selectedId, locations]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setCoords({ lat, lng });
  };

  const handleChangeLocation = (option: { value: string; label: string }) => {
    const id = Number(option.value);
    setSelectedId(id);
  };

  const handleSubmit = async () => {
    if (!selectedId || !radius || !coords) {
      toast.error("Pastikan semua field terisi.");
      return;
    }
    try {
      console.log("Saving location:", {
        id: selectedId,
        radius,
        coords,
      });
      await updateLocationById(String(selectedId), {
        radiusMeter: radius,
        latitude: coords.lat,
        longitude: coords.lng,
      });
      toast.success("Data Lokasi berhasil diperbarui.");
    } catch (e) {
      console.error("Error updating location:", e);
      toast.error("Gagal memperbarui data lokasi. Silakan coba lagi.");
    }
  };

  return (
    <div className="flex max-h-full gap-5 px-10 py-6">
      <div className="flex-[2] bg-white rounded-xl p-4 space-y-4">
        <h2 className="text-2xl font-semibold">Area Radius Lokasi</h2>
        <MapField
          onLocationSelect={handleLocationSelect}
          radius={radius}
          initialPosition={
            coords ? [coords.lat, coords.lng] : [-7.265437, 112.754072]
          }
          height={420}
        />
        {coords && (
          <div className="mt-2 flex justify-end space-x-3 text-sm font-medium text-gray-400">
            <p>Long {coords.lng.toFixed(6)}</p>
            <p>Lat {coords.lat.toFixed(6)}</p>
          </div>
        )}
      </div>

      <div className="flex-[1] bg-white rounded-xl p-4 space-y-6">
        <h2 className="text-2xl font-semibold text-center">Ubah Radius Lokasi</h2>
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <SingleSelect
            label="Nama Lokasi"
            placeholder="Pilih Nama Lokasi"
            value={
              locationOptions.find((o) => o.value === String(selectedId)) || null
            }
            onChange={handleChangeLocation as any}
            options={locationOptions}
          />
          <Input
            label="Radius (meter)"
            type="number"
            min={1}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          />
          <Button variant={"primary"} type="submit">
            Simpan
          </Button>
        </form>
      </div>
    </div>
  );
}

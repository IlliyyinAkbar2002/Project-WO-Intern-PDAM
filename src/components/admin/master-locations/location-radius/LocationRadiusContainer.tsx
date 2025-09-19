// "use client";

// import { useMemo, useState } from "react";
// import { MasterLocation } from "@/types/masterLocationTypes";
// import dynamic from "next/dynamic";
// import { Button, Input } from "@/components/ui";
// import SingleSelect from "@/components/shared/fields/SingleSelect";
// import { updateLocationById } from "@/services";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// const MapField = dynamic(() => import("@/components/shared/fields/MapField"), {
//   ssr: false,
// });

// interface LocationRadiusContainerProps {
//   data: MasterLocation[];
// }

// export default function LocationRadiusContainer({
//   data,
// }: LocationRadiusContainerProps) {
//   const router = useRouter();
//   const masterLocationOptions = useMemo(
//     () =>
//       data.map((item) => ({
//         value: String(item.id),
//         label: `${item.nama} (${item.radiusMeter} meter)`,
//       })),
//     [data]
//   );
//   const [masterLocationId, setMasterLocationId] = useState<number>(0);
//   const [radius, setRadius] = useState<number>(0);
//   const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
//     null
//   );
//   const handleLocationSelect = (lat: number, lng: number) => {
//     setLocation({ lat, lng });
//   };
//   const handleSubmit = async () => {
//     if (!masterLocationId || !radius) {
//       toast.error("Pastikan semua field terisi.");
//       return;
//     }

//     try {
//       await updateLocationById(String(masterLocationId), {
//         id: masterLocationId,
//         nama: data.find((loc) => loc.id === masterLocationId)?.nama || "",
//         radiusMeter: radius,
//       });
//       toast.success("Data Lokasi berhasil diperbarui.");
//       router.refresh();
//     } catch (error) {
//       toast.error("Gagal memperbarui data lokasi. Silakan coba lagi.");
//     }
//   };

//   return (
//     <div className="flex max-h-full gap-5 px-20 py-10">
//       <div className="flex-[2] bg-white rounded-xl p-4 space-y-4">
//         <h2 className="text-2xl font-semibold ">Area Radius Lokasi</h2>
//         <MapField onLocationSelect={handleLocationSelect} radius={radius} />
//         {location && (
//           <div className="mt-2 flex justify-end space-x-3 text-sm font-medium text-gray-400">
//             <p>Long {location.lng}</p>
//             <p>Lat {location.lat}</p>
//           </div>
//         )}
//       </div>

//       <div className="flex-[1] bg-white rounded-xl p-4 space-y-8">
//         <h2 className="text-2xl font-semibold text-center">
//           Ubah Radius Lokasi
//         </h2>
//         <form
//           className="space-y-5  "
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleSubmit();
//           }}
//         >
//           <SingleSelect
//             label="Nama Lokasi"
//             placeholder="Pilih Nama Lokasi"
//             value={
//               masterLocationOptions.find(
//                 (item) => item.value === String(masterLocationId)
//               ) || null
//             }
//             onChange={(selected) => {
//               const selectedId = Number(selected.value);
//               setMasterLocationId(selectedId);

//               const selectedLocation = data.find(
//                 (loc) => loc.id === selectedId
//               );
//               if (selectedLocation) {
//                 setRadius(selectedLocation.radiusMeter);
//               }
//             }}
//             options={masterLocationOptions}
//           />
//           <Input
//             label="Radius (meter)"
//             type="number"
//             min={1}
//             value={radius}
//             onChange={(e) => setRadius(Number(e.target.value))}
//           />
//           <Button variant={"primary"} type="submit">
//             Simpan
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// }

// src/components/LocationMap.tsx
"use client";

import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Location {
  id: number;
  nama: string;
  latitude: number;
  longitude: number;
  radiusMeter: number;
}

export default function LocationMap({ locations }: { locations: Location[] }) {
  if (!locations || locations.length === 0) {
    return <p>Tidak ada data lokasi.</p>;
  }

  const center = [locations[0].latitude, locations[0].longitude] as [
    number,
    number
  ];

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {locations.map((loc) => (
        <div key={loc.id}>
          <Marker position={[loc.latitude, loc.longitude]} />
          <Circle
            center={[loc.latitude, loc.longitude]}
            radius={loc.radiusMeter}
            pathOptions={{ color: "blue", fillOpacity: 0.2 }}
          />
        </div>
      ))}
    </MapContainer>
  );
}

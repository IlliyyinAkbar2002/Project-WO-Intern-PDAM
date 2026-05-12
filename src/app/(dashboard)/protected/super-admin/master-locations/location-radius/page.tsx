"use client";

import { useEffect, useState } from "react";
import LocationRadiusContainer from "@/components/super-admin/master-locations/location-radius/LocationRadiusContainer";
import { getLocations } from "@/services/masterLocationService";
import { MasterLocation } from "@/types/masterLocationTypes";

export default function LocationRadiusPage() {
  const [locationsData, setLocationsData] = useState<MasterLocation[]>([]);

  useEffect(() => {
    getLocations()
      .then(setLocationsData)
      .catch((err) => console.error("Gagal mengambil data lokasi:", err));
  }, []);

  return (
    <div>
      <LocationRadiusContainer
        locations={Array.isArray(locationsData) ? locationsData : []}
      />
    </div>
  );
}

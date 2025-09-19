// import LocationRadiusContainer from "@/components/admin/master-locations/location-radius/LocationRadiusContainer";
// import { getLocations } from "@/services";

// export default async function LocationRadiusPage() {
//   const locationsData = await getLocations();
//   return <LocationRadiusContainer data={locationsData} />;
// }

// src/app/(dashboard)/admin/master-locations/location-radius/page.tsx
import LocationRadiusContainer from "@/components/admin/master-locations/location-radius/LocationRadiusContainer";
import { getLocations } from "@/services/masterLocationService";

export default async function LocationRadiusPage() {
  const locationsData = await getLocations();

  return (
    <div>
      {/* <h1>Radius Lokasi</h1> */}
      <ul>
        {locationsData.map((loc) => (
          <li key={loc.id}>
            {loc.nama} ({loc.radiusMeter} m)
          </li>
        ))}
      </ul>
      <LocationRadiusContainer locations={locationsData} />
    </div>
  );
}

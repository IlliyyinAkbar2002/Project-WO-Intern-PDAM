
import LocationRadiusContainer from "@/components/admin/master-locations/location-radius/LocationRadiusContainer";
import { getLocations } from "@/services/masterLocationService";

export default async function LocationRadiusPage() {
  const locationsData = await getLocations();

  return (
    <div>
      <LocationRadiusContainer locations={Array.isArray(locationsData) ? locationsData : []} />
    </div>
  );
}

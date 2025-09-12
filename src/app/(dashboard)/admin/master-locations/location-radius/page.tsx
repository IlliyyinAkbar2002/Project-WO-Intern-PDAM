import LocationRadiusContainer from "@/components/admin/master-locations/location-radius/LocationRadiusContainer";
import { getLocations } from "@/services";

export default async function LocationRadiusPage() {
  const locationsData = await getLocations();
  return <LocationRadiusContainer data={locationsData} />;
}

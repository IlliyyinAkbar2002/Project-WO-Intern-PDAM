import { WorkorderInput } from "@/types/workorderTypes";

export const prepareWorkorderForm = (form: any): WorkorderInput => {
   const { startDate, startTime, ...rest } = form; 
   return {
    ...rest,
    latitude: form.jenisLokasiId === 2 ? null : form.latitude,
    longitude: form.jenisLokasiId === 2 ? null : form.longitude,
  };
}
import { add, format, isValid, parse } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { id } from "date-fns/locale";

const timeZone = "Asia/Jakarta";

export function calculateEndDate(
  startDate: string,
  startTime: string,
  duration: number | null,
  unit: string
): string {
  if (!startDate || !startTime || duration === null || isNaN(duration) || !unit) {
    return "";
  }

  const startDateTime = new Date(`${startDate}T${startTime}`);
  if (isNaN(startDateTime.getTime())) {
    return "";
  }

  let newDate = startDateTime;

  switch (unit) {
    case "Hari":
      newDate = add(startDateTime, { days: duration });
      break;
    case "Jam":
      newDate = add(startDateTime, { hours: duration });
      break;
    case "Bulan":
      newDate = add(startDateTime, { months: duration });
      break;
    default:
      return "";
  }

  const zonedDate = toZonedTime(newDate, timeZone);
  return format(zonedDate, "EEEE, d MMMM yyyy HH:mm 'WIB'", { locale: id });
}

export function formatDate(date: string): string {
  if (!date) return "";

  const parsedDate = parse(date, "EEEE, dd MMMM yyyy HH:mm 'WIB'", new Date(), { locale: id });

  if (!isValid(parsedDate)) return "";

  return format(parsedDate, "yyyy-MM-dd HH:mm:ss");
}
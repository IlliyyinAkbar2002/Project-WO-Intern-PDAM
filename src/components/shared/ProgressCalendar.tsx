import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { Value } from "react-calendar/dist/shared/types.js";

const progressData = [
  { date: "2025-06-01", status: "onprogress", note: "Mulai pengerjaan" },
  { date: "2025-06-05", status: "onprogress" },
  { date: "2025-06-03", status: "freeze", note: "Hujan deras" },
  { date: "2025-06-04", status: "onprogress" },
];

const dateStatusMap = progressData.reduce((acc, item) => {
  acc[item.date] = item;
  return acc;
}, {} as Record<string, (typeof progressData)[number]>);

export default function ProgressCalendar() {
  const [value, setValue] = useState<Value>(new Date());

  return (
    <div className="rounded-lg text-sm">
      <Tooltip id="calendar-tooltip" />
      <Calendar
        locale="id-ID"
        onChange={setValue}
        value={value}
        selectRange={false}
        tileClassName={({ date }) => {
          const iso = date.toISOString().split("T")[0];
          const item = dateStatusMap[iso];
          if (!item) return;
          if (item.status === "onprogress") return "calendar-onprogress";
          if (item.status === "freeze") return "calendar-freeze";
        }}
        tileContent={({ date }) => {
          const iso = date.toISOString().split("T")[0];
          const item = dateStatusMap[iso];
          if (item?.note) {
            return (
              <div
                data-tooltip-id="calendar-tooltip"
                data-tooltip-content={item.note}
              />
            );
          }
        }}
      />
    </div>
  );
}

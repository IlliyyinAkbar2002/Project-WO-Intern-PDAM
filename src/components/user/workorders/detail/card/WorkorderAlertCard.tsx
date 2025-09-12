import { Workorder } from "@/types";

interface WorkorderAlertProps {
  title?: string;
  description?: string;
  time?: string;
}

export default function WorkorderAlertCard({
  title,
  description,
  time,
}: WorkorderAlertProps) {
  return (
    <div className="p-4 rounded-xl border border-yellow-300 bg-yellow-50 text-yellow-900 space-y-2">
      <h4 className="text-sm font-semibold">Alasan {title}</h4>
      <p className="text-sm">{description}</p>
      <p className="text-xs text-gray-500">
       {time}
      </p>
    </div>
  );
}

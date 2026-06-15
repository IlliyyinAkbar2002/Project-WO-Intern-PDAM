import React from "react";

type Props = {
  title: string;
  description?: string;
  value?: string | number;
  href?: string;
};

export default function AdminDashboardCard({ title, description, value, href = "#" }: Props) {
  return (
    <a href={href} className="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs hover:bg-neutral-secondary-medium">
      <div className="flex items-start justify-between">
        <div>
          <h5 className="mb-2 text-lg font-semibold tracking-tight text-heading leading-6">{title}</h5>
          {description && <p className="text-body text-sm">{description}</p>}
        </div>
        {value !== undefined && (
          <div className="text-heading text-xl font-bold ml-4">{value}</div>
        )}
      </div>
    </a>
  );
}

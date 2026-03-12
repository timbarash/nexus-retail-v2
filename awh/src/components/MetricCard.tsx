import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  subtitle?: string;
}

export default function MetricCard({ label, value, icon, subtitle }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-panel-300">{label}</p>
          <p className="mt-1 text-2xl font-bold text-navy-800">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-panel-300">{subtitle}</p>}
        </div>
        {icon && (
          <div className="rounded-lg bg-dutchie-50 p-2 text-dutchie-900">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

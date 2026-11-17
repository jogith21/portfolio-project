import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: React.ReactNode;
  accent?: 'navy' | 'blue' | 'emerald' | 'amber' | 'red';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sublabel,
  icon,
  accent = 'blue',
}) => {
  const iconTone: Record<NonNullable<StatCardProps['accent']>, string> = {
    navy: 'bg-[#172554]/8 text-[#172554]',
    blue: 'bg-[#2563EB]/10 text-[#2563EB]',
    emerald: 'bg-[#10B981]/12 text-emerald-700',
    amber: 'bg-amber-100/80 text-amber-700',
    red: 'bg-red-100/80 text-red-700',
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#64748B] truncate">{label}</p>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-[#0F172A] tabular-nums">
            {value}
          </p>
          {sublabel && (
            <p className="mt-1 text-xs text-[#64748B] truncate">{sublabel}</p>
          )}
        </div>
        {icon && (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconTone[accent]}`}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

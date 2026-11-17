import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-base font-semibold text-[#0F172A]">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm text-[#64748B]">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex min-h-[40px] items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 whitespace-nowrap"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

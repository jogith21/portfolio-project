import React from 'react';

interface LoadingSkeletonProps {
  rows?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ rows = 3 }) => {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading records">
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-slate-200 bg-white p-5 animate-pulse"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="h-4 w-1/3 rounded bg-slate-200" />
              <div className="h-3 w-1/2 rounded bg-slate-100" />
            </div>
            <div className="h-8 w-24 rounded-lg bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
};

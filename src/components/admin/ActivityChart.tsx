import React from 'react';

interface CategoryStat {
  label: string;
  count: number;
}

interface WeeklyPoint {
  day: string;
  applications: number;
  hires: number;
}

interface ActivityChartProps {
  categoryStats: CategoryStat[];
  weeklyActivity: WeeklyPoint[];
}

export const ActivityChart: React.FC<ActivityChartProps> = ({
  categoryStats,
  weeklyActivity,
}) => {
  const maxCategory = Math.max(1, ...categoryStats.map((c) => c.count));
  const maxWeekly = Math.max(1, ...weeklyActivity.map((w) => w.applications));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-base font-semibold text-[#0F172A]">
              Weekly Applications & Hires
            </h3>
            <p className="text-xs text-[#64748B]">
              7-day marketplace matching activity across Indian hubs
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#64748B]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-[#2563EB]" aria-hidden="true" />
              Applications
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-[#10B981]" aria-hidden="true" />
              Hires
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-7 items-end gap-3 h-44 pt-4 border-b border-slate-100 pb-2">
          {weeklyActivity.map((point) => {
            const appHeight = Math.round((point.applications / maxWeekly) * 100);
            const hireHeight = Math.round((point.hires / maxWeekly) * 100);
            return (
              <div key={point.day} className="flex flex-col items-center justify-end h-full gap-2">
                <div className="flex items-end gap-1 h-full w-full justify-center">
                  <div
                    className="w-3 rounded-t bg-[#2563EB] transition-all"
                    style={{ height: `${Math.max(8, appHeight)}%` }}
                    title={`${point.day}: ${point.applications} applications`}
                  />
                  <div
                    className="w-3 rounded-t bg-[#10B981] transition-all"
                    style={{ height: `${Math.max(6, hireHeight)}%` }}
                    title={`${point.day}: ${point.hires} hires`}
                  />
                </div>
                <span className="text-[11px] font-medium text-[#64748B] tabular-nums">
                  {point.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div>
          <h3 className="font-display text-base font-semibold text-[#0F172A]">
            Jobs by Trade Category
          </h3>
          <p className="text-xs text-[#64748B]">
            Distribution of active and recently moderated job listings
          </p>
        </div>

        <div className="mt-5 space-y-3.5">
          {categoryStats.map((cat) => {
            const pct = Math.round((cat.count / maxCategory) * 100);
            return (
              <div key={cat.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-[#0F172A]">{cat.label}</span>
                  <span className="font-mono text-[#64748B] tabular-nums">
                    {cat.count} {cat.count === 1 ? 'listing' : 'listings'}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#172554] transition-all"
                    style={{ width: `${Math.max(6, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

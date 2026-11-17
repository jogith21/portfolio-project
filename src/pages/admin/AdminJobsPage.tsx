import React, { useMemo, useState } from 'react';
import { Ban, CheckCircle2, ClipboardList, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../hooks/useConfirm';
import { formatINR } from '../../utils/formatters';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AdminShell } from './AdminShell';

export const AdminJobsPage: React.FC = () => {
  const { state, moderateJobListing } = useApp();
  const { confirmState, requestConfirm, closeConfirm, handleConfirm } = useConfirm();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | 'Active' | 'Reported' | 'Deactivated'>('All');

  const filtered = useMemo(() => {
    return state.jobs.filter((job) => {
      if (filter === 'Active' && job.status !== 'Active') return false;
      if (filter === 'Reported' && !job.reported) return false;
      if (filter === 'Deactivated' && job.status !== 'Deactivated') return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          job.title.toLowerCase().includes(q) ||
          job.employerName.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [state.jobs, query, filter]);

  return (
    <AdminShell pageTitle="Job Listings">
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jobs by title, employer, or city..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1">
            {(['All', 'Active', 'Reported', 'Deactivated'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`min-h-[34px] rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  filter === tab
                    ? 'bg-white text-[#172554] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="h-6 w-6" />}
            title="No job listings match this filter"
            description="Adjust your search query or moderation status filter."
          />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-[#64748B]">
                  <tr>
                    <th className="px-5 py-3.5">Job Listing & Employer</th>
                    <th className="px-5 py-3.5">Location</th>
                    <th className="px-5 py-3.5">Wage</th>
                    <th className="px-5 py-3.5">Flag / Report</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#0F172A]">{job.title}</p>
                        <p className="text-xs text-[#64748B]">
                          {job.employerName} · {job.skillCategory}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 whitespace-nowrap">
                        {job.location}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-[#172554] tabular-nums whitespace-nowrap">
                        {formatINR(job.wageAmount)}
                      </td>
                      <td className="px-5 py-4 text-xs">
                        {job.reported ? (
                          <span className="text-red-700 font-medium">
                            Flagged: {job.reportReason ?? 'Suspicious terms'}
                          </span>
                        ) : (
                          <span className="text-[#64748B]">Clean</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        {job.status !== 'Deactivated' ? (
                          <button
                            type="button"
                            onClick={() =>
                              requestConfirm({
                                title: 'Deactivate Job Listing',
                                description: `Deactivate "${job.title}"? It will immediately be hidden from the Worker job board.`,
                                confirmLabel: 'Deactivate Listing',
                                variant: 'danger',
                                onConfirm: () => moderateJobListing(job.id, 'Deactivated'),
                              })
                            }
                            className="inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50 whitespace-nowrap"
                          >
                            <Ban className="h-3.5 w-3.5" />
                            Deactivate
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => moderateJobListing(job.id, 'Active')}
                            className="inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100 whitespace-nowrap"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Restore Active
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        confirmState={confirmState}
        onCancel={closeConfirm}
        onConfirm={handleConfirm}
      />
    </AdminShell>
  );
};

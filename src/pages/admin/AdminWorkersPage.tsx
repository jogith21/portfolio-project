import React, { useMemo, useState } from 'react';
import { Search, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../hooks/useConfirm';
import { formatDate, formatINR } from '../../utils/formatters';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AdminShell } from './AdminShell';

export const AdminWorkersPage: React.FC = () => {
  const { state, setWorkerAccountStatus } = useApp();
  const { confirmState, requestConfirm, closeConfirm, handleConfirm } = useConfirm();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Suspended'>('All');

  const filtered = useMemo(() => {
    return state.workers.filter((w) => {
      if (statusFilter !== 'All' && w.accountStatus !== statusFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          w.name.toLowerCase().includes(q) ||
          w.location.toLowerCase().includes(q) ||
          w.skills.some((s) => s.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [state.workers, query, statusFilter]);

  return (
    <AdminShell pageTitle="Workers">
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search workers by name, skill, or city..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
            {(['All', 'Active', 'Suspended'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`min-h-[34px] rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  statusFilter === tab
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
            icon={<Users className="h-6 w-6" />}
            title="No workers match your search"
            description="Adjust your search query or account status filter."
          />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-[#64748B]">
                  <tr>
                    <th className="px-5 py-3.5">Worker</th>
                    <th className="px-5 py-3.5">Skills & Exp</th>
                    <th className="px-5 py-3.5">Location</th>
                    <th className="px-5 py-3.5">Expected Wage</th>
                    <th className="px-5 py-3.5">Joined</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((worker) => (
                    <tr key={worker.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#0F172A]">{worker.name}</p>
                        <p className="text-xs text-[#64748B] tabular-nums">{worker.phone}</p>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-700">
                        {worker.skills.join(', ')} · {worker.experienceYears} yrs
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 whitespace-nowrap">
                        {worker.location}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-[#172554] tabular-nums whitespace-nowrap">
                        {formatINR(worker.expectedDailyWage)}/day
                      </td>
                      <td className="px-5 py-4 text-xs text-[#64748B] tabular-nums whitespace-nowrap">
                        {formatDate(worker.joinedAt)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={worker.accountStatus} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        {worker.accountStatus === 'Active' ? (
                          <button
                            type="button"
                            onClick={() =>
                              requestConfirm({
                                title: 'Suspend Worker Account',
                                description: `Suspend ${worker.name}'s account? They will be hidden from employer search results.`,
                                confirmLabel: 'Suspend Account',
                                variant: 'danger',
                                onConfirm: () => setWorkerAccountStatus(worker.id, 'Suspended'),
                              })
                            }
                            className="min-h-[34px] rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setWorkerAccountStatus(worker.id, 'Active')}
                            className="min-h-[34px] rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
                          >
                            Reactivate
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

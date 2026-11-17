import React, { useMemo, useState } from 'react';
import { Building2, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../hooks/useConfirm';
import { formatDate } from '../../utils/formatters';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AdminShell } from './AdminShell';

export const AdminEmployersPage: React.FC = () => {
  const { state, setEmployerAccountStatus } = useApp();
  const { confirmState, requestConfirm, closeConfirm, handleConfirm } = useConfirm();
  const [query, setQuery] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState<'All' | 'Verified' | 'Unverified'>('All');

  const filtered = useMemo(() => {
    return state.employers.filter((e) => {
      if (verifiedFilter === 'Verified' && !e.verified) return false;
      if (verifiedFilter === 'Unverified' && e.verified) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          e.companyName.toLowerCase().includes(q) ||
          e.contactName.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [state.employers, query, verifiedFilter]);

  return (
    <AdminShell pageTitle="Employers">
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search contractors by company, contact, or city..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
            {(['All', 'Verified', 'Unverified'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setVerifiedFilter(tab)}
                className={`min-h-[34px] rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  verifiedFilter === tab
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
            icon={<Building2 className="h-6 w-6" />}
            title="No employers found"
            description="Adjust your search query or verification filter."
          />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-[#64748B]">
                  <tr>
                    <th className="px-5 py-3.5">Business & Contact</th>
                    <th className="px-5 py-3.5">Location</th>
                    <th className="px-5 py-3.5">Registration ID</th>
                    <th className="px-5 py-3.5">Verification</th>
                    <th className="px-5 py-3.5">Account</th>
                    <th className="px-5 py-3.5">Joined</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#0F172A]">{emp.companyName}</p>
                        <p className="text-xs text-[#64748B]">
                          {emp.contactName} · {emp.phone}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 whitespace-nowrap">
                        {emp.location}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-700 whitespace-nowrap">
                        {emp.registrationNumber}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={emp.verified ? 'Verified' : emp.verificationStatus} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={emp.accountStatus} />
                      </td>
                      <td className="px-5 py-4 text-xs text-[#64748B] tabular-nums whitespace-nowrap">
                        {formatDate(emp.joinedAt)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {emp.accountStatus === 'Active' ? (
                          <button
                            type="button"
                            onClick={() =>
                              requestConfirm({
                                title: 'Suspend Employer Account',
                                description: `Suspend ${emp.companyName}? They will no longer be able to publish active shifts.`,
                                confirmLabel: 'Suspend',
                                variant: 'danger',
                                onConfirm: () => setEmployerAccountStatus(emp.id, 'Suspended'),
                              })
                            }
                            className="min-h-[34px] rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEmployerAccountStatus(emp.id, 'Active')}
                            className="min-h-[34px] rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
                          >
                            Activate
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
